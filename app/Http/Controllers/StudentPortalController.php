<?php

namespace App\Http\Controllers;

use App\Constants\DocumentTypes;
use App\Models\Department;
use App\Models\Faculty;
use App\Models\StudentSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Validator;

class StudentPortalController extends Controller
{
    public function show()
    {
        return Inertia::render('studentPortal/Apply', [
            'departments' => Department::get(),
            'faculties' => Faculty::get(),
            'documentTypes' => DocumentTypes::Types,
        ]);
    }

    public function store(Request $request)
    {
        $vData = [
            'full_name' => 'required|string|max:150',
            'email' => 'required|email|max:150',
            'document_type' => 'required|in:' . implode(',', DocumentTypes::Types),
            'registration_number' => 'required|string|max:50|unique:students_submissions,registration_number',
            'nin' => 'required',
            'dob' => 'required|date|before_or_equal:today',
            'faculty_id' => 'required|exists:faculties,id',
            'department_id' => 'required|exists:departments,id',
            'passport_photo' => 'required|image|mimes:jpeg,jpg,png|max:10240',
        ];

        $validator = Validator::make($request->all(), $vData, [
            'registration_number.unique' => 'This registration number already exists.',
        ]);

        if (!$validator->passes()) {
            return back()->withErrors($validator->errors()->all());
        }

        $file = $request->file('passport_photo');
        $fileName = Str::uuid()->toString() . '.' . $file->getClientOriginalExtension();
        $file->storeAs('uploaded_student_passport', $fileName, 'public');

        // status is 0 by default
        StudentSubmission::create([
            'full_name' => $request->full_name,
            'email' => $request->email,
            'document_type' => $request->document_type,
            'registration_number' => $request->registration_number,
            'nin' => $request->nin,
            'dob' => $request->dob,
            'faculty_id' => $request->faculty_id,
            'department_id' => $request->department_id,
            'passport_photo' => $fileName,
        ]);

        return back()->with('success', 'Your information has been received.');
    }
}
