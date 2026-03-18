<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FreePracticeSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'result_text',
        'letter_count',
        'duration_sec',
        'xp_earned',
    ];

    /**
     * Get the user that owns this practice session.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the letters detected in this session.
     */
    public function letters(): HasMany
    {
        return $this->hasMany(FreePracticeLetter::class, 'session_id');
    }
}
