<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('machine_prices', function (Blueprint $table) {
            $table->unsignedBigInteger('company_id')->nullable()->after('id');

            // Foreign key referencing company_info
            $table->foreign('company_id')
                  ->references('id')
                  ->on('company_info')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('machine_prices', function (Blueprint $table) {
            $table->dropForeign(['company_id']);
            $table->dropColumn('company_id');
        });
    }
};
