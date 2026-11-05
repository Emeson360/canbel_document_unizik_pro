<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Using raw CHANGE COLUMN instead of Schema::renameColumn() because
        // that requires either MySQL 8.0.3+/MariaDB 10.5.2+ or doctrine/dbal,
        // neither of which is guaranteed here.
        DB::statement('ALTER TABLE documents CHANGE ggpa cgpa VARCHAR(255) NULL');
        DB::statement('ALTER TABLE documents CHANGE ggpa_class cgpa_class VARCHAR(255) NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('ALTER TABLE documents CHANGE cgpa ggpa VARCHAR(255) NULL');
        DB::statement('ALTER TABLE documents CHANGE cgpa_class ggpa_class VARCHAR(255) NULL');
    }
};
