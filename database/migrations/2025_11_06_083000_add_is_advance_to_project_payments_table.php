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
        Schema::table('project_payments', function (Blueprint $table) {
            // Add is_advance flag to identify advance payments
            $table->boolean('is_advance')
                  ->default(false)
                  ->after('payment_mode')
                  ->comment('Indicates if this payment record is an advance payment');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('project_payments', function (Blueprint $table) {
            $table->dropColumn('is_advance');
        });
    }
};
