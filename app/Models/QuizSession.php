<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QuizSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'lesson_id',
        'quiz_item_id',
        'score',
        'units_correct',
        'units_total',
        'duration_sec',
        'xp_earned',
        'speed_bonus_xp',
        'status',
    ];

    protected $casts = [
        'score' => 'decimal:2',
    ];

    /**
     * Get the user that owns this quiz session.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the lesson for this quiz session.
     */
    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    /**
     * Get the quiz item for this session.
     */
    public function quizItem(): BelongsTo
    {
        return $this->belongsTo(QuizItem::class);
    }

    /**
     * Get the details for this quiz session.
     */
    public function details(): HasMany
    {
        return $this->hasMany(QuizSessionDetail::class);
    }
}
