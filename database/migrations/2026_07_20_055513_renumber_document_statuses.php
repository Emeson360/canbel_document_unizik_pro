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
        // PENDING(0) rows are already gone (see delete_pending_documents),
        // so only 1=AWAITING_APPROVAL, 2=APPROVED, 3=REFUSED remain. Shift
        // them down to 0/1/2 to match the renumbered DocumentStatuses enum.
        DB::table('documents')->update(['status' => DB::raw('status - 1')]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('documents')->update(['status' => DB::raw('status + 1')]);
    }
};
