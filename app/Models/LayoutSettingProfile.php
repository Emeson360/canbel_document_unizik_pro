<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LayoutSettingProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'is_default',
        'show_document_template',
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'show_document_template' => 'boolean',
    ];

    public function positionSettings()
    {
        return $this->hasMany(DocumentParamsPositionSetting::class);
    }
}
