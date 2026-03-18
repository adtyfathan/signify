<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Lesson;
use App\Models\UserLessonProgress;
use Illuminate\Database\Seeder;

class UserLessonProgressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Unlock first 10 lessons untuk semua user supaya bisa langsung test
     */
    public function run(): void
    {
        $users = User::all();
        $lessons = Lesson::where('is_published', true)->take(10)->get();

        if ($users->isEmpty()) {
            $this->command->warn('⚠️ Tidak ada user. Buat user terlebih dahulu.');
            return;
        }

        if ($lessons->isEmpty()) {
            $this->command->warn('⚠️ Tidak ada lessons. Jalankan QuizSeeder dulu.');
            return;
        }

        foreach ($users as $user) {
            foreach ($lessons as $index => $lesson) {
                UserLessonProgress::updateOrCreate(
                    [
                        'user_id' => $user->id,
                        'lesson_id' => $lesson->id,
                    ],
                    [
                        'status' => $index === 0 ? 'in_progress' : 'unlocked',
                        'best_score' => 0,
                        'attempts' => 0,
                        'time_spent_sec' => 0,
                        'completed_at' => null,
                    ]
                );
            }
        }

        $this->command->info('✅ User lesson progress seeded!');
        $this->command->info("   👥 Users: " . $users->count());
        $this->command->info("   📖 Lessons per user: " . $lessons->count());
        $this->command->info("   📊 Total progress records: " . UserLessonProgress::count());
    }
}
