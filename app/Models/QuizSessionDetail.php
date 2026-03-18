<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuizSessionDetail extends Model
{
    use HasFactory;

    protected $table = 'quiz_session_details';

    protected $fillable = [
        'quiz_session_id',
        'letter',
        'position',
        'is_correct',
        'ai_predicted',
        'confidence',
        'time_taken_ms',
        'attempts',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
        'confidence' => 'decimal:2',
    ];

    /**
     * Get the quiz session that owns this detail.
     */
    public function quizSession(): BelongsTo
    {
        return $this->belongsTo(QuizSession::class);
    }
}
