<?php

namespace App\Services;

use App\Models\Lesson;
use App\Models\Module;
use App\Models\User;
use App\Models\UserLessonProgress;

class ProgressService
{
    /**
     * Initialize progress for user on first access
     *
     * @param User $user
     * @return void
     */
    public function initializeProgress(User $user): void
    {
        // First lesson in first module should be unlocked
        $firstModule = Module::orderBy('order_index')->first();
        if ($firstModule) {
            $firstLesson = $firstModule->lessons()->orderBy('order_index')->first();
            if ($firstLesson) {
                $this->unlockLesson($user, $firstLesson);
            }
        }
    }

    /**
     * Unlock a lesson for user
     *
     * @param User $user
     * @param Lesson $lesson
     * @return void
     */
    public function unlockLesson(User $user, Lesson $lesson): void
    {
        $progress = UserLessonProgress::firstOrCreate(
            [
                'user_id' => $user->id,
                'lesson_id' => $lesson->id,
            ],
            [
                'status' => 'unlocked',
            ]
        );

        if ($progress->status === 'locked') {
            $progress->status = 'unlocked';
            $progress->save();
        }
    }

    /**
     * Mark lesson as completed and unlock next lesson
     *
     * @param User $user
     * @param Lesson $lesson
     * @param float $score
     * @return void
     */
    public function completeLesson(User $user, Lesson $lesson, float $score = 100.0): void
    {
        $progress = UserLessonProgress::firstOrCreate(
            [
                'user_id' => $user->id,
                'lesson_id' => $lesson->id,
            ],
            [
                'status' => 'locked',
            ]
        );

        if ($score >= $lesson->min_pass_score) {
            $progress->status = 'completed';
            $progress->best_score = max($progress->best_score ?? 0, $score);
            $progress->attempts++;
            $progress->completed_at = now();
            $progress->save();

            // Update user stats
            $user->stats()->increment('total_lessons_done');

            // Unlock next lesson
            $nextLesson = $lesson->module->lessons()
                ->where('order_index', '>', $lesson->order_index)
                ->orderBy('order_index')
                ->first();

            if ($nextLesson) {
                $this->unlockLesson($user, $nextLesson);
            } else {
                // No next lesson in this module, unlock first lesson of next module
                $nextModule = Module::where('order_index', '>', $lesson->module->order_index)
                    ->where('level_id', $lesson->module->level_id)
                    ->orderBy('order_index')
                    ->first();

                if ($nextModule) {
                    $firstLessonNextModule = $nextModule->lessons()->orderBy('order_index')->first();
                    if ($firstLessonNextModule) {
                        $this->unlockLesson($user, $firstLessonNextModule);
                    }
                }
            }
        }
    }

    /**
     * Check if lesson is unlocked for user
     *
     * @param User $user
     * @param Lesson $lesson
     * @return bool
     */
    public function isLessonUnlocked(User $user, Lesson $lesson): bool
    {
        $progress = UserLessonProgress::where('user_id', $user->id)
            ->where('lesson_id', $lesson->id)
            ->first();

        if (!$progress) {
            return false;
        }

        return in_array($progress->status, ['unlocked', 'in_progress', 'completed']);
    }

    /**
     * Get user progress for a module (percentage complete)
     *
     * @param User $user
     * @param Module $module
     * @return float Percentage 0-100
     */
    public function getModuleProgress(User $user, Module $module): float
    {
        $totalLessons = $module->lessons()->count();
        if ($totalLessons === 0) {
            return 0;
        }

        $completedLessons = UserLessonProgress::where('user_id', $user->id)
            ->whereIn('lesson_id', $module->lessons()->pluck('id'))
            ->where('status', 'completed')
            ->count();

        return ($completedLessons / $totalLessons) * 100;
    }

    /**
     * Get user progress for a level
     *
     * @param User $user
     * @param $level
     * @return float Percentage 0-100
     */
    public function getLevelProgress(User $user, $level): float
    {
        $totalLessons = Lesson::whereIn('module_id', $level->modules()->pluck('id'))->count();
        if ($totalLessons === 0) {
            return 0;
        }

        $completedLessons = UserLessonProgress::where('user_id', $user->id)
            ->whereIn('lesson_id', Lesson::whereIn('module_id', $level->modules()->pluck('id'))->pluck('id'))
            ->where('status', 'completed')
            ->count();

        return ($completedLessons / $totalLessons) * 100;
    }
}
