<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GamificationController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PracticeController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\SignController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Landing page
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('welcome');

// Auth routes (public)
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'loginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.store');
    
    Route::get('/register', [AuthController::class, 'registerForm'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])->name('register.store');
});

// Auth logout
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');

// Google OAuth (public)
Route::get('/auth/google/redirect', [AuthController::class, 'googleRedirect'])->name('auth.google.redirect');
Route::get('/auth/google/callback', [AuthController::class, 'googleCallback'])->name('auth.google.callback');

// Protected routes - require authentication
Route::middleware('auth')->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/user/stats', [DashboardController::class, 'getStats'])->name('user.stats');
    Route::get('/user/progress', [DashboardController::class, 'getProgress'])->name('user.progress');
    Route::get('/user/sign-mastery', [DashboardController::class, 'getSignMastery'])->name('user.sign-mastery');

    // Profile
    Route::get('/profile', [DashboardController::class, 'editProfile'])->name('profile.edit');
    Route::put('/profile', [DashboardController::class, 'updateProfile'])->name('profile.update');
    Route::post('/profile/avatar', [DashboardController::class, 'uploadAvatar'])->name('profile.avatar');

    // Modules & Learning
    Route::get('/modules', [ModuleController::class, 'index'])->name('modules.index');
    Route::get('/modules/{module}', [ModuleController::class, 'show'])->name('modules.show');
    Route::get('/learn', [ModuleController::class, 'index'])->name('learn.index');
    Route::get('/lessons/{lesson}', [LessonController::class, 'show'])->name('lessons.show');
    Route::post('/lessons/{lesson}/complete', [LessonController::class, 'complete'])->name('lessons.complete');

    // Signs Dictionary
    // Route::get('/signs', [SignController::class, 'index'])->name('signs.index');
    // Route::get('/signs/{letter}', [SignController::class, 'show'])->name('signs.show');
    // Route::get('/dictionary', [SignController::class, 'index'])->name('dictionary.index');
    // Route::get('/dictionary/{id}', [SignController::class, 'show'])->name('dictionary.show');

    // Quiz
    Route::post('/quiz/submit', [QuizController::class, 'submit'])->name('quiz.submit');

    // Practice - Free Practice
    Route::get('/practice', [PracticeController::class, 'index'])->name('practice.index');
    Route::post('/practice/save', [PracticeController::class, 'save'])->name('practice.save');

    // Notifications
    // Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    // Route::put('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    // Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
    // Route::get('/notifications/unread-count', [NotificationController::class, 'getUnreadCount'])->name('notifications.unread-count');

    // Gamification - Leaderboard & Badges
    Route::get('/leaderboard', [GamificationController::class, 'leaderboard'])->name('leaderboard');
    Route::get('/badges', [GamificationController::class, 'showBadges'])->name('badges.index');
    Route::get('/badges/user', [GamificationController::class, 'showUserBadges'])->name('badges.user');
    Route::get('/gamification/xp-history', [GamificationController::class, 'getXpHistory'])->name('xp-history');
    Route::put('/badges/{badge}/feature', [GamificationController::class, 'featureBadge'])->name('badges.feature');

    // Match - Live Practice
    Route::get('/match', function () { 
        return Inertia::render('Match/Index'); 
    })->name('match.index');
});
