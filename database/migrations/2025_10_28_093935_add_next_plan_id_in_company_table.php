<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::table('company_info', function (Blueprint $table) {
        $table->unsignedBigInteger('next_plan_id')->nullable()->after('subscribed_plan');
    });
}

public function down()
{
    Schema::table('company_info', function (Blueprint $table) {
        $table->dropColumn('next_plan_id');
    });
}
};
