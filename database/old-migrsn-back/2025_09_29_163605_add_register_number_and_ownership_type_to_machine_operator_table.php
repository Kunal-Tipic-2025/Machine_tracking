<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRegisterNumberAndOwnershipTypeToMachineOperatorTable extends Migration
{
    public function up()
    {
        Schema::table('machine_operator', function (Blueprint $table) {
            $table->string('register_number')->unique()->after('operator_id');
            $table->enum('ownership_type', ['owned', 'leased', 'rented'])->default('owned')->after('register_number');
        });
    }

    public function down()
    {
        Schema::table('machine_operator', function (Blueprint $table) {
            $table->dropColumn(['register_number', 'ownership_type']);
        });
    }
}