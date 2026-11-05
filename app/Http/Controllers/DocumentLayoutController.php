<?php

namespace App\Http\Controllers;

use App\Constants\DocumentTypes;
use App\Constants\UserRoles;
use App\Models\DocumentParamsPositionSetting;
use App\Models\LayoutSettingProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DocumentLayoutController extends Controller
{
    const FIELDS = [
        'holders_name',
        'registration_number',
        'department_name',
        'discipline',
        'cgpa',
        'cgpa_class',
        'effective_date',
        'nin',
        'dob',
        'faculty',
        'passport_photo',
    ];

    // These fields don't apply to postgraduate documents (no discipline/CGPA classification).
    const FIELDS_HIDDEN_FOR_POSTGRADUATE = [
        'discipline',
        'cgpa',
        'cgpa_class',
        'faculty',
        'registration_number',
    ];

    // These fields don't apply to undergraduate documents.
    const FIELDS_HIDDEN_FOR_UNDERGRADUATE = [
        'cgpa',
        'faculty',
        'registration_number',
    ];

    /**
     * Resolve the alpha role name for the current authenticated user.
     * Must be called from within an action method, not the constructor —
     * the router instantiates controllers to gather middleware before the
     * 'auth'/role route middleware runs, so Auth::user() is null that early.
     */
    private function roleName(): string
    {
        return UserRoles::ROLES_ALPHA[Auth::user()->role];
    }

    /**
     * List the layout setting profiles.
     *
     * @return \Inertia\Response
     */
    public function showDocumentLayout()
    {
        return Inertia::render("dashboard/{$this->roleName()}/DocumentLayout", [
            'profiles' => LayoutSettingProfile::all(),
        ]);
    }

    /**
     * Display the document field position settings for a layout setting profile.
     *
     * @return \Inertia\Response
     */
    public function showDocumentLayoutProfile(LayoutSettingProfile $layoutSettingProfile)
    {
        return Inertia::render("dashboard/{$this->roleName()}/DocumentLayoutProfile", [
            'profile' => $layoutSettingProfile,
            'settings' => DocumentParamsPositionSetting::where('layout_setting_profile_id', $layoutSettingProfile->id)->get(),
            'documentTypes' => DocumentTypes::Types,
        ]);
    }

    /**
     * Create a new layout setting profile, seeding its position settings
     * from an existing profile picked as a template.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function storeDocumentLayoutProfile(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'show_document_template' => 'required|boolean',
            'layout_template_id' => 'required|exists:layout_setting_profiles,id',
        ]);

        DB::transaction(function () use ($validated) {
            $profile = LayoutSettingProfile::create([
                'name' => $validated['name'],
                'show_document_template' => $validated['show_document_template'],
            ]);

            $templateSettings = DocumentParamsPositionSetting::where('layout_setting_profile_id', $validated['layout_template_id'])->get();

            foreach ($templateSettings as $templateSetting) {
                $newSetting = $templateSetting->replicate();
                $newSetting->layout_setting_profile_id = $profile->id;
                $newSetting->save();
            }
        });

        return redirect()->route("{$this->roleName()}.document-layout")
            ->with('success', 'Layout profile created successfully.');
    }

    /**
     * Update a layout setting profile's own fields (name and/or show_document_template).
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateLayoutSettingProfile(Request $request, LayoutSettingProfile $layoutSettingProfile)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'show_document_template' => 'sometimes|required|boolean',
        ]);

        $layoutSettingProfile->update($validated);

        return redirect()->route("{$this->roleName()}.document-layout")
            ->with('success', 'Layout profile updated successfully.');
    }

    /**
     * Delete a layout setting profile.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroyLayoutSettingProfile(LayoutSettingProfile $layoutSettingProfile)
    {
        if ($layoutSettingProfile->is_default) {
            return back()->with('error', 'The default layout setting profile cannot be deleted.');
        }

        // Cascades to this profile's document_params_position_settings rows via
        // the ON DELETE CASCADE foreign key (no manual cleanup needed here).
        // basically auto-deletes position-settings under this profile
        $layoutSettingProfile->delete();

        return redirect()->route("{$this->roleName()}.document-layout")
            ->with('success', 'Layout profile deleted successfully.');
    }

    /**
     * Update the field positions for a document type within a layout setting profile.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateDocumentLayout(Request $request, LayoutSettingProfile $layoutSettingProfile)
    {
        $isPostgraduate = $request->document_type === DocumentTypes::POSTGRADUATE;
        $isUndergraduate = $request->document_type === DocumentTypes::UNDERGRADUATE;

        $rules = [
            'document_type' => 'required|in:' . implode(',', DocumentTypes::Types),
        ];

        foreach (self::FIELDS as $field) {
            if ($isPostgraduate && in_array($field, self::FIELDS_HIDDEN_FOR_POSTGRADUATE, true)) {
                continue;
            }

            if ($isUndergraduate && in_array($field, self::FIELDS_HIDDEN_FOR_UNDERGRADUATE, true)) {
                continue;
            }

            $rules["{$field}_x"] = 'required|numeric';
            $rules["{$field}_y"] = 'required|numeric';
        }

        $validated = $request->validate($rules);

        $setting = DocumentParamsPositionSetting::where('document_type', $validated['document_type'])
            ->where('layout_setting_profile_id', $layoutSettingProfile->id)
            ->first();

        if (! $setting) {
            return back()->with('error', 'Document layout position setting not configured for this document type.');
        }

        $setting->update($validated);

        return redirect()->route("{$this->roleName()}.document-layout.profile", $layoutSettingProfile)
            ->with('success', 'Document layout updated successfully.');
    }
}
