<?php

namespace App\Console\Commands;

use App\Jobs\SendStreakReminderJob;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SendStreakReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'streak:remind';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send streak reminder emails to users who haven\'t been active for >20 hours (runs daily 20:00)';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Sending streak reminder notifications...');

        $now = Carbon::now();
        $twentyHoursAgo = $now->copy()->subHours(20);

        // Find users with streak > 0 and last activity > 20 hours ago
        $usersToRemind = User::whereHas('stats', function ($query) use ($twentyHoursAgo) {
            $query->where('current_streak', '>', 0)
                ->where('last_activity_date', '<', $twentyHoursAgo->toDateString())
                ->orWhereNull('last_activity_date');
        })->get();

        $count = 0;
        foreach ($usersToRemind as $user) {
            dispatch(new SendStreakReminderJob($user));
            $count++;
        }

        $this->info("Dispatched {$count} streak reminder jobs");

        return Command::SUCCESS;
    }
}
