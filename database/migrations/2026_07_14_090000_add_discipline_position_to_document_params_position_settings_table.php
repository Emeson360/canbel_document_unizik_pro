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
        Schema::table('document_params_position_settings', function (Blueprint $table) {
            $table->integer('discipline_x')->nullable()->after('department_name_y');
            $table->integer('discipline_y')->nullable()->after('discipline_x');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('document_params_position_settings', function (Blueprint $table) {
            $table->dropColumn(['discipline_x', 'discipline_y']);
        });
    }
};
