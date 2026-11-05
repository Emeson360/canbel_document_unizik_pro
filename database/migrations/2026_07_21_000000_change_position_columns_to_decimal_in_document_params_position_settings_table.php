<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    const COLUMNS = [
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

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Using raw CHANGE COLUMN instead of Schema::table()->decimal() because
        // altering a column type requires doctrine/dbal, which isn't guaranteed here
        // (see the ggpa rename migration for the same reasoning).
        foreach (self::COLUMNS as $column) {
            DB::statement("ALTER TABLE document_params_position_settings CHANGE {$column} {$column} DECIMAL(8,2) NULL");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        foreach (self::COLUMNS as $column) {
            DB::statement("ALTER TABLE document_params_position_settings CHANGE {$column} {$column} INT NULL");
        }
    }
};
