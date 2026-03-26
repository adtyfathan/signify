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
            UserSeeder::class,
        ]);
    }
}
