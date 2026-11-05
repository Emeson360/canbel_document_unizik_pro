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
            $table->integer('nin_x')->nullable()->after('effective_date_y');
            $table->integer('nin_y')->nullable()->after('nin_x');
            $table->integer('dob_x')->nullable()->after('nin_y');
            $table->integer('dob_y')->nullable()->after('dob_x');
            $table->integer('faculty_x')->nullable()->after('dob_y');
            $table->integer('faculty_y')->nullable()->after('faculty_x');
            $table->integer('passport_photo_x')->nullable()->after('faculty_y');
            $table->integer('passport_photo_y')->nullable()->after('passport_photo_x');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('document_params_position_settings', function (Blueprint $table) {
            $table->dropColumn([
                'nin_x',
                'nin_y',
                'dob_x',
                'dob_y',
                'faculty_x',
                'faculty_y',
                'passport_photo_x',
                'passport_photo_y',
            ]);
        });
    }
};
