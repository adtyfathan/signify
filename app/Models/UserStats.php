<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserStats extends Model
{
    use HasFactory;

    protected $table = 'user_stats';

    protected $fillable = [
        'user_id',
        'total_xp',
        'current_level',
        'xp_to_next_level',
        'current_streak',
        'longest_streak',
        'last_activity_date',
        'total_lessons_done',
        'total_quizzes_done',
        'total_practice_done',
        'letters_mastered',
    ];

    protected $casts = [
        'last_activity_date' => 'date',
    ];

    /**
     * Get the user that owns this stats record.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
