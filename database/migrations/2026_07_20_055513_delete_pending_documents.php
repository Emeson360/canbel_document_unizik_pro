<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // status 0 = PENDING (blank, never-issued paper stock rows) — the
        // paper-stock feature is being removed, so these rows have no
        // meaning left and are hard-deleted (not soft-deleted).
        DB::table('documents')->where('status', 0)->delete();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Irreversible: the deleted rows cannot be reconstructed.
    }
};
