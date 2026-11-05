<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentParamsPositionSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'document_type',
        'layout_setting_profile_id',
        'holders_name_x',
        'holders_name_y',
        'registration_number_x',
        'registration_number_y',
        'department_name_x',
        'department_name_y',
        'discipline_x',
        'discipline_y',
        'session_x',
        'session_y',
        'cgpa_x',
        'cgpa_y',
        'cgpa_class_x',
        'cgpa_class_y',
        'effective_date_x',
        'effective_date_y',
        'nin_x',
        'nin_y',
        'dob_x',
        'dob_y',
        'faculty_x',
        'faculty_y',
        'passport_photo_x',
        'passport_photo_y',
    ];

    public function layoutSettingProfile()
    {
        return $this->belongsTo(LayoutSettingProfile::class);
    }
}
