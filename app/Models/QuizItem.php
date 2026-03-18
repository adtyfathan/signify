<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QuizItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'lesson_id',
        'content',
        'content_length',
        'hint',
        'category',
        'letters_used',
        'order_index',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the lesson that owns this quiz item.
     */
    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    /**
     * Get the quiz sessions for this item.
     */
    public function quizSessions(): HasMany
    {
        return $this->hasMany(QuizSession::class);
    }
}
