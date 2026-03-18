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
        Schema::create('badges', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('slug', 100)->unique();
            $table->text('description')->nullable();
            $table->string('icon_path', 500)->nullable();
            $table->enum('rarity', ['common', 'rare', 'epic', 'legendary'])->default('common');
            $table->integer('xp_bonus')->default(0);
            $table->enum('condition_type', [
                'first_lesson',
                'vowels_mastered',
                'all_letters_mastered',
                'first_quiz_word',
                'quiz_word_count_score',
                'streak_days',
                'quiz_speed'
            ])->default('first_lesson');
            $table->integer('condition_value')->nullable();
            $table->integer('condition_score')->nullable()->comment('Min score for quiz badges');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('badges');
    }
};
