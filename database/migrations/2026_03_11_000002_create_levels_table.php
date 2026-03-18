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
        Schema::create('levels', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50)->comment('Pemula|Menengah|Mahir');
            $table->string('slug', 50)->unique();
            $table->text('description')->nullable();
            $table->integer('order_index')->default(0);
            $table->string('color_hex', 7); // e.g., #10B981
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('levels');
    }
};
