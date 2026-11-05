<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('document_params_position_settings', function (Blueprint $table) {
            $table->dropUnique('document_params_position_settings_document_type_unique');
            $table->unique(['document_type', 'layout_setting_profile_id'], 'dpps_document_type_layout_profile_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('document_params_position_settings', function (Blueprint $table) {
            $table->dropUnique('dpps_document_type_layout_profile_unique');
            $table->unique('document_type');
        });
    }
};
