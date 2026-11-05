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
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('unique_name')->unique()->nullable();
            $table->string('type')->nullable();
            $table->string('holders_name')->nullable();
            $table->string('registration_number')->nullable();
            $table->unsignedBigInteger('department_id')->nullable();
            $table->string('session')->nullable();
            $table->string('ggpa')->nullable();
            $table->string('ggpa_class')->nullable();
            $table->string('effective_date')->nullable();
            $table->string('logged_by')->nullable();
            $table->string('registered_date')->nullable();
            $table->string('registered_by')->nullable();
            $table->string('approved_date')->nullable();
            $table->string('approved_by')->nullable();
            $table->integer('status')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
