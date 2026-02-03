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
        Schema::create('repayments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('company_id')->nullable();
            $table->unsignedBigInteger('project_id')->nullable();
            $table->unsignedBigInteger('invoice_id')->nullable();
            $table->date('date')->nullable();
            $table->decimal('total', 15, 2)->default(0);
            $table->decimal('payment', 15, 2)->default(0);
            $table->boolean('is_completed')->default(false);
            $table->timestamps();

            // Foreign key relations
            $table->foreign('company_id')
                ->references('company_id')
                ->on('company_info')
                ->onDelete('set null');

            $table->foreign('project_id')
                ->references('id')
                ->on('projects')
                ->onDelete('set null');

            $table->foreign('invoice_id')
                ->references('id')
                ->on('project_payments')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('repayments');
    }
};
