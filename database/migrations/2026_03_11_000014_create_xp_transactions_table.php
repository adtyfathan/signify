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
        Schema::create('xp_transactions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->smallInteger('amount');
            $table->enum('source_type', [
                'lesson_complete',
                'quiz_letter_pass',
                'quiz_word_pass',
                'quiz_sentence_pass',
                'quiz_speed_bonus',
                'free_practice',
                'match_session',
                'badge_reward',
                'streak_bonus'
            ])->default('lesson_complete');
            $table->unsignedBigInteger('source_id')->nullable();
            $table->integer('xp_after')->default(0);
            $table->string('note', 255)->nullable();
            $table->timestamps();
            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('xp_transactions');
    }
};
