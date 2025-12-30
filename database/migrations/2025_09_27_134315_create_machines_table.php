<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('machine_operator', function (Blueprint $table) {
            $table->id();
            $table->string('machine_name'); // Store machine name
            $table->foreignId('operator_id')->constrained()->onDelete('cascade'); // Operator reference
            $table->timestamps();

            // Prevent duplicate machine-operator pair
            $table->unique(['machine_name', 'operator_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('machine_operator');
    }
};
