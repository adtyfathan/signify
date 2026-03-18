<?php

namespace App\Http\Controllers;

use App\Http\Requests\SubmitQuizRequest;
use App\Jobs\ProcessBadgeCheckJob;
use App\Models\Lesson;
use App\Models\LeaderboardWeekly;
use App\Models\QuizItem;
use App\Models\QuizSession;
use App\Models\QuizSessionDetail;
use App\Models\UserSignMastery;
use App\Services\BadgeService;
use App\Services\ProgressService;
use App\Services\XpService;
use Carbon\Carbon;
use Inertia\Inertia;

class QuizController extends Controller
{
    /**
     * Submit quiz result
     */
    public function submit(SubmitQuizRequest $request)
    {
        $user = auth()->user();
        $data = $request->validated();

        $xpService = new XpService();
        $badgeService = new BadgeService();
        $progressService = new ProgressService();

        // Calculate base XP
        $baseXp = $this->calculateBaseXp($data['units_total']);
        
        // Calculate speed bonus
        $speedBonusXp = $xpService->calculateSpeedBonus($data['units_total'], $data['duration_sec']);

        // Award XP
        $xpResult = $xpService->awardXp(
            $user,
            $baseXp + $speedBonusXp,
            'quiz_letter_pass',
            $data['lesson_id'],
            applyStreakMultiplier: true
        );

        // Create quiz session
        $quizSession = QuizSession::create([
            'user_id' => $user->id,
            'lesson_id' => $data['lesson_id'],
            'quiz_item_id' => $data['quiz_item_id'],
            'score' => $data['score'],
            'units_correct' => $data['units_correct'],
            'units_total' => $data['units_total'],
            'duration_sec' => $data['duration_sec'],
            'xp_earned' => $xpResult['xp_earned'],
            'speed_bonus_xp' => $speedBonusXp,
            'status' => $data['status'],
        ]);

        // Create session details
        foreach ($data['details'] as $detail) {
            // Convert confidence from 0-1 (AI) to 0-100 if needed
            $confidence = $detail['confidence'];
            if ($confidence <= 1) {
                $confidence = $confidence * 100;
            }

            QuizSessionDetail::create([
                'quiz_session_id' => $quizSession->id,
                'letter' => $detail['letter'],
                'position' => $detail['position'] ?? ord($detail['letter']) - ord('A'),
                'is_correct' => $detail['is_correct'],
                'ai_predicted' => $detail['ai_predicted'],
                'confidence' => $confidence,
                'time_taken_ms' => $detail['time_taken_ms'],
                'attempts' => $detail['attempts'],
            ]);

            // Update sign mastery
            $sign = optional(\App\Models\Sign::where('letter', $detail['letter'])->first());
            if ($sign) {
                $mastery = UserSignMastery::firstOrCreate(
                    [
                        'user_id' => $user->id,
                        'sign_id' => $sign->id,
                    ],
                    [
                        'mastery_level' => 'learning',
                    ]
                );

                $mastery->increment('total_attempts');
                if ($detail['is_correct']) {
                    $mastery->increment('total_correct');
                }

                // Update average confidence
               $allDetails = QuizSessionDetail::whereHas('quizSession', fn ($q) => $q
                    ->where('user_id', $user->id)
                    ->whereHas('lesson', fn ($q2) => $q2->where('lesson_type', 'quiz_word'))
                )
                ->where('letter', $detail['letter'])
                ->get();

                $avgConfidence = $allDetails->avg('confidence');
                $mastery->avg_confidence = $avgConfidence;
                $mastery->save();

                // Check for mastery level up
                if ($mastery->total_correct >= 10 && $mastery->avg_confidence >= 85) {
                    $mastery->mastery_level = 'mastered';
                    $mastery->save();
                } elseif ($mastery->total_correct >= 5 && $mastery->avg_confidence >= 75) {
                    $mastery->mastery_level = 'practiced';
                    $mastery->save();
                }
            }
        }

        // Update streak
        $xpService->updateStreak($user);

        // Update lesson progress if score >= min_pass_score
        $lesson = Lesson::find($data['lesson_id']);
        if ($data['score'] >= $lesson->min_pass_score) {
            $progressService->completeLesson($user, $lesson, $data['score']);
        }

        // Update user stats
        $user->stats()->increment('total_quizzes_done');
        $user->stats->letters_mastered = UserSignMastery::where('user_id', $user->id)
            ->where('mastery_level', 'mastered')
            ->count();
        $user->stats->save();

        // Update leaderboard real-time
        $weekKey = $this->getCurrentWeekKey();

        $totalWeeklyXp = QuizSession::where('user_id', $user->id)
            ->whereBetween('created_at', [
                Carbon::now()->startOfWeek(),
                Carbon::now()->endOfWeek()
            ])
            ->sum('xp_earned');

        LeaderboardWeekly::updateOrCreate(
            ['user_id' => $user->id, 'week_key' => $weekKey],
            ['xp_earned' => $totalWeeklyXp]
        );

        // Check badges asynchronously
        dispatch(new ProcessBadgeCheckJob($user));

        // Return JSON response dengan data quiz session
        return response()->json([
            'success' => true,
            'message' => 'Quiz selesai!',
            'quiz_session_id' => $quizSession->id,
            'xp_earned' => $xpResult['xp_earned'],
            'speed_bonus_xp' => $speedBonusXp,
            'level_up_info' => $xpResult['level_up_info'],
            'redirect' => route('modules.show', $lesson->module_id),
        ], 200);
    }

    /**
     * Calculate base XP based on content length
     */
    private function calculateBaseXp(int $length): int
    {
        return match (true) {
            $length <= 1 => 15,
            $length <= 3 => 20,
            $length <= 5 => 25,
            default => 30,
        };
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
