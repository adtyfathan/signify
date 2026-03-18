<?php

namespace Database\Seeders;

use App\Models\Level;
use App\Models\Module;
use App\Models\Lesson;
use App\Models\LessonImage;
use App\Models\QuizItem;
use Illuminate\Database\Seeder;

class QuizSeeder extends Seeder
{
    public function run(): void
    {
        $beginnerLevel = Level::where('slug', 'pemula')->first();
        $intermediateLevel = Level::where('slug', 'menengah')->first();
        $advancedLevel = Level::where('slug', 'mahir')->first();

        if (!$beginnerLevel || !$intermediateLevel || !$advancedLevel) {
            $this->command->warn('⚠️ Levels belum di-seed. Jalankan LevelSeeder dulu.');
            return;
        }

        // ============================
        // MODULE 1: Pengenalan Bahasa Isyarat (Pemula)
        // ============================
        $introModule = Module::create([
            'level_id' => $beginnerLevel->id,
            'name' => 'Pengenalan Bahasa Isyarat',
            'slug' => 'pengenalan-bahasa-isyarat',
            'description' => 'Pelajari materi dasar mengenai bahasa isyarat',
            'type' => 'introduction',
            'order_index' => 1,
            'xp_reward' => 50,
            'is_published' => true,
        ]);

        $introductionLessons = [
            ['title' => 'Apa itu Bahasa Isyarat', 'type' => 'theory', 'content' => 'Pelajari apa itu bahasa isyarat dan pentingnya dalam komunikasi.', 'xp_reward' => 10],
            ['title' => 'Sejarah Bahasa Isyarat di Indonesia', 'type' => 'theory', 'content' => 'Pelajari sejarah bahasa isyarat di Indonesia.', 'xp_reward' => 10],
            ['title' => 'Perbedaan BISINDO dan SIBI', 'type' => 'theory', 'content' => 'Pelajari perbedaan antara BISINDO dan SIBI.', 'xp_reward' => 10],
            ['title' => 'Budaya dan Komunitas Tuli', 'type' => 'theory', 'content' => 'Pelajari budaya dan komunitas tuli.', 'xp_reward' => 10],
            ['title' => 'Pentingnya Bahasa Isyarat dalam Komunikasi', 'type' => 'theory', 'content' => 'Pelajari pentingnya bahasa isyarat dalam komunikasi.', 'xp_reward' => 10],
            ['title' => 'Komponen Bahasa Isyarat', 'type' => 'theory', 'content' => 'Pelajari komponen-komponen bahasa isyarat.', 'xp_reward' => 10],
            ['title' => 'Tata cara berkomunikasi dengan teman Tuli', 'type' => 'theory', 'content' => 'Pelajari tata cara berkomunikasi dengan teman tuli.', 'xp_reward' => 10],
            ['title' => 'Etika dalam menggunakan Bahasa Isyarat', 'type' => 'theory', 'content' => 'Pelajari etika dalam menggunakan bahasa isyarat.', 'xp_reward' => 10],
        ];

        foreach ($introductionLessons as $index => $lessonData) {
            Lesson::create([
                'module_id' => $introModule->id,
                'title' => $lessonData['title'],
                'lesson_type' => $lessonData['type'],
                'content' => $lessonData['content'] ?? null,
                'order_index' => $index + 1,
                'xp_reward' => $lessonData['xp_reward'],
                'is_published' => true,
            ]);
        }

        // ============================
        // MODULE 2: Alfabet Bahasa Isyarat (Pemula)
        // ============================
        $alphabetModule = Module::create([
            'level_id' => $beginnerLevel->id,
            'name' => 'Alfabet Bahasa Isyarat',
            'slug' => 'alfabet-bahasa-isyarat',
            'description' => 'Pelajari alfabet dalam Bahasa Isyarat Indonesia',
            'type' => 'alphabet',
            'order_index' => 2,
            'xp_reward' => 100,
            'is_published' => true,
        ]);

        $alphabetLessons = [
            ['title' => 'Huruf A', 'type' => 'theory', 'content' => 'Pelajari huruf A dalam Bahasa Isyarat Indonesia.', 'video_path' => 'videos/a.mp4', 'images_path' => ['images/a.webp'], 'xp_reward' => 10],
            ['title' => 'Kuis Huruf A', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf B', 'type' => 'theory', 'content' => 'Pelajari huruf B dalam Bahasa Isyarat Indonesia.', 'xp_reward' => 10],
            ['title' => 'Kuis Huruf B', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf C', 'type' => 'theory', 'content' => 'Pelajari huruf C dalam Bahasa Isyarat Indonesia.', 'xp_reward' => 10],
            ['title' => 'Kuis Huruf C', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf D', 'type' => 'theory', 'content' => 'Pelajari huruf D dalam Bahasa Isyarat Indonesia.', 'xp_reward' => 10],
            ['title' => 'Kuis Huruf D', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf E', 'type' => 'theory', 'content' => 'Pelajari huruf E dalam Bahasa Isyarat Indonesia.', 'xp_reward' => 10],
            ['title' => 'Kuis Huruf E', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf F', 'type' => 'theory', 'content' => 'Pelajari huruf F dalam Bahasa Isyarat Indonesia.', 'xp_reward' => 10],
            ['title' => 'Kuis Huruf F', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf G', 'type' => 'theory', 'content' => 'Pelajari huruf G dalam Bahasa Isyarat Indonesia.', 'xp_reward' => 10],
            ['title' => 'Kuis Huruf G', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf H', 'type' => 'theory', 'content' => 'Pelajari huruf H dalam Bahasa Isyarat Indonesia.', 'xp_reward' => 10],
            ['title' => 'Kuis Huruf H', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf I', 'type' => 'theory', 'content' => 'Pelajari huruf I dalam Bahasa Isyarat Indonesia.', 'xp_reward' => 10],
            ['title' => 'Kuis Huruf I', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf J', 'type' => 'theory', 'content' => 'Pelajari huruf J dalam Bahasa Isyarat Indonesia.', 'xp_reward' => 10],
            ['title' => 'Kuis Huruf J', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf K', 'type' => 'theory', 'content' => 'Pelajari huruf K dalam Bahasa Isyarat Indonesia.', 'xp_reward' => 10],
            ['title' => 'Kuis Huruf K', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf L', 'type' => 'theory', 'content' => 'Pelajari huruf L dalam Bahasa Isyarat Indonesia.', 'xp_reward' => 10],
            ['title' => 'Kuis Huruf L', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf M', 'type' => 'theory', 'content' => 'Pelajari huruf M dalam Bahasa Isyarat Indonesia.', 'xp_reward' => 10],
            ['title' => 'Kuis Huruf M', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf N', 'type' => 'theory', 'content' => 'Pelajari huruf N dalam Bahasa Isyarat Indonesia.', 'xp_reward' => 10],
            ['title' => 'Kuis Huruf N', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf O', 'type' => 'theory', 'content' => 'Pelajari huruf O dalam Bahasa Isyarat Indonesia.', 'xp_reward' => 10],
            ['title' => 'Kuis Huruf O', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf P', 'type' => 'theory', 'content' => 'Pelajari huruf P dalam Bahasa Isyarat Indonesia.', 'xp_reward' => 10],
            ['title' => 'Kuis Huruf P', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf Q', 'type' => 'theory', 'content' => 'Pelajari huruf Q dalam Bahasa Isyarat Indonesia.', 'xp_reward' => 10],
            ['title' => 'Kuis Huruf Q', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf R', 'type' => 'theory', 'content' => 'Pelajari huruf R dalam Bahasa Isyarat Indonesia.', 'xp_reward' => 10],
            ['title' => 'Kuis Huruf R', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf S', 'type' => 'theory', 'content' => 'Pelajari huruf S dalam Bahasa Isyarat Indonesia.', 'xp_reward' => 10],
            ['title' => 'Kuis Huruf S', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf T', 'type' => 'theory', 'content' => 'Pelajari huruf T dalam Bahasa Isyarat Indonesia.', 'xp_reward' => 10],
            ['title' => 'Kuis Huruf T', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf U', 'type' => 'theory', 'content' => 'Pelajari huruf U dalam Bahasa Isyarat Indonesia.', 'xp_reward' => 10],
            ['title' => 'Kuis Huruf U', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf V', 'type' => 'theory', 'content' => 'Pelajari huruf V dalam Bahasa Isyarat Indonesia.', 'xp_reward' => 10],
            ['title' => 'Kuis Huruf V', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf W', 'type' => 'theory', 'content' => 'Pelajari huruf W dalam Bahasa Isyarat Indonesia.', 'xp_reward' => 10],
            ['title' => 'Kuis Huruf W', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf X', 'type' => 'theory', 'content' => 'Pelajari huruf X dalam Bahasa Isyarat Indonesia.', 'xp_reward' => 10],
            ['title' => 'Kuis Huruf X', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf Y', 'type' => 'theory', 'content' => 'Pelajari huruf Y dalam Bahasa Isyarat Indonesia.', 'xp_reward' => 10],
            ['title' => 'Kuis Huruf Y', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf Z', 'type' => 'theory', 'content' => 'Pelajari huruf Z dalam Bahasa Isyarat Indonesia.', 'xp_reward' => 10],
            ['title' => 'Kuis Huruf Z', 'type' => 'quiz_letter', 'xp_reward' => 20],
        ];

        foreach ($alphabetLessons as $index => $lessonData) {
            $lesson = Lesson::create([
                'module_id' => $alphabetModule->id,
                'title' => $lessonData['title'],
                'lesson_type' => $lessonData['type'],
                'content' => $lessonData['content'] ?? null,
                'video_path' => $lessonData['video_path'] ?? null,
                'order_index' => $index + 1,
                'xp_reward' => $lessonData['xp_reward'],
                'is_published' => true,
            ]);

            foreach ($lessonData['images_path'] ?? [] as $i => $imagePath) {
                LessonImage::create([
                    'lesson_id' => $lesson->id,
                    'image_path' => $imagePath,
                    'order_index' => $i + 1,
                ]);
            }

            if ($lessonData['type'] == 'quiz_letter') {
                $this->createQuizLetters($lesson);
            }
        }

        // ============================
        // MODULE 3: Kosakata Dasar (Menengah)
        // ============================
        $vocabularyModule = Module::create([
            'level_id' => $intermediateLevel->id,
            'name' => 'Kosakata Dasar',
            'slug' => 'kosakata-dasar',
            'description' => 'Pelajari kosakata dasar dalam Bahasa Isyarat',
            'type' => 'vocabulary',
            'order_index' => 3,
            'xp_reward' => 150,
            'is_published' => true,
        ]);

        // 'word' berisi tepat 1 kata per quiz lesson
        $vocabularyLessons = [
            ['title' => 'Kosakata Perkenalan', 'type' => 'theory', 'xp_reward' => 15, 'word' => null],
            ['title' => 'Kuis Kosakata Perkenalan', 'type' => 'quiz_word', 'xp_reward' => 20, 'word' => 'HALO'],
            ['title' => 'Kosakata Waktu', 'type' => 'theory', 'xp_reward' => 15, 'word' => null],
            ['title' => 'Kuis Kosakata Waktu', 'type' => 'quiz_word', 'xp_reward' => 20, 'word' => 'PAGI'],
            ['title' => 'Kosakata Keluarga', 'type' => 'theory', 'xp_reward' => 15, 'word' => null],
            ['title' => 'Kuis Kosakata Keluarga', 'type' => 'quiz_word', 'xp_reward' => 20, 'word' => 'AYAH'],
            ['title' => 'Kosakata Makanan & Minuman', 'type' => 'theory', 'xp_reward' => 15, 'word' => null],
            ['title' => 'Kuis Kosakata Makanan & Minuman', 'type' => 'quiz_word', 'xp_reward' => 20, 'word' => 'NASI'],
        ];

        foreach ($vocabularyLessons as $index => $lessonData) {
            $lesson = Lesson::create([
                'module_id' => $vocabularyModule->id,
                'title' => $lessonData['title'],
                'lesson_type' => $lessonData['type'],
                'content' => "Pelajari $lessonData[title] untuk berkomunikasi dengan bahasa isyarat.",
                'order_index' => $index + 1,
                'xp_reward' => $lessonData['xp_reward'],
                'is_published' => true,
            ]);

            if ($lessonData['type'] == 'quiz_word') {
                $this->createQuizWord($lesson, $lessonData['word']);
            }
        }

        // ============================
        // MODULE 4: Percakapan Sehari-hari (Mahir)
        // ============================
        $advancedModule = Module::create([
            'level_id' => $advancedLevel->id,
            'name' => 'Percakapan Sehari-hari',
            'slug' => 'percakapan-sehari-hari',
            'description' => 'Pelajari "percakapan sehari-hari" dalam Bahasa Isyarat Indonesia',
            'type' => 'conversation',
            'order_index' => 4,
            'xp_reward' => 150,
            'is_published' => false,
        ]);

        $advancedLessons = [
            ['title' => 'Mengucapkan salam', 'type' => 'theory', 'xp_reward' => 15, 'word' => null],
            ['title' => 'Kuis Mengucapkan Salam', 'type' => 'quiz_word', 'xp_reward' => 50, 'word' => 'SELAMATPAGI'],
            ['title' => 'Memperkenalkan diri', 'type' => 'theory', 'xp_reward' => 15, 'word' => null],
            ['title' => 'Kuis Memperkenalkan Diri', 'type' => 'quiz_word', 'xp_reward' => 50, 'word' => 'NAMASAYA'],
            ['title' => 'Menanyakan kabar', 'type' => 'theory', 'xp_reward' => 15, 'word' => null],
            ['title' => 'Kuis Menanyakan Kabar', 'type' => 'quiz_word', 'xp_reward' => 50, 'word' => 'APAKABAR'],
            ['title' => 'Berbicara tentang hobi', 'type' => 'theory', 'xp_reward' => 15, 'word' => null],
            ['title' => 'Kuis Berbicara tentang Hobi', 'type' => 'quiz_word', 'xp_reward' => 50, 'word' => 'HOBIKUMEMBACA'],
        ];

        foreach ($advancedLessons as $index => $lessonData) {
            $lesson = Lesson::create([
                'module_id' => $advancedModule->id,
                'title' => $lessonData['title'],
                'lesson_type' => $lessonData['type'],
                'content' => "Level lanjutan: $lessonData[title]",
                'order_index' => $index + 1,
                'xp_reward' => $lessonData['xp_reward'],
                'is_published' => false,
            ]);

            if ($lessonData['type'] == 'quiz_word') {
                $this->createQuizWord($lesson, $lessonData['word']);
            }
        }

        $this->command->info('✅ Quiz data seeded successfully!');
    }

    /**
     * Create 1 quiz letter item sesuai huruf pada judul lesson (misal "Kuis Huruf A" → huruf A).
     */
    private function createQuizLetters(Lesson $lesson): void
    {
        preg_match('/Huruf\s+([A-Z])/i', $lesson->title, $matches);
        $letter = strtoupper($matches[1] ?? '');

        if (!$letter)
            return;

        QuizItem::create([
            'lesson_id' => $lesson->id,
            'content' => $letter,
            'content_length' => 1,
            'hint' => "Isyaratkan huruf $letter",
            'category' => 'letter',
            'letters_used' => $letter,
            'order_index' => 1,
            'is_active' => true,
        ]);
    }

    /**
     * Create tepat 1 quiz word item untuk sebuah quiz_word lesson.
     */
    private function createQuizWord(Lesson $lesson, string $word): void
    {
        QuizItem::create([
            'lesson_id' => $lesson->id,
            'content' => $word,
            'content_length' => strlen($word),
            'hint' => "Isyaratkan: " . strtolower($word),
            'category' => 'word',
            'letters_used' => implode(',', str_split($word)),
            'order_index' => 1,
            'is_active' => true,
        ]);
    }
}