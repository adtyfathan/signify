<?php

namespace App\Http\Controllers;

use App\Models\Badge;
use App\Models\LeaderboardWeekly;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;

class GamificationController extends Controller
{
    /**
     * Show leaderboard for current week
     */
    public function leaderboard()
    {
        $user = auth()->user();
        $weekKey = $this->getCurrentWeekKey();

        // Get top 10 users this week
        $topUsers = LeaderboardWeekly::where('week_key', $weekKey)
            ->with('user')
            ->orderByDesc('xp_earned')
            ->limit(10)
            ->get()
            ->map(function ($record, $index) {
                return [
                    'rank' => $index + 1,
                    'user_id' => $record->user->id,
                    'username' => $record->user->username,
                    'avatar_path' => $record->user->avatar_path,
                    'xp_earned' => $record->xp_earned,
                    'level' => $record->user->stats->current_level,
                ];
            });

        // Get user's position
        $userRecord = LeaderboardWeekly::where('week_key', $weekKey)
            ->where('user_id', $user->id)
            ->first();

        $userRank = null;
        $userXp = 0;
        if ($userRecord) {
            $userRank = LeaderboardWeekly::where('week_key', $weekKey)
                ->where('xp_earned', '>', $userRecord->xp_earned)
                ->count() + 1;
            $userXp = $userRecord->xp_earned;
        }

        return Inertia::render('Leaderboard', [
            'topUsers' => $topUsers,
            'userRank' => $userRank,
            'userXp' => $userXp,
            'weekKey' => $weekKey,
        ]);
    }

    /**
     * Show all badges
     */
    public function showBadges()
    {
        $user = auth()->user();
        $allBadges = Badge::where('is_active', true)
            ->orderBy('rarity')
            ->get()
            ->map(function ($badge) use ($user) {
                $userBadge = $user->badges()->where('badge_id', $badge->id)->first();

                return [
                    'id' => $badge->id,
                    'name' => $badge->name,
                    'slug' => $badge->slug,
                    'description' => $badge->description,
                    'icon_path' => $badge->icon_path,
                    'rarity' => $badge->rarity,
                    'xp_bonus' => $badge->xp_bonus,
                    'earned_at' => $userBadge?->pivot?->earned_at,
                    'is_featured' => $userBadge?->pivot?->is_featured ?? false,
                ];
            });

        return Inertia::render('Badges/Index', [
            'allBadges' => $allBadges,
            'earnedCount' => $user->badges()->count(),
            'totalCount' => Badge::where('is_active', true)->count(),
        ]);
    }

    /**
     * Show user's earned badges
     */
    public function showUserBadges()
    {
        $user = auth()->user();
        $badges = $user->badges()
            ->orderByDesc('user_badges.earned_at')
            ->get()
            ->map(function ($badge) {
                return [
                    'id' => $badge->id,
                    'name' => $badge->name,
                    'slug' => $badge->slug,
                    'description' => $badge->description,
                    'icon_path' => $badge->icon_path,
                    'rarity' => $badge->rarity,
                    'xp_bonus' => $badge->xp_bonus,
                    'earned_at' => $badge->pivot->earned_at,
                    'is_featured' => $badge->pivot->is_featured,
                ];
            });

        return Inertia::render('Badges/MyBadges', [
            'badges' => $badges,
            'totalEarned' => $badges->count(),
        ]);
    }

    /**
     * Get XP history for user
     */
    public function getXpHistory()
    {
        $user = auth()->user();
        $transactions = $user->xpTransactions()
            ->latest()
            ->limit(50)
            ->get()
            ->map(fn ($t) => [
                'amount' => $t->amount,
                'source_type' => $t->source_type,
                'xp_after' => $t->xp_after,
                'note' => $t->note,
                'created_at' => $t->created_at,
            ]);

        return Inertia::render('Gamification/XpHistory', [
            'transactions' => $transactions,
        ]);
    }

    /**
     * Feature a badge (set as display badge)
     */
    public function featureBadge(Badge $badge)
    {
        $user = auth()->user();

        // Check if user has this badge
        $userBadge = $user->badges()->where('badge_id', $badge->id)->first();
        if (!$userBadge) {
            return back()->withErrors(['error' => 'Anda belum memiliki badge ini']);
        }

        // Unfeature other badges
        $user->badges()->update(['is_featured' => false]);

        // Feature this badge
        $user->badges()->where('badge_id', $badge->id)->updateExistingPivot($badge->id, ['is_featured' => true]);

        return back()->with('success', 'Badge ditampilkan di profil');
    }

    /**
     * Get current week key in format YYYY-Www
     */
    private function getCurrentWeekKey(): string
    {
        $now = Carbon::now();
        $week = $now->format('W');
        $year = $now->format('Y');
        return "{$year}-W{$week}";
    }
}
