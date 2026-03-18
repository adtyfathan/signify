<?php

namespace App\Http\Controllers;

use App\Models\Level;
use App\Models\Module;
use App\Services\ProgressService;
use Inertia\Inertia;

class ModuleController extends Controller
{
    /**
     * Show list of all modules
     */
    public function index()
    {
        $user = auth()->user();
        $levels = Level::with('modules.lessons')->orderBy('order_index')->get();
        $progressService = new ProgressService();
        $modulesData = [];

        foreach ($levels as $level) {
            foreach ($level->modules as $module) {
                $firstLesson = $module->lessons()->orderBy('order_index')->first();
                $isLocked = !$firstLesson || !$progressService->isLessonUnlocked($user, $firstLesson);

                $modulesData[] = [
                    'id' => $module->id,
                    'name' => $module->name,
                    'level' => $level->name,
                    'level_id' => $level->id,
                    'description' => $module->description,
                    'thumbnail_path' => $module->thumbnail_path,
                    'progress' => $progressService->getModuleProgress($user, $module),
                    'is_locked' => $isLocked,
                    'lesson_count' => $module->lessons()->count(),
                ];
            }
        }

        return Inertia::render('Learn/Index', [
            'modules' => $modulesData,
            'levels' => $levels,
        ]);
    }

    /**
     * Show module detail
     */
    public function show(Module $module)
    {
        $user = auth()->user();
        $progressService = new ProgressService();

        $module->load('lessons.userProgress', 'level');

        $lessons = $module->lessons()
            ->orderBy('order_index')
            ->get()
            ->map(function ($lesson) use ($user, $progressService) {
                $progress = $lesson->userProgress()->where('user_id', $user->id)->first();
                $isUnlocked = $progressService->isLessonUnlocked($user, $lesson);

                return [
                    'id' => $lesson->id,
                    'title' => $lesson->title,
                    'type' => $lesson->lesson_type,
                    'order_index' => $lesson->order_index,
                    'xp_reward' => $lesson->xp_reward,
                    'status' => $progress?->status ?? 'locked',
                    'best_score' => $progress?->best_score,
                    'is_unlocked' => $isUnlocked,
                ];
            });

        return Inertia::render('Learn/Module', [
            'module' => [
                'id' => $module->id,
                'name' => $module->name,
                'description' => $module->description,
                'level' => $module->level,
            ],
            'lessons' => $lessons,
        ]);
    }
}
