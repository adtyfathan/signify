<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeaderboardWeekly extends Model
{
    use HasFactory;

    protected $table = 'leaderboard_weekly';

    protected $fillable = [
        'user_id',
        'week_key',
        'xp_earned',
        'rank_position',
    ];

    /**
     * Get the user for this leaderboard record.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
