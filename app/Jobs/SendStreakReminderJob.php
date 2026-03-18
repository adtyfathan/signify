<?php

namespace App\Jobs;

use App\Mail\StreakReminderNotification;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class SendStreakReminderJob implements ShouldQueue
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
        // Check if user is still active today
        if ($this->user->stats && $this->user->stats->last_activity_date) {
            $lastActivityDate = $this->user->stats->last_activity_date;
            $today = now()->toDateString();
            
            // Jika user sudah aktif hari ini, jangan kirim reminder
            if ($lastActivityDate === $today) {
                return;
            }
        }

        // Send email reminder
        Mail::send(
            new StreakReminderNotification(
                $this->user,
                $this->user->stats?->current_streak ?? 0
            )
        );

        // Create in-app notification
        $this->user->notifications()->create([
            'type' => 'streak_reminder',
            'title' => 'Jangan lupakan streakmu!',
            'body' => "Streakmu saat ini: {$this->user->stats?->current_streak} hari. Mari terus belajar!",
            'action_url' => route('dashboard'),
        ]);
    }
}

