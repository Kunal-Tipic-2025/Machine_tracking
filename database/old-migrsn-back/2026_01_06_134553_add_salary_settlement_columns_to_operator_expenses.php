<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('operator_expenses', function (Blueprint $table) {

            // Salary cycle in which this expense was settled
            $table->unsignedBigInteger('settled_in_salary_id')
                  ->nullable()
                  ->after('is_settle');

            // When the expense was settled
            $table->timestamp('settled_at')
                  ->nullable()
                  ->after('settled_in_salary_id');

            // Helpful index
            $table->index('settled_in_salary_id');
        });
    }

    public function down(): void
    {
        Schema::table('operator_expenses', function (Blueprint $table) {
            $table->dropColumn([
                'settled_in_salary_id',
                'settled_at'
            ]);
        });
    }
};
