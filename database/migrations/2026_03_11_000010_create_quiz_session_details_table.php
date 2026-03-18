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
        Schema::create('quiz_session_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('quiz_session_id');
            $table->char('letter', 1);
            $table->integer('position');
            $table->boolean('is_correct');
            $table->char('ai_predicted', 1)->nullable();
            $table->decimal('confidence', 5, 2);
            $table->integer('time_taken_ms');
            $table->integer('attempts')->default(1);
            $table->timestamps();
            
            $table->foreign('quiz_session_id')->references('id')->on('quiz_sessions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_session_details');
    }
};
