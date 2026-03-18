<?php

namespace App\Services;

use App\Models\Badge;
use App\Models\QuizSession;
use App\Models\User;
use App\Models\UserBadge;
use App\Models\UserSignMastery;

class BadgeService
{
    /**
     * Check and award badges for user based on conditions
     *
     * @param User $user
     * @return array Newly earned badges
     */
    public function checkAll(User $user): array
    {
        $newBadges = [];
        $badges = Badge::where('is_active', true)->get();

        foreach ($badges as $badge) {
            if (!$this->userHasBadge($user, $badge) && $this->checkCondition($user, $badge)) {
                $this->awardBadge($user, $badge);
                $newBadges[] = $badge;
            }
        }

        return $newBadges;
    }

    /**
     * Check if user has already earned this badge
     *
     * @param User $user
     * @param Badge $badge
     * @return bool
     */
    private function userHasBadge(User $user, Badge $badge): bool
    {
        return UserBadge::where('user_id', $user->id)
            ->where('badge_id', $badge->id)
            ->exists();
    }

    /**
     * Check badge condition
     *
     * @param User $user
     * @param Badge $badge
     * @return bool
     */
    private function checkCondition(User $user, Badge $badge): bool
    {
        return match ($badge->condition_type) {
            'first_lesson' => $this->checkFirstLesson($user),
            'vowels_mastered' => $this->checkVowelsMastered($user),
            'all_letters_mastered' => $this->checkAllLettersMastered($user),
            'first_quiz_word' => $this->checkFirstQuizWord($user),
            'quiz_word_count_score' => $this->checkQuizWordCountScore($user, $badge),
            'streak_days' => $this->checkStreakDays($user, $badge),
            'quiz_speed' => $this->checkQuizSpeed($user),
            default => false,
        };
    }

    /**
     * Check first lesson condition
     */
    private function checkFirstLesson(User $user): bool
    {
        return $user->stats?->total_lessons_done >= 1;
    }

    /**
     * Check vowels mastered condition
     */
    private function checkVowelsMastered(User $user): bool
    {
        $vowels = ['A', 'E', 'I', 'O', 'U'];
        $masteredCount = 0;

        foreach ($vowels as $letter) {
            $mastery = UserSignMastery::whereHas('sign', fn ($q) => $q->where('letter', $letter))
                ->where('user_id', $user->id)
                ->where('mastery_level', 'mastered')
                ->exists();

            if ($mastery) {
                $masteredCount++;
            }
        }

        return $masteredCount === 5;
    }

    /**
     * Check all letters mastered condition
     */
    private function checkAllLettersMastered(User $user): bool
    {
        return $user->stats?->letters_mastered >= 26;
    }

    /**
     * Check first quiz word condition
     */
    private function checkFirstQuizWord(User $user): bool
    {
        return QuizSession::where('user_id', $user->id)
            ->whereHas('lesson', fn ($q) => $q->where('lesson_type', 'quiz_word'))
            ->where('status', 'completed')
            ->exists();
    }

    /**
     * Check quiz word count and score condition
     */
    private function checkQuizWordCountScore(User $user, Badge $badge): bool
    {
        $count = QuizSession::where('user_id', $user->id)
            ->whereHas('lesson', fn ($q) => $q->where('lesson_type', 'quiz_word'))
            ->where('status', 'completed')
            ->where('score', '>=', $badge->condition_score ?? 90)
            ->count();

        return $count >= ($badge->condition_value ?? 50);
    }

    /**
     * Check streak days condition
     */
    private function checkStreakDays(User $user, Badge $badge): bool
    {
        return $user->stats?->current_streak >= ($badge->condition_value ?? 7);
    }

    /**
     * Check quiz speed condition
     */
    private function checkQuizSpeed(User $user): bool
    {
        return QuizSession::where('user_id', $user->id)
            ->whereHas('lesson', fn ($q) => $q->where('lesson_type', 'quiz_word'))
            ->where('status', 'completed')
            ->whereRaw('(units_total >= 5 AND duration_sec < 10)')
            ->exists();
    }

    /**
     * Award badge to user
     *
     * @param User $user
     * @param Badge $badge
     * @return void
     */
    private function awardBadge(User $user, Badge $badge): void
    {
        UserBadge::create([
            'user_id' => $user->id,
            'badge_id' => $badge->id,
            'earned_at' => now(),
        ]);

        // Award XP bonus
        if ($badge->xp_bonus > 0) {
            $xpService = new XpService();
            $xpService->awardXp($user, $badge->xp_bonus, 'badge_reward', $badge->id);
        }
    }
}
