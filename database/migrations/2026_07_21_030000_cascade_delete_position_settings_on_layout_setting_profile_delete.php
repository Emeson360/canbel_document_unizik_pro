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
            $table->dropForeign('dpps_layout_setting_profile_id_foreign');
        });

        Schema::table('document_params_position_settings', function (Blueprint $table) {
            $table->foreign('layout_setting_profile_id', 'dpps_layout_setting_profile_id_foreign')
                ->references('id')->on('layout_setting_profiles')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('document_params_position_settings', function (Blueprint $table) {
            $table->dropForeign('dpps_layout_setting_profile_id_foreign');
        });

        Schema::table('document_params_position_settings', function (Blueprint $table) {
            $table->foreign('layout_setting_profile_id', 'dpps_layout_setting_profile_id_foreign')
                ->references('id')->on('layout_setting_profiles')
                ->nullOnDelete();
        });
    }
};
