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
        Schema::create('quiz_sessions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('lesson_id');
            $table->unsignedBigInteger('quiz_item_id')->nullable();
            $table->decimal('score', 5, 2);
            $table->integer('units_correct');
            $table->integer('units_total');
            $table->integer('duration_sec');
            $table->integer('xp_earned')->default(0);
            $table->integer('speed_bonus_xp')->default(0);
            $table->enum('status', ['completed', 'failed', 'abandoned'])->default('completed');
            $table->timestamps();
            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('lesson_id')->references('id')->on('lessons')->onDelete('cascade');
            $table->foreign('quiz_item_id')->references('id')->on('quiz_items')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_sessions');
    }
};
