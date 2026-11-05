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
            $table->dropColumn(['unique_name_x', 'unique_name_y']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('document_params_position_settings', function (Blueprint $table) {
            $table->integer('unique_name_x')->nullable();
            $table->integer('unique_name_y')->nullable();
        });
    }
};
