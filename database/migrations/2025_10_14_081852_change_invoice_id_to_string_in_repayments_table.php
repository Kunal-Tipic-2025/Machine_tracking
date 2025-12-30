<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('repayments', function (Blueprint $table) {
            // Change invoice_id to string (VARCHAR 50)
            $table->string('invoice_id', 50)->change();
        });
    }

    public function down(): void
    {
        Schema::table('repayments', function (Blueprint $table) {
            // Revert back to integer (if it was INT before)
            $table->unsignedBigInteger('invoice_id')->change();
        });
    }
};
