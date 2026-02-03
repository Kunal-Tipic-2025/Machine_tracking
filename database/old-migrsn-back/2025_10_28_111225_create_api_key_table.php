<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration {
    public function up(): void {
        Schema::create('api_keys', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Who is using this key (TIPIC Hub, etc.)
            $table->string('key')->unique(); // API key string
            $table->timestamps();
        });

        // Insert default API key after table creation
        DB::table('api_keys')->insert([
            'name' => 'TIPIC Nexus',
            'key' => Str::random(60),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void {
        Schema::dropIfExists('api_keys');
    }
};
