<?php

namespace App\Jobs;

use App\Mail\BadgeEarnedNotification;
use App\Models\User;
use App\Services\BadgeService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class ProcessBadgeCheckJob implements ShouldQueue
{
    use Queueable;

    public $user;

    /**
     * Create a new job instance.
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $badgeService = new BadgeService();
        $newBadges = $badgeService->checkAll($this->user);

        // Kirim notifikasi email & in-app untuk setiap badge baru
        foreach ($newBadges as $badge) {
            // Email notification
            Mail::send(new BadgeEarnedNotification($this->user, $badge));

            // In-app notification
            $this->user->notifications()->create([
                'type' => 'badge_earned',
                'title' => "🏆 Anda mendapatkan Badge: {$badge->name}!",
                'body' => $badge->description,
                'action_url' => route('badges.user'),
                'reference_type' => 'Badge',
                'reference_id' => $badge->id,
            ]);
        }
    }
}

