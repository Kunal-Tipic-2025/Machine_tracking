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
        Schema::create('invoice_additional_charges', function (Blueprint $table) {
    $table->id();

    $table->string('invoice_id'); // string invoice reference
    $table->unsignedBigInteger('company_id');

    $table->string('charge_type');
    $table->decimal('amount', 10, 2);
    $table->boolean('is_paid')->default(false);
    $table->date('date')->nullable();
    $table->string('remark')->nullable();

    $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice_additional_charges');
    }
};
