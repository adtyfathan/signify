<?php

namespace App\Services;

use App\Models\Lesson;
use App\Models\Module;
use App\Models\User;
use App\Models\UserLessonProgress;
use Illuminate\Support\Facades\Log;

class ProgressService
{
    public function initializeProgress(User $user): void
    {
        $firstModule = Module::orderBy('order_index')->first();
        if ($firstModule) {
            $firstLesson = $firstModule->lessons()->orderBy('order_index')->first();
            if ($firstLesson) {
                $this->unlockLesson($user, $firstLesson);
            }
        }
    }

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

        // Hanya update jika masih locked
        if ($progress->status === 'locked') {
            $progress->status = 'unlocked';
            $progress->save();
        }
    }

    public function completeLesson(User $user, Lesson $lesson, float $score = 100.0): void
    {
        // Pastikan relasi module & level ter-load
        $lesson->loadMissing('module.level');

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

            // Cari lesson berikutnya di modul yang sama
            $nextLesson = $lesson->module->lessons()
                ->where('order_index', '>', $lesson->order_index)
                ->orderBy('order_index')
                ->first();

            if ($nextLesson) {
                $this->unlockLesson($user, $nextLesson);
                Log::info("Unlocked next lesson [{$nextLesson->id}] in same module for user [{$user->id}]");
            } else {
                // Lesson terakhir di modul ini — cari modul berikutnya
                $currentModule = $lesson->module;

                $nextModule = Module::where('level_id', $currentModule->level_id)
                    ->where('order_index', '>', $currentModule->order_index)
                    ->orderBy('order_index')
                    ->first();

                if ($nextModule) {
                    $firstLessonNextModule = $nextModule->lessons()
                        ->orderBy('order_index')
                        ->first();

                    if ($firstLessonNextModule) {
                        $this->unlockLesson($user, $firstLessonNextModule);
                        Log::info("Unlocked first lesson [{$firstLessonNextModule->id}] of next module [{$nextModule->id}] for user [{$user->id}]");
                    }
                } else {
                    // Tidak ada modul berikutnya di level ini — coba level berikutnya
                    $currentLevel = $currentModule->level;

                    $nextLevel = \App\Models\Level::where('order_index', '>', $currentLevel->order_index)
                        ->orderBy('order_index')
                        ->first();

                    if ($nextLevel) {
                        $firstModuleNextLevel = Module::where('level_id', $nextLevel->id)
                            ->orderBy('order_index')
                            ->first();

                        if ($firstModuleNextLevel) {
                            $firstLesson = $firstModuleNextLevel->lessons()
                                ->orderBy('order_index')
                                ->first();

                            if ($firstLesson) {
                                $this->unlockLesson($user, $firstLesson);
                                Log::info("Unlocked first lesson of next level [{$nextLevel->id}] for user [{$user->id}]");
                            }
                        }
                    }
                }
            }
        }
    }

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

    public function getLevelProgress(User $user, $level): float
    {
        $moduleIds = $level->modules()->pluck('id');
        $totalLessons = Lesson::whereIn('module_id', $moduleIds)->count();

        if ($totalLessons === 0) {
            return 0;
        }

        $lessonIds = Lesson::whereIn('module_id', $moduleIds)->pluck('id');
        $completedLessons = UserLessonProgress::where('user_id', $user->id)
            ->whereIn('lesson_id', $lessonIds)
            ->where('status', 'completed')
            ->count();

        return ($completedLessons / $totalLessons) * 100;
    }
}