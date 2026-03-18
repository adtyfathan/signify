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
        // Drop the old enum column and create a new one with 'system' added
        Schema::table('xp_transactions', function (Blueprint $table) {
            $table->dropColumn('source_type');
        });

        Schema::table('xp_transactions', function (Blueprint $table) {
            $table->enum('source_type', [
                'system',
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
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('xp_transactions', function (Blueprint $table) {
            $table->dropColumn('source_type');
        });

        Schema::table('xp_transactions', function (Blueprint $table) {
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
        });
    }
};
