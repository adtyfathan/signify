<?php

namespace Database\Seeders;

use App\Models\Badge;
use App\Models\Lesson;
use App\Models\QuizSession;
use App\Models\User;
use App\Models\UserLessonProgress;
use App\Models\UserSignMastery;
use App\Models\UserStats;
use App\Models\XpTransaction;
use App\Services\XpService;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'superuser@gmail.com'],
            [
                'name' => 'Super User',
                'username' => 'superuser',
                'password' => Hash::make('user1234'),
                'role' => 'learner',
                'is_active' => true,
            ]
        );

        UserStats::updateOrCreate(
            ['user_id' => $user->id],
            [
                'total_xp' => 0,
                'current_level' => 1,
                'xp_to_next_level' => 100,
                'current_streak' => 30,
                'longest_streak' => 30,
                'last_activity_date' => Carbon::now(),
            ]
        );

        UserLessonProgress::where('user_id', $user->id)->delete();
        UserSignMastery::where('user_id', $user->id)->delete();
        XpTransaction::where('user_id', $user->id)->delete();
        QuizSession::where('user_id', $user->id)->delete();
        $user->badges()->detach();

        $xpService = new XpService();

        $lessons = Lesson::with(['sign', 'quizItems' => fn($q) => $q->orderBy('order_index')])
            ->orderBy('module_id')
            ->orderBy('order_index')
            ->get();

        if ($lessons->isEmpty()) {
            $this->command->warn('Tidak ada lesson yang ditemukan. Pastikan lesson sudah di-seed terlebih dahulu.');
            return;
        }

        $totalLessonsDone = 0;
        $totalQuizzesDone = 0;
        $completedAt = Carbon::now()->subDays($lessons->count());

        foreach ($lessons as $index => $lesson) {
            $lessonDate = $completedAt->copy()->addDays($index);

            UserLessonProgress::create([
                'user_id' => $user->id,
                'lesson_id' => $lesson->id,
                'status' => 'completed',
                'best_score' => 100.00,
                'attempts' => 1,
                'completed_at' => $lessonDate,
            ]);

            $totalLessonsDone++;

            $xpService->awardXp(
                $user,
                $lesson->xp_reward ?? 10,
                $lesson->lesson_type === 'theory' ? 'lesson_complete' : 'quiz_letter_pass',
                $lesson->id,
                applyStreakMultiplier: false,
            );

            if ($lesson->lesson_type !== 'theory') {
                $quizItem = $lesson->quizItems->first();

                QuizSession::create([
                    'user_id' => $user->id,
                    'lesson_id' => $lesson->id,
                    'quiz_item_id' => $quizItem?->id,
                    'score' => 100.00,
                    'units_correct' => $quizItem?->content_length ?? 1,
                    'units_total' => $quizItem?->content_length ?? 1,
                    'duration_sec' => rand(30, 120),
                    'xp_earned' => $lesson->xp_reward ?? 10,
                    'speed_bonus_xp' => 0,
                    'status' => 'completed',
                    'created_at' => $lessonDate,
                    'updated_at' => $lessonDate,
                ]);

                $totalQuizzesDone++;
            }

            if ($lesson->sign_id && $lesson->sign) {
                UserSignMastery::updateOrCreate(
                    ['user_id' => $user->id, 'sign_id' => $lesson->sign_id],
                    [
                        'mastery_level' => 'mastered',
                        'total_correct' => 15,
                        'total_attempts' => 15,
                        'avg_confidence' => 92.50,
                        'last_practiced_at' => $lessonDate,
                    ]
                );
            }
        }

        $user->refresh();
        $stats = $user->stats;

        $lettersMastered = UserSignMastery::where('user_id', $user->id)
            ->where('mastery_level', 'mastered')
            ->count();

        $stats->update([
            'total_lessons_done' => $totalLessonsDone,
            'total_quizzes_done' => $totalQuizzesDone,
            'letters_mastered' => $lettersMastered,
        ]);

        // Award semua badge
        $this->awardAllBadges($user);
    }

    private function awardAllBadges(User $user): void
    {
        $badges = Badge::where('is_active', true)->get();

        if ($badges->isEmpty()) {
            $this->command->warn('Tidak ada badge ditemukan. Pastikan BadgeSeeder sudah dijalankan.');
            return;
        }

        $user->badges()->detach();

        foreach ($badges as $index => $badge) {
            $user->badges()->attach($badge->id, [
                'earned_at' => Carbon::now()->subDays($badges->count() - $index),
                'is_featured' => $index === 0,
            ]);
        }
    }
}