<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed core data (levels, signs, badges)
        $this->call([
            LevelSeeder::class,
            SignSeeder::class,
            BadgeSeeder::class,
            QuizSeeder::class,
        ]);

        // Create test user
        User::factory()->create([
            'name' => 'Test User',
            'username' => 'testuser',
            'email' => 'test@example.com',
            'role' => 'learner',
        ]);

        // Unlock lessons untuk user yang baru dibuat
        $this->call([
            UserLessonProgressSeeder::class,
        ]);
    }
}
