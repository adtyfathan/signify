<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'avatar_path',
        'bio',
        'role',
        'oauth_provider',
        'oauth_id',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'last_login_at' => 'datetime',
        ];
    }

    // Relationships

    /**
     * Get the user's stats.
     */
    public function stats(): HasOne
    {
        return $this->hasOne(UserStats::class);
    }

    /**
     * Get the user's quiz sessions.
     */
    public function quizSessions(): HasMany
    {
        return $this->hasMany(QuizSession::class);
    }

    /**
     * Get the user's badges.
     */
    public function badges(): BelongsToMany
    {
        return $this->belongsToMany(Badge::class, 'user_badges')
            ->withPivot('earned_at', 'is_featured')
            ->withTimestamps();
    }

    /**
     * Get the user's lesson progress.
     */
    public function lessonProgress(): HasMany
    {
        return $this->hasMany(UserLessonProgress::class);
    }

    /**
     * Get the user's sign mastery records.
     */
    public function signMastery(): HasMany
    {
        return $this->hasMany(UserSignMastery::class);
    }

    /**
     * Get the user's XP transactions.
     */
    public function xpTransactions(): HasMany
    {
        return $this->hasMany(XpTransaction::class);
    }

    /**
     * Get the user's free practice sessions.
     */
    public function freePracticeSessions(): HasMany
    {
        return $this->hasMany(FreePracticeSession::class);
    }

    /**
     * Get the user's notifications.
     */
    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    /**
     * Get the user's match sessions as requester.
     */
    public function matchSessionsAsRequester(): HasMany
    {
        return $this->hasMany(MatchSession::class, 'requester_id');
    }

    /**
     * Get the user's match sessions as partner.
     */
    public function matchSessionsAsPartner(): HasMany
    {
        return $this->hasMany(MatchSession::class, 'partner_id');
    }

    /**
     * Get the user's leaderboard records.
     */
    public function leaderboardRecords(): HasMany
    {
        return $this->hasMany(LeaderboardWeekly::class);
    }
}
