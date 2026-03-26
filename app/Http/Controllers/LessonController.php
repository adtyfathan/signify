<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Services\ProgressService;
use App\Services\XpService;
use Inertia\Inertia;

class LessonController extends Controller
{
    /**
     * Show lesson detail
     */
    public function show(Lesson $lesson)
    {
        $user = auth()->user();
        $progressService = new ProgressService();

        $lesson->load('module.level', 'sign', 'quizItems', 'images');

        // Check if user can access this lesson
        if (!$progressService->isLessonUnlocked($user, $lesson)) {
            return redirect()->route('modules.show', $lesson->module_id)->with('error', 'Lesson ini masih terkunci.');
        }

        // Get or create user progress
        $progress = $lesson->userProgress()->where('user_id', $user->id)->first();
        if (!$progress) {
            $progress = $lesson->userProgress()->create([
                'user_id' => $user->id,
                'status' => 'in_progress',
            ]);
        } else {
            // Update status to in_progress if not already
            if ($progress->status === 'locked') {
                $progress->status = 'in_progress';
                $progress->save();
            }
        }

        // Prepare lesson data
        $lessonData = [
            'id' => $lesson->id,
            'title' => $lesson->title,
            'lesson_type' => $lesson->lesson_type,
            'content' => $lesson->content,
            'video_path' => $lesson->video_path,
            'xp_reward' => $lesson->xp_reward,
            'min_pass_score' => $lesson->min_pass_score,
            'module_id' => $lesson->module_id,
            'module_name' => $lesson->module->name,
            'level' => $lesson->module->level->name,
        ];

        // Include sign data if available
        if ($lesson->sign) {
            $lessonData['sign'] = [
                'id' => $lesson->sign->id,
                'letter' => $lesson->sign->letter,
                'description' => $lesson->sign->description,
                'video_path' => $lesson->sign->video_path,
                'guide_image_path' => $lesson->sign->guide_image_path,
                'thumbnail_path' => $lesson->sign->thumbnail_path,
                'difficulty' => $lesson->sign->difficulty,
            ];
        }

        // Include lesson images
        $lessonData['images'] = $lesson->images
            ->map(fn($image) => [
                'id' => $image->id,
                'image_path' => $image->image_path,
                'caption' => $image->caption,
                'order_index' => $image->order_index,
            ])
            ->values();

        // Include quiz items if its a quiz lesson
        if ($lesson->lesson_type !== 'theory') {
            $lessonData['quiz_items'] = $lesson->quizItems()
                ->where('is_active', true)
                ->orderBy('order_index')
                ->get()
                ->map(fn($item) => [
                    'id' => $item->id,
                    'content' => $item->content,
                    'content_length' => $item->content_length,
                    'hint' => $item->hint,
                    'category' => $item->category,
                    'letters_used' => explode(',', $item->letters_used ?? ''),
                    'order_index' => $item->order_index,
                ])
                ->toArray();
        }

        // Previous lesson (same module, lower order_index)
        $prevLesson = Lesson::where('module_id', $lesson->module_id)
            ->where('order_index', '<', $lesson->order_index)
            ->where('is_published', true)
            ->orderBy('order_index', 'desc')
            ->first();

        // Next lesson (same module, higher order_index)
        $nextLesson = Lesson::where('module_id', $lesson->module_id)
            ->where('order_index', '>', $lesson->order_index)
            ->where('is_published', true)
            ->orderBy('order_index')
            ->first();

        $mapLesson = function ($l) {
            if (!$l)
                return null;

            $l->load('images', 'sign');

            $thumbnail =
                $l->images->first()->image_path
                ?? $l->sign?->thumbnail_path
                ?? $l->sign?->guide_image_path
                ?? null;

            return [
                'id' => $l->id,
                'title' => $l->title,
                'lesson_type' => $l->lesson_type,
                'thumbnail' => $thumbnail,
            ];
        };

        return Inertia::render('Learn/Lesson', [
            'lesson' => $lessonData,
            'progress' => [
                'status' => $progress->status,
                'best_score' => $progress->best_score,
                'attempts' => $progress->attempts,
            ],
            'prev_lesson' => $mapLesson($prevLesson),
            'next_lesson' => $mapLesson($nextLesson),
        ]);
    }

    /**
     * Complete a theory lesson
     */
    public function complete(Lesson $lesson)
    {
        $user = auth()->user();
        $progressService = new ProgressService();
        $xpService = new XpService();

        // Check if user can access this lesson
        if (!$progressService->isLessonUnlocked($user, $lesson)) {
            return back()->with('error', 'Lesson tidak dapat diakses.');
        }

        // Only for theory lessons
        if ($lesson->lesson_type !== 'theory') {
            return back()->with('error', 'Hanya pelajaran teori yang dapat diselesaikan dengan cara ini.');
        }

        // Award XP
        $xpService->awardXp($user, $lesson->xp_reward, 'lesson_complete', $lesson->id);

        // Mark lesson as completed
        $progressService->completeLesson($user, $lesson, 100);

        return back()->with('success', 'Pelajaran selesai! +' . $lesson->xp_reward . ' XP');
    }
}