<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('invoice_additional_charges', function (Blueprint $table) {
            // Amount already paid against this charge
            $table->decimal('paid_amount', 10, 2)
                  ->default(0)
                  ->after('amount');

            // Optional but recommended index for faster queries
            $table->index('invoice_id');
        });
    }

    public function down(): void
    {
        Schema::table('invoice_additional_charges', function (Blueprint $table) {
            $table->dropColumn('paid_amount');
            $table->dropIndex(['invoice_id']);
        });
    }
};
