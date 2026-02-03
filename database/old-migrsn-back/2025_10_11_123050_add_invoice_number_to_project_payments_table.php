<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::table('project_payments', function (Blueprint $table) {
        $table->string('invoice_number')->nullable()->after('payment_mode'); // ✅ add column
    });
}

public function down()
{
    Schema::table('project_payments', function (Blueprint $table) {
        $table->dropColumn('invoice_number');
    });
}

};
