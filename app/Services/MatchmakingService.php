<?php

namespace App\Services;

use App\Models\Level;
use App\Models\MatchSession;
use App\Models\User;

class MatchmakingService
{
    /**
     * Find a partner for matchmaking
     * Priority: deaf_mute first, then other learners
     *
     * @param User $requester
     * @param Level $level
     * @return User|null
     */
    public function findPartner(User $requester, Level $level): ?User
    {
        // First try to find deaf_mute user waiting
        $partner = $this->findDeafMuteWaiting($level, $requester);

        // If not found, try to find other learner waiting
        if (!$partner) {
            $partner = $this->findLearnerWaiting($level, $requester);
        }

        return $partner;
    }

    /**
     * Find deaf_mute user with pending match request
     *
     * @param Level $level
     * @param User $exclude
     * @return User|null
     */
    private function findDeafMuteWaiting(Level $level, User $exclude): ?User
    {
        return User::where('role', 'deaf_mute')
            ->where('is_active', true)
            ->where('id', '!=', $exclude->id)
            ->whereHas('matchSessionsAsRequester', fn ($q) => $q
                ->where('level_id', $level->id)
                ->where('status', 'pending')
                ->where('created_at', '>=', now()->subMinutes(5)) // Within 5 minutes
            )
            ->first();
    }

    /**
     * Find learner user with pending match request
     *
     * @param Level $level
     * @param User $exclude
     * @return User|null
     */
    private function findLearnerWaiting(Level $level, User $exclude): ?User
    {
        return User::where('role', 'learner')
            ->where('is_active', true)
            ->where('id', '!=', $exclude->id)
            ->whereHas('matchSessionsAsRequester', fn ($q) => $q
                ->where('level_id', $level->id)
                ->where('status', 'pending')
                ->where('created_at', '>=', now()->subMinutes(5)) // Within 5 minutes
            )
            ->first();
    }

    /**
     * Get list of active/pending match sessions for user
     *
     * @param User $user
     * @param string|null $status Filter by status (pending, accepted, active)
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getUserMatchSessions(User $user, ?string $status = null)
    {
        $query = MatchSession::where(function ($q) use ($user) {
            $q->where('requester_id', $user->id)
                ->orWhere('partner_id', $user->id);
        })
        ->whereIn('status', ['pending', 'accepted', 'active', 'completed']);

        if ($status) {
            $query->where('status', $status);
        }

        return $query->orderByDesc('created_at')->get();
    }

    /**
     * Cancel match session with penalty
     *
     * @param MatchSession $session
     * @param User $cancelledBy
     * @param string $reason
     * @return void
     */
    public function cancelMatch(MatchSession $session, User $cancelledBy, string $reason = 'User cancelled'): void
    {
        $session->status = 'cancelled';
        $session->cancelled_by = $cancelledBy->id;
        $session->cancel_reason = $reason;
        $session->save();

        // TODO: Implement penalty system if needed
    }

    /**
     * Mark match session as completed
     *
     * @param MatchSession $session
     * @param int $durationMin Duration in minutes
     * @return void
     */
    public function completeMatch(MatchSession $session, int $durationMin): void
    {
        $session->status = 'completed';
        $session->ended_at = now();
        $session->duration_min = $durationMin;
        $session->save();

        // Award XP to both users
        $xpService = new XpService();
        $xpService->awardXp($session->requester, $session->xp_earned, 'match_session', $session->id);

        if ($session->partner) {
            $xpService->awardXp($session->partner, $session->xp_earned, 'match_session', $session->id);
        }
    }
}
