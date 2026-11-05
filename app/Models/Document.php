<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use HasFactory, SoftDeletes;


    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'type',
        'holders_name',
        'registration_number',
        'nin',
        'dob',
        'faculty_id',
        'passport_photo',
        'department_id',
        'discipline',
        'session',
        'cgpa',
        'cgpa_class',
        'effective_date',
        'logged_by',
        'registered_date',
        'registered_by',
        'approved_date',
        'approved_by',
        'status',
        'refusal_comment',
    ];

    protected $casts = [
        'department_id' => 'integer',
        'status' => 'integer',
        'dob' => 'date',
        'effective_date' => 'date',
        'registered_date' => 'date',
        'approved_date' => 'date',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function faculty()
    {
        return $this->belongsTo(Faculty::class);
    }

    public function issuer()
    {
        return $this->belongsTo(User::class, "registered_by");
    }

    public function approver()
    {
        return $this->belongsTo(User::class, "approved_by");
    }

}
