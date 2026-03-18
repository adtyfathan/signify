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
        Schema::create('user_sign_mastery', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('sign_id');
            $table->enum('mastery_level', ['not_started', 'learning', 'practiced', 'mastered'])->default('not_started');
            $table->integer('total_correct')->default(0);
            $table->integer('total_attempts')->default(0);
            $table->decimal('avg_confidence', 5, 2)->nullable();
            $table->timestamp('last_practiced_at')->nullable();
            $table->timestamps();
            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('sign_id')->references('id')->on('signs')->onDelete('cascade');
            $table->unique(['user_id', 'sign_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_sign_mastery');
    }
};
