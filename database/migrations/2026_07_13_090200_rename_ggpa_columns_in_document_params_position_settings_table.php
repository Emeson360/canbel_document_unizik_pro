<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Using raw CHANGE COLUMN instead of Schema::renameColumn() because
        // that requires either MySQL 8.0.3+/MariaDB 10.5.2+ or doctrine/dbal,
        // neither of which is guaranteed here.
        DB::statement('ALTER TABLE document_params_position_settings CHANGE ggpa_x cgpa_x INT NULL');
        DB::statement('ALTER TABLE document_params_position_settings CHANGE ggpa_y cgpa_y INT NULL');
        DB::statement('ALTER TABLE document_params_position_settings CHANGE ggpa_class_x cgpa_class_x INT NULL');
        DB::statement('ALTER TABLE document_params_position_settings CHANGE ggpa_class_y cgpa_class_y INT NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('ALTER TABLE document_params_position_settings CHANGE cgpa_x ggpa_x INT NULL');
        DB::statement('ALTER TABLE document_params_position_settings CHANGE cgpa_y ggpa_y INT NULL');
        DB::statement('ALTER TABLE document_params_position_settings CHANGE cgpa_class_x ggpa_class_x INT NULL');
        DB::statement('ALTER TABLE document_params_position_settings CHANGE cgpa_class_y ggpa_class_y INT NULL');
    }
};
