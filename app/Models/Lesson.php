<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'module_id',
        'sign_id',
        'title',
        'lesson_type',
        'content',
        'video_path',
        'order_index',
        'xp_reward',
        'min_pass_score',
        'is_published',
    ];

    protected $casts = [
        'is_published' => 'boolean',
    ];

    /**
     * Get the module that owns this lesson.
     */
    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    /**
     * Get the sign for this lesson.
     */
    public function sign(): BelongsTo
    {
        return $this->belongsTo(Sign::class);
    }

    /**
     * Get the quiz items for this lesson.
     */
    public function quizItems(): HasMany
    {
        return $this->hasMany(QuizItem::class);
    }

    /**
     * Get the user progress for this lesson.
     */
    public function userProgress(): HasMany
    {
        return $this->hasMany(UserLessonProgress::class);
    }

    /**
     * Get the quiz sessions for this lesson.
     */
    public function quizSessions(): HasMany
    {
        return $this->hasMany(QuizSession::class);
    }

    /**
     * Get the images for this lesson.
     */
    public function images(): HasMany
    {
        return $this->hasMany(LessonImage::class)->orderBy('order_index');
    }
}
