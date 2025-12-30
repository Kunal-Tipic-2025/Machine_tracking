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
        Schema::table('machine_logs', function (Blueprint $table) {
            $table->foreignId('mode_id')
                  ->nullable()  // Allow null if mode is optional initially
                  ->after('operator_id')  // Position after operator_id for organization
                  ->constrained('modes')  // Foreign key to 'modes' table (create modes table first if needed)
                  ->onDelete('set null'); // Set to null if referenced mode is deleted
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('machine_logs', function (Blueprint $table) {
            $table->dropForeign(['mode_id']);  // Drop foreign key first
            $table->dropColumn('mode_id');     // Then drop column
        });
    }
};