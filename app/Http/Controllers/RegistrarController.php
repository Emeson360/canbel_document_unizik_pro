<?php

namespace App\Http\Controllers;

use App\Constants\DocumentStatuses;
use App\Constants\DocumentTypes;
use App\Constants\UserRoles;
use App\Models\Department;
use App\Models\Document;
use App\Models\DocumentParamsPositionSetting;
use App\Models\LayoutSettingProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class RegistrarController extends Controller
{

    private $role_name;

    public function __construct()
    {
        $role = UserRoles::ROLES_ALPHA[UserRoles::Registrar];
        $this->role_name = $role;
    }


    public function dashboard()
    {

        $pendingApprovalCount = Document::where([
            ['status', DocumentStatuses::AWAITING_APPROVAL],
        ])->count();
        $refusalCount = Document::where([
            ['status', DocumentStatuses::REFUSED],
        ])->count();
        $recentDocuments = Document::with(["department", "issuer"])
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render("dashboard/$this->role_name/Dashboard", [
            "dashStats" => [
                "pendingApprovals" => $pendingApprovalCount,
                "refusalCount" => $refusalCount,
            ],
            "recentDocuments" => $recentDocuments,
            "documentStatuses" => DocumentStatuses::STATUSES_ALPHA,
        ]);
    }

    public function show_documents(Request $request)
    {
        // filters
        $query = $request->query('query');
        $status = $request->query('status');
        $type = $request->query('type');
        $department = $request->query('department');
        $page = $request->query('pg', 1);
        $limit = $request->query('limit', 20);

        $dpts = Department::get();
        $baseQuery = Document::with(["department", "issuer"]);

        if ($query) {
            $baseQuery->where(function ($q) use ($query) {
                $q->where('holders_name', 'like', '%' . $query . '%')
                    ->orWhere('registration_number', 'like', '%' . $query . '%');
            });
        }

        if ($status) {
            $baseQuery->where("status", $status);
        }

        if ($type) {
            $baseQuery->where("type", $type);
        }

        if ($department) {
            $baseQuery->where("department_id", $department);
        }

        $documents = $baseQuery->paginate($limit, ['*'], 'pg', $page);

        // dd($documents);
        $docStatuses = DocumentStatuses::STATUSES_ALPHA;
        $docTypes = DocumentTypes::Types;
        // dd($vv);
        return Inertia::render("dashboard/$this->role_name/Documents", [
            "allDocuments" => $documents,
            "documentStatuses" => $docStatuses,
            "documentTypes" => $docTypes,
            "departments" => $dpts,
            "filters" => [
                "query" => $query,
                "status" => $status,
                "type" => $type,
                "department" => $department,
            ]
        ]);
    }


    public function show_document_preview($id)
    {
        $document = Document::with(["department", "approver", "faculty"])->where('id', $id)->first();
        $docStatuses = DocumentStatuses::STATUSES_ALPHA;

        if ($document && $document->passport_photo) {
            $document->passport_photo_url = asset('storage/uploaded_student_passport/' . $document->passport_photo);
        }

        $positionSettings = $document
            ? DocumentParamsPositionSetting::where('document_type', $document->type)->get()
            : collect();

        // dd($docTypes);
        return Inertia::render("dashboard/$this->role_name/PreviewDocument", [
            "document" => $document,
            "documentStatuses" => $docStatuses,
            "positionSettings" => $positionSettings,
            "layoutSettingProfiles" => LayoutSettingProfile::all(),
        ]);
    }

    public function approve_refuse_document(Request $request, $id)
    {
        $comment = $request->refusal_comment;
        $isActionApprove = $request->isActionApprove;
        $document = Document::find($id);
        $action = $isActionApprove === 1 ? "approved" : "refused";

        if (!$document) {
            return back()->with("error", "Invalid document");
        }

        try {
            $document->status = $isActionApprove === 1 ? DocumentStatuses::APPROVED : DocumentStatuses::REFUSED;
            $document->approved_by = Auth::user()->id;

            if ($comment) {
                $document->refusal_comment = $comment;
            }

            $document->save();
            return redirect()->route("registrar.documents_home")->with("success", "Document issuance $action!");
        } catch (\Exception $e) {
            back()->with("error", "An error occurred, try again later");

            \Log::error("Error $action document: " . $e->getMessage() . ". On line: " . $e->getLine());
        }
    }

    public function show_settings()
    {
        return Inertia::render("dashboard/$this->role_name/Settings");
    }
}
