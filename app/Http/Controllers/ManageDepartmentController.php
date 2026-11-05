<?php

namespace App\Http\Controllers;

use App\Constants\UserRoles;
use App\Models\Department;
use App\Models\Faculty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ManageDepartmentController extends Controller
{

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
     * Display a listing of the staff members.
     *
     * @return \Inertia\Response
     */
    public function showManageDpts(Request $request)
    {
        // filters
        $page = $request->query('pg', 1);
        $limit = $request->query('limit', 100);

        $dpts = Department::with('faculty')->paginate($limit, ['*'], 'pg', $page);
        $faculties = Faculty::paginate($limit, ['*'], 'pg', $page);

        return Inertia::render("dashboard/{$this->roleName()}/ManageDpts", [
            'dpts' => $dpts,
            'faculties' => $faculties,
        ]);
    }

    /**
     * Store a newly created dpt in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function storeDpt(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'key' => 'required|string|max:255|unique:departments',
            'faculty_id' => 'nullable|exists:faculties,id',
        ]);

        Department::create([
            'name' => $validated['name'],
            'key' => $validated['key'],
            'faculty_id' => $validated['faculty_id'] ?? null,
        ]);

        return redirect()->route("{$this->roleName()}.manage-dpts")
            ->with('success', 'Dpt created successfully.');
    }

    /**
     * update a newly created dpt in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function patchDpt(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required',
            'name' => 'required|string|max:255',
            'key' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) use ($request) {
                    if ($value !== $request->oldKey) {
                        // Only check uniqueness if the key has changed
                        $exists = Department::where('key', $value)
                            ->where('id', '!=', $request->id)
                            ->exists();

                        if ($exists) {
                            $fail('The ' . $attribute . ' has already been taken.');
                        }
                    }
                }
            ],
            'oldKey' => 'required|string|max:255',
            'faculty_id' => 'nullable|exists:faculties,id',
        ]);

        $dpt = Department::find($request->id);
        $dpt->name = $validated['name'];
        $dpt->key = $validated['key'];
        $dpt->faculty_id = $validated['faculty_id'] ?? null;
        $dpt->save();

        return redirect()->route("{$this->roleName()}.manage-dpts")
            ->with('success', 'Dpt updated successfully.');
    }

    /**
     * Store a newly created faculty in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function storeFaculty(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'key' => 'required|string|max:255|unique:faculties',
        ]);

        Faculty::create([
            'name' => $validated['name'],
            'key' => $validated['key'],
        ]);

        return redirect()->route("{$this->roleName()}.manage-dpts")
            ->with('success', 'Faculty created successfully.');
    }

    /**
     * Update an existing faculty in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function patchFaculty(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required',
            'name' => 'required|string|max:255',
            'key' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) use ($request) {
                    if ($value !== $request->oldKey) {
                        // Only check uniqueness if the key has changed
                        $exists = Faculty::where('key', $value)
                            ->where('id', '!=', $request->id)
                            ->exists();

                        if ($exists) {
                            $fail('The ' . $attribute . ' has already been taken.');
                        }
                    }
                }
            ],
            'oldKey' => 'required|string|max:255',
        ]);

        $faculty = Faculty::find($request->id);
        $faculty->name = $validated['name'];
        $faculty->key = $validated['key'];
        $faculty->save();

        return redirect()->route("{$this->roleName()}.manage-dpts")
            ->with('success', 'Faculty updated successfully.');
    }

}
