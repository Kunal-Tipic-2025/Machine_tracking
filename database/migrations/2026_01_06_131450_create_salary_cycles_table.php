<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('salary_cycles', function (Blueprint $table) {
            $table->id();

            // No foreign key, just store operator id
            $table->unsignedBigInteger('operator_id');

            // Month in YYYY-MM format
            $table->string('month', 7);

            $table->decimal('base_salary', 10, 2);

            $table->enum('status', ['pending', 'paid'])
                  ->default('pending');

            $table->timestamp('salary_paid_at')->nullable();

            $table->timestamps();

            // Ensure one salary cycle per operator per month
            $table->unique(['operator_id', 'month'], 'operator_month_unique');

            // Helpful indexes for dashboard queries
            $table->index('operator_id');
            $table->index('month');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('salary_cycles');
    }
};
