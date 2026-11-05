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
        Schema::create('document_params_position_settings', function (Blueprint $table) {
            $table->id();
            $table->string('document_type')->unique();
            $table->integer('unique_name_x')->nullable();
            $table->integer('unique_name_y')->nullable();
            $table->integer('holders_name_x')->nullable();
            $table->integer('holders_name_y')->nullable();
            $table->integer('registration_number_x')->nullable();
            $table->integer('registration_number_y')->nullable();
            $table->integer('department_name_x')->nullable();
            $table->integer('department_name_y')->nullable();
            $table->integer('session_x')->nullable();
            $table->integer('session_y')->nullable();
            $table->integer('ggpa_x')->nullable();
            $table->integer('ggpa_y')->nullable();
            $table->integer('ggpa_class_x')->nullable();
            $table->integer('ggpa_class_y')->nullable();
            $table->integer('effective_date_x')->nullable();
            $table->integer('effective_date_y')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_params_position_settings');
    }
};
