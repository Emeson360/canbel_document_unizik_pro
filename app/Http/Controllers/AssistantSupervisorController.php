<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Faculty;
use App\Models\StudentSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Validator;

class AssistantSupervisorController extends Controller
{

    public function show(Request $request)
    {
        $query = $request->query('query');
        $page = $request->query('pg', 1);
        $limit = $request->query('limit', 10);

        $baseQuery = StudentSubmission::with(['department', 'faculty'])->where('status', 0);

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

        return Inertia::render('assistantSupervisor/Submissions', [
            "submissions" => $submissions,
            "departments" => Department::get(),
            "faculties" => Faculty::get(),
            "filters" => [
                "query" => $query,
            ],
        ]);
    }

    public function update_student_submission(Request $request, $id)
    {
        $submission = StudentSubmission::find($id);

        if (!$submission) {
            return back()->with('error', 'Student submission not found.');
        }

        $vData = [
            'full_name' => 'required|string|max:150',
            'faculty_id' => 'required|exists:faculties,id',
            'department_id' => 'required|exists:departments,id',
        ];

        $validator = Validator::make($request->all(), $vData);

        if (!$validator->passes()) {
            return back()->withErrors($validator->errors()->all());
        }

        $submission->full_name = $request->full_name;
        $submission->faculty_id = $request->faculty_id;
        $submission->department_id = $request->department_id;
        $submission->status = 1; // approved
        $submission->save();

        return back()->with('success', 'Student submission updated and approved!');
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
        return Inertia::render('assistantSupervisor/Settings');
    }
}
