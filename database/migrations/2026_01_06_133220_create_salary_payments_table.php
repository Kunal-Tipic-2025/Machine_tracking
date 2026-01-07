<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('salary_payments', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('operator_id');
            $table->unsignedBigInteger('company_id');

            // Salary month
            $table->string('month', 7); // YYYY-MM

            $table->decimal('base_salary', 10, 2);

            $table->decimal('total_expense_deducted', 10, 2)->default(0);
            $table->decimal('total_advance_deducted', 10, 2)->default(0);

            $table->decimal('net_salary', 10, 2);

            $table->timestamp('paid_at');
            $table->string('remark')->nullable();

            $table->timestamps();

            // One salary per operator per month
            $table->unique(['operator_id', 'month']);

            // Indexes
            $table->index('operator_id');
            $table->index('company_id');
            $table->index('month');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('salary_payments');
    }
};
