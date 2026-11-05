<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('students_submissions', function (Blueprint $table) {
            $table->id();
            $table->string('full_name')->nullable();
            $table->string('registration_number')->nullable();
            $table->string('nin')->nullable();
            $table->date('dob')->nullable();
            $table->string('faculty')->nullable();
            $table->foreignId('department_id')->constrained('departments')->nullable();
            $table->string('passport_photo')->nullable();
            $table->tinyInteger('status')->default(0); // 0 - pending, 1 - approved
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students_submissions');
    }
};
