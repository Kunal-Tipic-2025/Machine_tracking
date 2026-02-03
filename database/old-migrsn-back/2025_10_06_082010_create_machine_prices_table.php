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
        Schema::create('machine_prices', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('machine_id');
            $table->decimal('price', 10, 2);
            $table->string('mode'); // e.g. "rent", "sale", etc.
            $table->timestamps();

            // Optional: add foreign key if you have a 'machines' table
            // $table->foreign('machine_id')->references('id')->on('machines')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('machine_prices');
    }
};
