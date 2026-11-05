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
            $table->foreignId('layout_setting_profile_id')
                ->nullable()
                ->after('document_type')
                ->constrained(indexName: 'dpps_layout_setting_profile_id_foreign')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('document_params_position_settings', function (Blueprint $table) {
            $table->dropForeign('dpps_layout_setting_profile_id_foreign');
            $table->dropColumn('layout_setting_profile_id');
        });
    }
};
