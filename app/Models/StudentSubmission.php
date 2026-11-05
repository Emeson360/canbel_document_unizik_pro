<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentSubmission extends Model
{
    use HasFactory;

    protected $table = 'students_submissions';

    protected $fillable = [
        'full_name',
        'email',
        'document_type',
        'registration_number',
        'nin',
        'dob',
        'faculty_id',
        'department_id',
        'passport_photo',
        'status',
    ];

    protected $casts = [
        'dob' => 'date',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function faculty()
    {
        return $this->belongsTo(Faculty::class);
    }
}
