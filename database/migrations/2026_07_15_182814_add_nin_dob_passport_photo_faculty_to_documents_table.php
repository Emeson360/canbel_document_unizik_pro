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
        Schema::table('documents', function (Blueprint $table) {
            $table->string('nin')->nullable()->after('registration_number');
            $table->date('dob')->nullable()->after('nin');
            $table->string('faculty')->nullable()->after('dob');
            $table->string('passport_photo')->nullable()->after('faculty');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->dropColumn(['nin', 'dob', 'faculty', 'passport_photo']);
        });
    }
};
