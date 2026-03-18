<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use App\Services\XpService;
use App\Services\ProgressService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Show login form
     */
    public function loginForm()
    {
        return Inertia::render('Auth/Login');
    }

    /**
     * Handle login request
     */
    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            auth()->user()->update(['last_login_at' => now()]);
            return redirect()->route('dashboard');
        }

        return back()->withErrors([
            'email' => 'Email atau password salah.',
        ])->onlyInput('email');
    }

    /**
     * Show register form
     */
    public function registerForm()
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle register request
     */
    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        // Auto-create user stats
        $xpService = new XpService();
        $xpService->awardXp($user, 0, 'system');

        // Initialize first lesson progress
        $progressService = new ProgressService();
        $progressService->initializeProgress($user);

        event(new Registered($user));

        Auth::login($user);

        return redirect()->route('dashboard');
    }

    /**
     * Handle logout
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect()->route('login');
    }

    /**
     * Redirect to Google OAuth
     */
    public function googleRedirect()
    {
        // Implementation for Socialite Google
        // Will be implemented in next phase
        return redirect()->route('login');
    }

    /**
     * Handle Google OAuth callback
     */
    public function googleCallback()
    {
        // Implementation for Socialite Google callback
        // Will be implemented in next phase
        return redirect()->route('login');
    }
}
