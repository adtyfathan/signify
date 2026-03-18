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
        Schema::create('modules', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('level_id');
            $table->string('name', 100);
            $table->string('slug', 100)->unique();
            $table->text('description')->nullable();
            $table->enum('type', ['introduction', 'alphabet', 'vocabulary', 'conversation'])->default('alphabet');
            $table->integer('order_index')->default(0);
            $table->string('thumbnail_path', 500)->nullable();
            $table->integer('xp_reward')->default(50);
            $table->boolean('is_published')->default(false);
            $table->timestamps();
            
            $table->foreign('level_id')->references('id')->on('levels')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('modules');
    }
};
