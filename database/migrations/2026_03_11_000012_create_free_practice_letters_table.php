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
        Schema::create('free_practice_letters', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('session_id');
            $table->char('letter', 1);
            $table->decimal('confidence', 5, 2);
            $table->integer('detected_at_sec');
            $table->timestamps();
            
            $table->foreign('session_id')->references('id')->on('free_practice_sessions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('free_practice_letters');
    }
};
