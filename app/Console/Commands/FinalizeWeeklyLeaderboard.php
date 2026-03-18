<?php

namespace App\Console\Commands;

use App\Models\LeaderboardWeekly;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;

class FinalizeWeeklyLeaderboard extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'leaderboard:finalize';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Finalize weekly leaderboard and archive previous week data (runs every Monday 00:00)';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Starting weekly leaderboard finalization...');

        $now = Carbon::now();
        $previousWeekKey = $now->copy()->subWeek()->format('Y-\WW');
        $currentWeekKey = $now->format('Y-\WW');

        // Get all leaderboard entries from previous week
        $previousWeekEntries = LeaderboardWeekly::where('week_key', $previousWeekKey)
            ->orderByDesc('xp_earned')
            ->get();

        // Calculate final rankings
        $previousWeekEntries->each(function ($entry, $index) {
            $entry->update(['rank_position' => $index + 1]);
        });

        $this->info("Finalized {$previousWeekEntries->count()} entries for week {$previousWeekKey}");

        // Create new entries for current week with 0 XP for all active users
        $allUsers = User::where('deleted_at', null)->get();
        foreach ($allUsers as $user) {
            LeaderboardWeekly::firstOrCreate(
                ['user_id' => $user->id, 'week_key' => $currentWeekKey],
                ['xp_earned' => 0, 'rank_position' => 0]
            );
        }

        $this->info("Created {$allUsers->count()} entries for new week {$currentWeekKey}");

        return Command::SUCCESS;
    }
}
