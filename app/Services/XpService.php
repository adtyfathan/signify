<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserStats;
use App\Models\XpTransaction;

class XpService
{
    /**
     * XP thresholds for each level (cumulative)
     */
    private const LEVEL_THRESHOLDS = [
        1 => 0,
        2 => 100,
        3 => 250,
        4 => 500,
        5 => 900,
        6 => 1500,
        7 => 2300,
        8 => 3300,
    ];

    /**
     * Award XP to user and handle level ups
     *
     * @param User $user
     * @param int $amount Base XP amount
     * @param string $sourceType Type of XP source
     * @param int|null $sourceId ID of source (lesson_id, quiz_session_id, etc)
     * @param bool $applyStreakMultiplier Apply current streak multiplier
     * @return array Result with xp_earned, speed_bonus_xp, level_up_info
     */
    public function awardXp(
        User $user,
        int $amount,
        string $sourceType,
        ?int $sourceId = null,
        bool $applyStreakMultiplier = true
    ): array {
        $stats = $user->stats ?? $this->createUserStats($user);
        
        $xpEarned = $amount;
        $speedBonusXp = 0;
        $levelUpInfo = null;

        // Apply streak multiplier AFTER speed bonus
        if ($applyStreakMultiplier && $stats->current_streak > 0) {
            $multiplier = $this->getStreakMultiplier($stats->current_streak);
            $xpEarned = (int)($xpEarned * $multiplier);
        }

        // Update total XP and check for level up
        $oldLevel = $stats->current_level;
        $stats->total_xp += $xpEarned;
        $newLevel = $this->calculateLevel($stats->total_xp);

        if ($newLevel > $oldLevel) {
            $stats->current_level = $newLevel;
            $levelUpInfo = [
                'old_level' => $oldLevel,
                'new_level' => $newLevel,
                'total_xp' => $stats->total_xp,
            ];
        }

        // Calculate XP to next level
        $nextLevelThreshold = $this->getLevelThreshold($newLevel + 1);
        $stats->xp_to_next_level = max(0, $nextLevelThreshold - $stats->total_xp);

        $stats->save();

        // Log transaction
        XpTransaction::create([
            'user_id' => $user->id,
            'amount' => $xpEarned,
            'source_type' => $sourceType,
            'source_id' => $sourceId,
            'xp_after' => $stats->total_xp,
        ]);

        return [
            'xp_earned' => $xpEarned,
            'speed_bonus_xp' => $speedBonusXp,
            'total_xp' => $stats->total_xp,
            'current_level' => $stats->current_level,
            'xp_to_next_level' => $stats->xp_to_next_level,
            'level_up_info' => $levelUpInfo,
        ];
    }

    /**
     * Calculate speed bonus XP (for words ≥5 letters, duration <10 sec = +10 XP)
     *
     * @param int $contentLength Length of quiz content
     * @param int $durationSec Duration in seconds
     * @return int Bonus XP
     */
    public function calculateSpeedBonus(int $contentLength, int $durationSec): int
    {
        if ($contentLength >= 5 && $durationSec < 10) {
            return 10;
        }
        return 0;
    }

    /**
     * Get streak multiplier based on current streak
     *
     * @param int $streak Current streak days
     * @return float Multiplier
     */
    public function getStreakMultiplier(int $streak): float
    {
        if ($streak >= 7) {
            return 2.0; // 2x for 7+ days
        }
        if ($streak >= 3) {
            return 1.5; // 1.5x for 3-6 days
        }
        return 1.0;
    }

    /**
     * Calculate current level from total XP
     *
     * @param int $totalXp Total XP
     * @return int Current level
     */
    public function calculateLevel(int $totalXp): int
    {
        $level = 1;
        foreach (self::LEVEL_THRESHOLDS as $lv => $threshold) {
            if ($totalXp >= $threshold) {
                $level = $lv;
            } else {
                break;
            }
        }
        return $level;
    }

    /**
     * Get XP threshold for a specific level
     *
     * @param int $level Level number
     * @return int XP threshold
     */
    public function getLevelThreshold(int $level): int
    {
        return self::LEVEL_THRESHOLDS[$level] ?? 9999999;
    }

    /**
     * Update user streak (call after any activity)
     *
     * @param User $user
     * @return void
     */
    public function updateStreak(User $user): void
    {
        $stats = $user->stats ?? $this->createUserStats($user);
        $today = now()->toDateString();
        $lastActivity = $stats->last_activity_date?->toDateString();

        if ($lastActivity === $today) {
            // Already active today, no change
            return;
        }

        $yesterday = now()->subDay()->toDateString();

        if ($lastActivity === $yesterday) {
            // Streak continues
            $stats->current_streak++;
        } else {
            // Streak breaks or starts fresh
            $stats->current_streak = 1;
        }

        // Update longest streak
        if ($stats->current_streak > $stats->longest_streak) {
            $stats->longest_streak = $stats->current_streak;
        }

        $stats->last_activity_date = now();
        $stats->save();
    }

    /**
     * Create user stats if not exists
     *
     * @param User $user
     * @return UserStats
     */
    private function createUserStats(User $user): UserStats
    {
        return UserStats::create([
            'user_id' => $user->id,
            'total_xp' => 0,
            'current_level' => 1,
            'xp_to_next_level' => 100,
            'current_streak' => 0,
            'longest_streak' => 0,
        ]);
    }

    /**
     * Get all levels configuration
     *
     * @return array
     */
    public static function getLevelThresholds(): array
    {
        return self::LEVEL_THRESHOLDS;
    }
}
