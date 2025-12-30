<?php
//will run this migration
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateOperatorIdDefault20250929 extends Migration

{
    public function up()
    {
        Schema::table('machine_operator', function (Blueprint $table) {
            $table->json('operator_id')->default('[]')->change();
        });
    }

    public function down()
    {
        Schema::table('machine_operator', function (Blueprint $table) {
            $table->json('operator_id')->nullable()->default(null)->change();
        });
    }
}