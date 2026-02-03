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
        Schema::table('machine_operator', function (Blueprint $table) {
            // Add mode_id as a JSON column, nullable by default
            $table->json('mode_id')->nullable()->after('operator_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('machine_operator', function (Blueprint $table) {
            $table->dropColumn('mode_id');
        });
    }
};
