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
            $table->unsignedBigInteger('work_type_id')
                  ->nullable()
                  ->after('mode_id');

            // Optional but recommended foreign key
            $table->foreign('work_type_id')
                  ->references('id')
                  ->on('working_types')
                  ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('machine_logs', function (Blueprint $table) {
            $table->dropForeign(['work_type_id']);
            $table->dropColumn('work_type_id');
        });
    }
};
