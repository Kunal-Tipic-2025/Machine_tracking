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
    Schema::create('machine_logs', function (Blueprint $table) {
        $table->id();
        $table->string('operator_id');
        $table->string('company_id');
        $table->string('work_date');
        $table->string('project_id');
        $table->string('machine_id');
        $table->string('start_reading')->nullable(); // could be numeric, keep string if mixed values
        $table->string('start_photo')->nullable(); // store file path
        $table->string('end_reading')->nullable(); // could be numeric, keep string if mixed values
        $table->string('end_photo')->nullable();   // store file path
         $table->enum('status', ['started', 'completed'])->default('started');
        $table->timestamps();

        // If you have relations, add foreign keys
        // $table->foreign('operator_id')->references('id')->on('operators')->onDelete('cascade');
        // $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
        // $table->foreign('machine_id')->references('id')->on('machines')->onDelete('cascade');
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('machine_logs');
    }
};
