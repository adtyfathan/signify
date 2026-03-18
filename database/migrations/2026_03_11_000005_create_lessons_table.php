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
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('module_id');
            $table->unsignedBigInteger('sign_id')->nullable();
            $table->string('title', 100);
            $table->enum('lesson_type', ['theory', 'quiz_letter', 'quiz_word', 'quiz_sentence'])->default('theory');
            $table->longText('content')->nullable();
            $table->integer('order_index')->default(0);
            $table->integer('xp_reward')->default(10);
            $table->integer('min_pass_score')->default(70);
            $table->boolean('is_published')->default(false);
            $table->timestamps();
            
            $table->foreign('module_id')->references('id')->on('modules')->onDelete('cascade');
            $table->foreign('sign_id')->references('id')->on('signs')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lessons');
    }
};
