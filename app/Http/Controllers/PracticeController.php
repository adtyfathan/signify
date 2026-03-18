<?php

namespace App\Http\Controllers;

use App\Http\Requests\SavePracticeRequest;
use App\Jobs\ProcessBadgeCheckJob;
use App\Models\FreePracticeSession;
use App\Models\FreePracticeLetter;
use App\Models\UserSignMastery;
use App\Services\BadgeService;
use App\Services\PracticeService;
use App\Services\XpService;
use Inertia\Inertia;

class PracticeController extends Controller
{
    /**
     * Show free practice page
     */
    public function index()
    {
        $user = auth()->user();
        $practiceService = new PracticeService();

        // Get recent sessions
        $recentSessions = $user->freePracticeSessions()
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn ($session) => [
                'id' => $session->id,
                'result_text' => $session->result_text,
                'letter_count' => $session->letter_count,
                'duration_sec' => $session->duration_sec,
                'xp_earned' => $session->xp_earned,
                'created_at' => $session->created_at,
            ]);

        return Inertia::render('Practice/Index', [
            'practiceCategories' => $practiceService->getCategories(),
            'recentSessions' => $recentSessions,
        ]);
    }

    /**
     * Save practice session
     */
    public function save(SavePracticeRequest $request)
    {
        $user = auth()->user();
        $data = $request->validated();

        $xpService = new XpService();
        $badgeService = new BadgeService();

        // Create practice session
        $session = FreePracticeSession::create([
            'user_id' => $user->id,
            'result_text' => $data['result_text'],
            'letter_count' => $data['letter_count'],
            'duration_sec' => $data['duration_sec'],
            'xp_earned' => 5, // Fixed 5 XP for free practice
        ]);

        // Create letter records
        foreach ($data['letters'] as $letter) {
            FreePracticeLetter::create([
                'session_id' => $session->id,
                'letter' => $letter['letter'],
                'confidence' => $letter['confidence'],
                'detected_at_sec' => $letter['detected_at_sec'],
            ]);
        }

        // Award XP
        $xpResult = $xpService->awardXp($user, 5, 'free_practice', $session->id);

        // Update streak
        $xpService->updateStreak($user);

        // Update user stats
        $user->stats()->increment('total_practice_done');
        $user->stats->save();

        // Check badges asynchronously
        dispatch(new ProcessBadgeCheckJob($user));

        return back()->with('flash', [
            'xp_earned' => $xpResult['xp_earned'],
        ]);
    }
}
