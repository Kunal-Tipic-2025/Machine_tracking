<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('operator_expenses', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('operator_id');
            $table->unsignedBigInteger('company_id');
            $table->string('about_expenses');
            $table->decimal('total_amount', 10, 2);
            $table->boolean('is_settle');
            $table->date('expense_date');

            $table->timestamps();

            // Optional but recommended
            // $table->foreign('operator_id')->references('id')->on('operators')->onDelete('cascade');
            // $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('operator_expenses');
    }
};
