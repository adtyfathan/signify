<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\Sign;
use Inertia\Inertia;

class SignController extends Controller
{
    /**
     * Show dictionary of all signs (A-Z)
     */
    public function index()
    {
        $user = auth()->user();
        $signs = Sign::orderBy('order_index')->get();

        $signsData = $signs->map(function ($sign) use ($user) {
            $mastery = $user->signMastery()
                ->where('sign_id', $sign->id)
                ->first();

            return [
                'id' => $sign->id,
                'letter' => $sign->letter,
                'is_vowel' => $sign->is_vowel,
                'description' => $sign->description,
                'video_path' => $sign->video_path,
                'thumbnail_path' => $sign->thumbnail_path,
                'difficulty' => $sign->difficulty,
                'mastery_level' => $mastery?->mastery_level ?? 'not_started',
                'total_correct' => $mastery?->total_correct ?? 0,
                'total_attempts' => $mastery?->total_attempts ?? 0,
                'avg_confidence' => $mastery?->avg_confidence,
            ];
        });

        return Inertia::render('Dictionary/Index', [
            'signs' => $signsData,
        ]);
    }

    /**
     * Show detail for a specific letter
     */
    public function show($letter)
    {
        $user = auth()->user();
        $sign = Sign::where('letter', strtoupper($letter))->firstOrFail();

        $mastery = $user->signMastery()
            ->where('sign_id', $sign->id)
            ->first();

        $signData = [
            'id' => $sign->id,
            'letter' => $sign->letter,
            'is_vowel' => $sign->is_vowel,
            'description' => $sign->description,
            'video_path' => $sign->video_path,
            'thumbnail_path' => $sign->thumbnail_path,
            'guide_image_path' => $sign->guide_image_path,
            'difficulty' => $sign->difficulty,
            'mastery_level' => $mastery?->mastery_level ?? 'not_started',
            'total_correct' => $mastery?->total_correct ?? 0,
            'total_attempts' => $mastery?->total_attempts ?? 0,
            'avg_confidence' => $mastery?->avg_confidence,
        ];

        // Related letters
        $relatedLetters = Sign::where('difficulty', $sign->difficulty)
            ->where('id', '!=', $sign->id)
            ->limit(6)
            ->get()
            ->map(fn ($s) => [
                'letter' => $s->letter,
                'difficulty' => $s->difficulty,
            ]);

        return Inertia::render('Dictionary/Letter', [
            'sign' => $signData,
            'relatedLetters' => $relatedLetters,
        ]);
    }
}
