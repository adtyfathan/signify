<?php

namespace App\Http\Controllers;

use App\Models\Level;
use App\Models\Module;
use App\Models\User;
use App\Services\ProgressService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class DashboardController extends Controller
{
    /**
     * Show dashboard
     */
    public function index()
    {
        $user = auth()->user();
        $user->load('stats');

        // Get recent quiz sessions
        $recentQuizzes = $user->quizSessions()
            ->with('lesson')
            ->latest()
            ->limit(5)
            ->get();

        // Get recent badges
        $recentBadges = $user->badges()
            ->latest('user_badges.earned_at')
            ->limit(5)
            ->get();

        // Get sign mastery grid (A-Z)
        $signMastery = $user->signMastery()
            ->with('sign')
            ->get()
            ->keyBy(fn ($m) => $m->sign->letter)
            ->toArray();

        // Get current progress on each level
        $progressService = new ProgressService();
        $levelProgresses = [];
        foreach (Level::all() as $level) {
            $levelProgresses[] = [
                'level_id' => $level->id,
                'name' => $level->name,
                'progress' => $progressService->getLevelProgress($user, $level),
            ];
        }

        return Inertia::render('Dashboard', [
            'user' => $user,
            'stats' => $user->stats,
            'recentQuizzes' => $recentQuizzes,
            'recentBadges' => $recentBadges,
            'signMastery' => $signMastery,
            'levelProgresses' => $levelProgresses,
        ]);
    }

    /**
     * Show profile edit page
     */
    public function editProfile()
    {
        $user = auth()->user();
        $user->load('stats', 'badges');

        $recentBadges = $user->badges()
            ->latest('user_badges.earned_at')
            ->limit(3)
            ->get();

        $progressService = new ProgressService();
        $levelProgresses = [];
        foreach (Level::all() as $level) {
            $levelProgresses[] = [
                'level_id' => $level->id,
                'name' => $level->name,
                'progress' => $progressService->getLevelProgress($user, $level),
            ];
        }

        return Inertia::render('Profile', [
            'user' => $user,
            'stats' => $user->stats,
            'recentBadges' => $recentBadges,
            'levelProgresses' => $levelProgresses,
        ]);
    }

    /**
     * Update profile
     */
    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'username' => ['required', 'alpha_dash', 'max:50', 'unique:users,username,' . auth()->id()],
            'bio' => ['nullable', 'string', 'max:500'],
            'avatar' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
        ]);

        $user = auth()->user();
        $data = $request->only('name', 'username', 'bio');

        if ($request->hasFile('avatar')) {
            // Hapus avatar lama
            if ($user->avatar_path) {
                $oldPath = str_replace('/storage/', '', $user->avatar_path);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('avatar')->store('avatars', 'public');
            $data['avatar_path'] = '/storage/' . $path;
        }

        $user->update($data);

        return back()->with('success', 'Profil berhasil diperbarui');
    }

    /**
     * Upload avatar
     */
    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
        ]);

        if ($request->hasFile('avatar')) {
            $user = auth()->user();

            // Hapus avatar lama jika ada
            if ($user->avatar_path) {
                $oldPath = str_replace('/storage/', '', $user->avatar_path);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('avatar')->store('avatars', 'public');
            // Simpan sebagai URL publik langsung bisa dipakai di <img src="">
            $user->update(['avatar_path' => '/storage/' . $path]);
        }

        return back()->with('success', 'Avatar berhasil diupload');
    }
    /**
     * Get user stats API
     */
    public function getStats()
    {
        $user = auth()->user();
        $user->load('stats');

        return response()->json($user->stats);
    }

    /**
     * Get user progress API
     */
    public function getProgress()
    {
        $user = auth()->user();

        $progressService = new ProgressService();
        $moduleProgresses = [];

        foreach (Module::all() as $module) {
            $moduleProgresses[] = [
                'module_id' => $module->id,
                'name' => $module->name,
                'progress' => $progressService->getModuleProgress($user, $module),
            ];
        }

        return response()->json($moduleProgresses);
    }

    /**
     * Get user sign mastery
     */
    public function getSignMastery()
    {
        $user = auth()->user();

        $mastery = $user->signMastery()
            ->with('sign')
            ->get()
            ->map(fn ($m) => [
                'letter' => $m->sign->letter,
                'mastery_level' => $m->mastery_level,
                'total_correct' => $m->total_correct,
                'total_attempts' => $m->total_attempts,
                'avg_confidence' => $m->avg_confidence,
            ])
            ->sortBy('letter');

        return response()->json($mastery->values());
    }
}
