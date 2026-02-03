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
        Schema::table('invoice_additional_charges', function (Blueprint $table) {
            $table->unsignedBigInteger('charge_type_id')->nullable()->after('invoice_id');
            $table->boolean('amount_deduct')->default(0)->after('amount')->comment('0=Add, 1=Deduct');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invoice_additional_charges', function (Blueprint $table) {
            $table->dropColumn(['charge_type_id', 'amount_deduct']);
        });
    }
};
