<?php

namespace App\Http\Controllers;

use App\Constants\DisciplineTypes;
use App\Constants\DocumentStatuses;
use App\Constants\DocumentTypes;
use App\Constants\UserRoles;
use App\Models\Department;
use App\Models\Document;
use App\Models\DocumentParamsPositionSetting;
use App\Models\Faculty;
use App\Models\LayoutSettingProfile;
use App\Models\StudentSubmission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Validator;

class SupervisorController extends Controller
{

    private $role_name;

    public function __construct()
    {
        $role = UserRoles::ROLES_ALPHA[UserRoles::Supervisor];
        $this->role_name = $role;
    }


    public function dashboard()
    {

        $pendingApprovalCount = Document::where([
            ['status', DocumentStatuses::AWAITING_APPROVAL],
            ['registered_by', Auth::user()->id]
        ])->count();
        $refusalCount = Document::where([
            ['status', DocumentStatuses::REFUSED],
            ['registered_by', Auth::user()->id]
        ])->count();
        $recentDocuments = Document::with("department")
            ->where('registered_by', Auth::user()->id)
            ->latest()
            ->limit(5)
            ->get();
        $approvedSubmissionsCount = StudentSubmission::where('status', 1)->count();

        return Inertia::render("dashboard/$this->role_name/Dashboard", [
            "dashStats" => [
                "pendingApprovals" => $pendingApprovalCount,
                "refusalCount" => $refusalCount,
                "approvedSubmissions" => $approvedSubmissionsCount,
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
        $baseQuery = Document::with("department")->where([
            ["registered_by", Auth::user()->id]
        ]);

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

    public function show_issue_document(Request $request)
    {
        // documents can no longer be issued as "walk-in" papers — an
        // approved student submission is always required to auto-fill and
        // lock the verified identity fields
        $submissionId = $request->query('submission-id');
        $submission = $submissionId
            ? StudentSubmission::with(['department', 'faculty'])->where('status', 1)->find($submissionId)
            : null;

        if (!$submission) {
            return redirect()->route('supervisor.documents_home')
                ->with('error', 'Select an approved student submission to issue a document.');
        }

        if ($submission->passport_photo) {
            $submission->passport_photo_url = asset('storage/uploaded_student_passport/' . $submission->passport_photo);
        }

        $dpts = Department::get();

        return Inertia::render("dashboard/$this->role_name/IssueDocument", [
            "departments" => $dpts,
            "faculties" => Faculty::get(),
            "disciplines" => DisciplineTypes::Types,
            "submission" => $submission,
        ]);
    }

    /**
     * Derive the CGPA class from the numeric CGPA. Computed server-side so
     * the client can't submit an arbitrary classification.
     */
    private function classifyCgpa(float $cgpa): string
    {
        return match (true) {
            $cgpa >= 3.6 => 'First Class',
            $cgpa >= 3.0 => 'Second Class Upper Division',
            $cgpa >= 2.5 => 'Second Class Lower Division',
            $cgpa >= 2.0 => 'Third Class Division',
            $cgpa >= 1.0 => 'Pass',
            default => 'Fail',
        };
    }

    public function issue_document(Request $request)
    {

        $submissionValidator = Validator::make($request->all(), [
            'student_submission_id' => 'required|exists:students_submissions,id',
        ]);

        if (!$submissionValidator->passes()) {
            return back()->withErrors($submissionValidator->errors()->all());
        }

        // certificate type, registration number, NIN, DOB, and the passport
        // photo are locked on the frontend and must come from the approved
        // submission itself — never trust these as raw request input.
        $submission = StudentSubmission::where('id', $request->student_submission_id)
            ->where('status', 1)
            ->first();

        if (!$submission) {
            return back()->with('error', 'Select an approved student submission to issue a document.');
        }

        $holders_name = $request->holders_name;
        $department_id = $request->department_id;
        $discipline = $request->discipline;
        $effective_date = $request->effective_date;
        $cgpa = $request->cgpa;
        $faculty_id = $request->faculty_id;
        $now = now();
        $isPostgraduate = $submission->document_type === DocumentTypes::POSTGRADUATE;

        $vData = [
            'holders_name' => 'required|max:60',
            'department_id' => 'required',
            'discipline' => $isPostgraduate ? 'nullable' : ['required', 'in:' . implode(',', DisciplineTypes::Types)],
            'effective_date' => 'required',
            'cgpa' => $isPostgraduate ? 'nullable' : ['required', 'numeric', 'min:1', 'max:4'],
            'faculty_id' => 'required|exists:faculties,id',
        ];

        $validator = Validator::make($request->all(), $vData);

        if (!$validator->passes()) {
            return back()->withErrors($validator->errors()->all());
        }

        try {
            // TODO: unique validation for reg_num
            Document::create([
                'holders_name' => strtolower($holders_name),
                'department_id' => $department_id,
                'discipline' => $isPostgraduate ? null : $discipline,
                'effective_date' => $effective_date,
                'cgpa' => $isPostgraduate ? null : $cgpa,
                'cgpa_class' => $isPostgraduate ? null : $this->classifyCgpa((float) $cgpa),
                'registration_number' => strtolower($submission->registration_number),
                'nin' => $submission->nin,
                'dob' => $submission->dob,
                'faculty_id' => $faculty_id,
                'passport_photo' => $submission->passport_photo,
                'type' => $submission->document_type,
                'registered_date' => $now,
                'registered_by' => Auth::user()->id,
                'status' => DocumentStatuses::AWAITING_APPROVAL
            ]);

            // The submission has now been turned into a document — don't
            // delete the passport photo file, the document reuses it.
            $submission->delete();

            return redirect()->route('supervisor.documents_home')->with('success', "Success! Awaiting registrar approval");
        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error('Error issuing document: ' . $e->getMessage() . ". On line: " . $e->getLine());

            return back()->with('error', 'An error occurred. Please try again later.');
        }

    }

    public function show_update_document($id)
    {

        $document = Document::with('faculty')->where([
            ["id", $id],
            ["status", DocumentStatuses::REFUSED],
            ["registered_by", Auth::user()->id]
        ])->first();

        if ($document && $document->passport_photo) {
            $document->passport_photo_url = asset('storage/uploaded_student_passport/' . $document->passport_photo);
        }

        $dpts = Department::get();

        // dd($docTypes);
        return Inertia::render("dashboard/$this->role_name/UpdateDocument", [
            "document" => $document,
            "departments" => $dpts,
            "faculties" => Faculty::get(),
            "disciplines" => DisciplineTypes::Types,
        ]);
    }

    public function update_document(Request $request, $id)
    {

        $holders_name = $request->holders_name;
        $department_id = $request->department_id;
        $discipline = $request->discipline;
        $effective_date = $request->effective_date;
        $cgpa = $request->cgpa;
        $registration_number = $request->registration_number;
        $nin = $request->nin;
        $dob = $request->dob;
        $faculty_id = $request->faculty_id;
        // $now = now();
        $isPostgraduate = $request->type === DocumentTypes::POSTGRADUATE;

        $vData = [
            // 'document_id' => 'required',
            'type' => 'required',
            'holders_name' => 'required|max:60',
            'department_id' => 'required',
            'discipline' => ['exclude_if:type,' . DocumentTypes::POSTGRADUATE, 'required', 'in:' . implode(',', DisciplineTypes::Types)],
            'effective_date' => 'required',
            'cgpa' => ['exclude_if:type,' . DocumentTypes::POSTGRADUATE, 'required', 'numeric', 'min:1', 'max:4'],
            'registration_number' => 'required',
            'nin' => 'required',
            'dob' => 'required|date',
            'faculty_id' => 'required|exists:faculties,id',
            'passport_photo' => 'nullable|image|mimes:jpeg,jpg,png|max:10240',
        ];
        // dd($effective_date);
        $validator = Validator::make($request->all(), $vData);

        if (!$validator->passes()) {
            return back()->withErrors($validator->errors()->all());
        }

        $fileName = null;
        if ($request->hasFile('passport_photo')) {
            $file = $request->file('passport_photo');
            $fileName = Str::uuid()->toString() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('uploaded_student_passport', $fileName, 'public');
        }

        try {
            // TODO: unique validation for reg_num
            Document::where('id', $id)->update([
                'holders_name' => strtolower($holders_name),
                'department_id' => $department_id,
                'discipline' => $isPostgraduate ? null : $discipline,
                'effective_date' => $effective_date,
                'cgpa' => $isPostgraduate ? null : $cgpa,
                'cgpa_class' => $isPostgraduate ? null : $this->classifyCgpa((float) $cgpa),
                'registration_number' => strtolower($registration_number),
                'nin' => $nin,
                'dob' => $dob,
                'faculty_id' => $faculty_id,
                ...($fileName ? ['passport_photo' => $fileName] : []),
                // 'registered_date' => $now,
                // 'registered_by' => Auth::user()->id,
                'status' => DocumentStatuses::AWAITING_APPROVAL
            ]);

            return redirect()->route('supervisor.documents_home')->with('success', "Success! Awaiting registrar approval");
        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error('Error issuing document: ' . $e->getMessage() . ". On line: " . $e->getLine());

            return back()->with('error', 'An error occurred. Please try again later.');
        }

    }


    public function show_document_preview($id)
    {

        $document = Document::with(["department", "approver", "faculty"])->where([
            ["id", $id],
            ["registered_by", Auth::user()->id]
        ])->first();
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


    public function show_student_submissions(Request $request)
    {
        $query = $request->query('query');
        $page = $request->query('pg', 1);
        $limit = $request->query('limit', 10);

        // only approved submissions are shown here — pending ones are
        // triaged by the Assistant Supervisor
        $baseQuery = StudentSubmission::with(['department', 'faculty'])->where('status', 1);

        if ($query) {
            $baseQuery->where(function ($q) use ($query) {
                $q->where('full_name', 'like', '%' . $query . '%')
                    ->orWhere('registration_number', 'like', '%' . $query . '%');
            });
        }

        $submissions = $baseQuery->latest()->paginate($limit, ['*'], 'pg', $page);

        $submissions->getCollection()->transform(function ($submission) {
            $submission->passport_photo_url = $submission->passport_photo
                ? asset('storage/uploaded_student_passport/' . $submission->passport_photo)
                : null;

            return $submission;
        });

        return Inertia::render("dashboard/$this->role_name/StudentSubmissions", [
            "submissions" => $submissions,
            "filters" => [
                "query" => $query,
            ],
        ]);
    }

    public function approve_student_submission($id)
    {
        $submission = StudentSubmission::find($id);

        if (!$submission) {
            return back()->with('error', 'Student submission not found.');
        }

        $submission->status = 1; // approved
        $submission->save();

        return back()->with('success', 'Student submission approved!');
    }

    public function destroy_student_submission($id)
    {
        $submission = StudentSubmission::find($id);

        if (!$submission) {
            return back()->with('error', 'Student submission not found.');
        }

        if ($submission->passport_photo) {
            $filePath = 'public/uploaded_student_passport/' . $submission->passport_photo;
            if (Storage::exists($filePath)) {
                Storage::delete($filePath);
            }
        }

        $submission->delete();

        return back()->with('success', 'Student submission deleted!');
    }

    public function show_settings()
    {
        return Inertia::render("dashboard/$this->role_name/Settings");
    }

}
