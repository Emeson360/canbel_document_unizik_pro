<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('students_submissions', function (Blueprint $table) {
            $table->foreignId('faculty_id')->nullable()->after('faculty')->constrained()->nullOnDelete();
        });

        DB::statement(
            'UPDATE students_submissions ss
             JOIN faculties f ON f.key = ss.faculty
             SET ss.faculty_id = f.id'
        );

        Schema::table('students_submissions', function (Blueprint $table) {
            $table->dropColumn('faculty');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students_submissions', function (Blueprint $table) {
            $table->string('faculty')->nullable()->after('faculty_id');
        });

        DB::statement(
            'UPDATE students_submissions ss
             JOIN faculties f ON f.id = ss.faculty_id
             SET ss.faculty = f.key'
        );

        Schema::table('students_submissions', function (Blueprint $table) {
            $table->dropConstrainedForeignId('faculty_id');
        });
    }
};
