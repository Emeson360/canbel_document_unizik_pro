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
        Schema::table('documents', function (Blueprint $table) {
            $table->foreignId('faculty_id')->nullable()->after('faculty')->constrained()->nullOnDelete();
        });

        DB::statement(
            'UPDATE documents d
             JOIN faculties f ON f.key = d.faculty
             SET d.faculty_id = f.id'
        );

        Schema::table('documents', function (Blueprint $table) {
            $table->dropColumn('faculty');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->string('faculty')->nullable()->after('faculty_id');
        });

        DB::statement(
            'UPDATE documents d
             JOIN faculties f ON f.id = d.faculty_id
             SET d.faculty = f.key'
        );

        Schema::table('documents', function (Blueprint $table) {
            $table->dropConstrainedForeignId('faculty_id');
        });
    }
};
