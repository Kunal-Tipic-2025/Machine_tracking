<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('advance_records', function (Blueprint $table) {
            $table->id();

            // Operator who took the advance
            $table->unsignedBigInteger('operator_id');

            // Advance amount given
            $table->decimal('amount', 10, 2);

            // Amount actually repaid / adjusted (normally same as amount)
            $table->decimal('repayment_amount', 10, 2)->nullable();

            // Date advance was given
            $table->date('advance_date');

            // Settlement status
            $table->boolean('is_settle')->default(false);

            // Salary cycle in which this advance was settled
            $table->unsignedBigInteger('settled_in_salary_id')->nullable();

            // When it was settled
            $table->timestamp('settled_at')->nullable();

            $table->string('remark')->nullable();

            $table->timestamps();

            // Indexes for fast queries
            $table->index('operator_id');
            $table->index('is_settle');
            $table->index('settled_in_salary_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('advance_records');
    }
};
