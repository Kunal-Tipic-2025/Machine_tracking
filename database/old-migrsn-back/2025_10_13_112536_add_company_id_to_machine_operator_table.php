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
            // Add company_id as a foreign key (if your companies table exists)
            $table->unsignedBigInteger('company_id')->nullable()->after('id');

            // If there's a companies table and you want a relation:
            $table->foreign('company_id')
                  ->references('id')
                  ->on('company_info')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('machine_operator', function (Blueprint $table) {
            $table->dropForeign(['company_id']);
            $table->dropColumn('company_id');
        });
    }
};
