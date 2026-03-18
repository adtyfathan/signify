<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Log;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        //
    })
    ->withSchedule(function (\Illuminate\Console\Scheduling\Schedule $schedule): void {
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
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
