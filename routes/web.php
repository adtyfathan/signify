<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GamificationController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\PracticeController;
use App\Http\Controllers\QuizController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Landing page
Route::get('/', function () {
    return auth()->check()
        ? redirect()->route('dashboard')
        : redirect()->route('login');
});

// Auth routes (public)
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'loginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.store');
    
    Route::get('/register', [AuthController::class, 'registerForm'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])->name('register.store');
});

// Auth logout
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');

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

    // Quiz
    Route::post('/quiz/submit', [QuizController::class, 'submit'])->name('quiz.submit');

    // Practice - Free Practice
    Route::get('/practice', [PracticeController::class, 'index'])->name('practice.index');
    Route::post('/practice/save', [PracticeController::class, 'save'])->name('practice.save');

    // Gamification - Leaderboard & Badges
    Route::get('/leaderboard', [GamificationController::class, 'leaderboard'])->name('leaderboard');
    Route::get('/badges', [GamificationController::class, 'showBadges'])->name('badges.index');
    Route::get('/badges/user', [GamificationController::class, 'showUserBadges'])->name('badges.user');
    Route::get('/gamification/xp-history', [GamificationController::class, 'getXpHistory'])->name('xp-history');
    Route::put('/badges/{badge}/feature', [GamificationController::class, 'featureBadge'])->name('badges.feature');
});
