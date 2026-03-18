<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Log;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Finalize weekly leaderboard every Monday at 00:00
        $schedule->command('leaderboard:finalize')
            ->weeklyOn(1, '00:00')  // 1 = Monday
            ->timezone('Asia/Jakarta')
            ->onSuccess(function () {
                Log::info('Weekly leaderboard finalized successfully');
            })
            ->onFailure(function () {
                Log::error('Failed to finalize weekly leaderboard');
            });

        // Send streak reminders daily at 20:00
        $schedule->command('streak:remind')
            ->dailyAt('20:00')
            ->timezone('Asia/Jakarta')
            ->onSuccess(function () {
                Log::info('Streak reminders sent successfully');
            })
            ->onFailure(function () {
                Log::error('Failed to send streak reminders');
            });
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
