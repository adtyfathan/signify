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
            ['title' => 'Apa itu Bahasa Isyarat', 'type' => 'theory', 'content' => 'Pelajari apa itu bahasa isyarat dan pentingnya dalam komunikasi.', 'video_path' => 'https://www.youtube.com/watch?v=wC9R0Sw6QaY', 'images_path' => ['images/1-1.webp'], 'xp_reward' => 10],
            ['title' => 'Sejarah Bahasa Isyarat di Indonesia', 'type' => 'theory', 'content' => 'Pelajari sejarah bahasa isyarat di Indonesia.', 'video_path' => 'https://youtu.be/HBIbhj6jz-I?si=arGQriYFNHuUq7uH', 'images_path' => ['images/1-2.webp'], 'xp_reward' => 10],
            ['title' => 'Perbedaan BISINDO dan SIBI', 'type' => 'theory', 'content' => 'Pelajari perbedaan antara BISINDO dan SIBI.', 'video_path' => 'https://youtu.be/4DZnZv3weBw?si=ZMF5Sb3YDYtFUpZw', 'images_path' => ['images/1-3.webp'], 'xp_reward' => 10],
            ['title' => 'Budaya dan Komunitas Tuli', 'type' => 'theory', 'content' => 'Pelajari budaya dan komunitas tuli.', 'video_path' => 'https://youtu.be/S7vw4OVd0Ws?si=Lxv1mWjaCQWknoQZ', 'images_path' => ['images/1-4.webp'], 'xp_reward' => 10],
            ['title' => 'Pentingnya Bahasa Isyarat dalam Komunikasi', 'type' => 'theory', 'content' => 'Pelajari pentingnya bahasa isyarat dalam komunikasi.', 'video_path' => 'https://youtu.be/sLXJxiS1N5M?si=GrlX-L7d61NKIw8w', 'images_path' => ['images/1-5.webp'], 'xp_reward' => 10],
            ['title' => 'Tata cara berkomunikasi dengan teman Tuli', 'type' => 'theory', 'content' => 'Pelajari tata cara berkomunikasi dengan teman tuli.', 'video_path' => 'https://youtu.be/YQllNs-GkQk?si=HgnRrCfcHhlRKIat', 'images_path' => ['images/1-6.webp'], 'xp_reward' => 10],
            ['title' => 'Etika dalam menggunakan Bahasa Isyarat', 'type' => 'theory', 'content' => 'Pelajari etika dalam menggunakan bahasa isyarat.', 'video_path' => 'https://youtu.be/-dhQJO9Mkms?si=PCyy2eJVkkEaQHlt', 'images_path' => ['images/1-7.webp'], 'xp_reward' => 10],
        ];

        foreach ($introductionLessons as $index => $lessonData) {
            $lesson = Lesson::create([
                'module_id' => $introModule->id,
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
            ['title' => 'Huruf A', 'type' => 'theory', 'content' => 'Pelajari huruf A dalam Bahasa Isyarat Indonesia.', 'video_path' => 'https://youtu.be/bSMqB24djqA?si=V3uU0vY9SHYbxjlJ', 'images_path' => ['images/a.webp', 'images/a1.webp', 'images/a2.webp', 'images/a3.webp'], 'xp_reward' => 10],
            ['title' => 'Kuis Huruf A', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf B', 'type' => 'theory', 'content' => 'Pelajari huruf B dalam Bahasa Isyarat Indonesia.', 'video_path' => 'https://youtu.be/xHyI7QCACPs?si=iAKGjSKPy8Jk30IE', 'images_path' => ['images/b.webp', 'images/b1.webp', 'images/b2.webp', 'images/b3.webp'], 'xp_reward' => 10],
            ['title' => 'Kuis Huruf B', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf C', 'type' => 'theory', 'content' => 'Pelajari huruf C dalam Bahasa Isyarat Indonesia.', 'video_path' => 'https://youtu.be/4WvEAddARlw?si=1zi1aWA5ruPd9nO1', 'images_path' => ['images/c.webp', 'images/c1.webp', 'images/c2.webp', 'images/c3.webp'], 'xp_reward' => 10],
            ['title' => 'Kuis Huruf C', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf D', 'type' => 'theory', 'content' => 'Pelajari huruf D dalam Bahasa Isyarat Indonesia.', 'video_path' => 'https://youtu.be/9ljEJTWTEMA?si=krMg76RzRV5T5mqF', 'images_path' => ['images/d.webp', 'images/d1.webp', 'images/d2.webp', 'images/d3.webp'], 'xp_reward' => 10],
            ['title' => 'Kuis Huruf D', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf E', 'type' => 'theory', 'content' => 'Pelajari huruf E dalam Bahasa Isyarat Indonesia.', 'video_path' => 'https://youtu.be/K3d31najZCo?si=lEt5SnnFQsInFr-7', 'images_path' => ['images/e.webp', 'images/e1.webp', 'images/e2.webp', 'images/e3.webp'], 'xp_reward' => 10],
            ['title' => 'Kuis Huruf E', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf F', 'type' => 'theory', 'content' => 'Pelajari huruf F dalam Bahasa Isyarat Indonesia.', 'video_path' => 'https://youtu.be/QPg0-FS0hp4?si=f2676gXEg6-HHR7i', 'images_path' => ['images/f.webp', 'images/f1.webp', 'images/f2.webp', 'images/f3.webp'], 'xp_reward' => 10],
            ['title' => 'Kuis Huruf F', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf G', 'type' => 'theory', 'content' => 'Pelajari huruf G dalam Bahasa Isyarat Indonesia.', 'video_path' => 'https://youtu.be/atGncJVLzKg?si=x09INjVk3ig1HRlx', 'images_path' => ['images/g.webp', 'images/g1.webp', 'images/g2.webp', 'images/g3.webp'], 'xp_reward' => 10],
            ['title' => 'Kuis Huruf G', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf H', 'type' => 'theory', 'content' => 'Pelajari huruf H dalam Bahasa Isyarat Indonesia.', 'video_path' => 'https://youtu.be/oaPpB3miOG8?si=iEWa2XoKcyDRaoGa', 'images_path' => ['images/h.webp', 'images/h1.webp', 'images/h2.webp', 'images/h3.webp'], 'xp_reward' => 10],
            ['title' => 'Kuis Huruf H', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf I', 'type' => 'theory', 'content' => 'Pelajari huruf I dalam Bahasa Isyarat Indonesia.', 'video_path' => 'https://youtu.be/9q-lrjFz0zo?si=M336m85SXnC5fqIZ', 'images_path' => ['images/i.webp', 'images/i1.webp', 'images/i2.webp', 'images/i3.webp'], 'xp_reward' => 10],
            ['title' => 'Kuis Huruf I', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf J', 'type' => 'theory', 'content' => 'Pelajari huruf J dalam Bahasa Isyarat Indonesia.', 'video_path' => 'https://youtu.be/mo6jucvLzJ8?si=L7nOZdhTg_JA9MXR', 'images_path' => ['images/j.webp', 'images/j1.webp', 'images/j2.webp', 'images/j3.webp'], 'xp_reward' => 10],
            ['title' => 'Kuis Huruf J', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf K', 'type' => 'theory', 'content' => 'Pelajari huruf K dalam Bahasa Isyarat Indonesia.', 'video_path' => 'https://youtu.be/bDgxi-1H6Tw?si=0tdQMKk827dbapDS', 'images_path' => ['images/k.webp', 'images/k1.webp', 'images/k2.webp', 'images/k3.webp'], 'xp_reward' => 10],
            ['title' => 'Kuis Huruf K', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf L', 'type' => 'theory', 'content' => 'Pelajari huruf L dalam Bahasa Isyarat Indonesia.', 'video_path' => 'https://youtu.be/grDRXaAGI9c?si=tZzdg0ljnI73GCet', 'images_path' => ['images/l.webp', 'images/l1.webp', 'images/l2.webp', 'images/l3.webp'], 'xp_reward' => 10],
            ['title' => 'Kuis Huruf L', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf M', 'type' => 'theory', 'content' => 'Pelajari huruf M dalam Bahasa Isyarat Indonesia.', 'video_path' => 'https://youtu.be/ju_p_gE06ag?si=CXd3IUdHtQlREQxH', 'images_path' => ['images/m.webp', 'images/m1.webp', 'images/m2.webp', 'images/m3.webp'], 'xp_reward' => 10],
            ['title' => 'Kuis Huruf M', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf N', 'type' => 'theory', 'content' => 'Pelajari huruf N dalam Bahasa Isyarat Indonesia.', 'video_path' => 'https://youtu.be/7r-dQQYWCfk?si=ZTyEfbl2Ff9J8xoq', 'images_path' => ['images/n.webp', 'images/n1.webp', 'images/n2.webp', 'images/n3.webp'], 'xp_reward' => 10],
            ['title' => 'Kuis Huruf N', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf O', 'type' => 'theory', 'content' => 'Pelajari huruf O dalam Bahasa Isyarat Indonesia.', 'video_path' => 'https://youtu.be/535aHDwKtGs?si=ZD4X71g_9c5ETI_k', 'images_path' => ['images/o.webp', 'images/o1.webp', 'images/o2.webp', 'images/o3.webp'], 'xp_reward' => 10],
            ['title' => 'Kuis Huruf O', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf P', 'type' => 'theory', 'content' => 'Pelajari huruf P dalam Bahasa Isyarat Indonesia.', 'video_path' => 'https://youtu.be/GnSCfcUSU84?si=R4fgUgMyb5UYI5GI', 'images_path' => ['images/p.webp', 'images/p1.webp', 'images/p2.webp', 'images/p3.webp'], 'xp_reward' => 10],
            ['title' => 'Kuis Huruf P', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf Q', 'type' => 'theory', 'content' => 'Pelajari huruf Q dalam Bahasa Isyarat Indonesia.', 'video_path' => 'https://youtu.be/j0RShuivzFo?si=4s1fBvLGw0uQOu3w', 'images_path' => ['images/q.webp', 'images/q1.webp', 'images/q2.webp', 'images/q3.webp'], 'xp_reward' => 10],
            ['title' => 'Kuis Huruf Q', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf R', 'type' => 'theory', 'content' => 'Pelajari huruf R dalam Bahasa Isyarat Indonesia.', 'video_path' => 'https://youtu.be/J_kgngoZXFc?si=Hwulpakd38hnYqxy', 'images_path' => ['images/r.webp', 'images/r1.webp', 'images/r2.webp', 'images/r3.webp'], 'xp_reward' => 10],
            ['title' => 'Kuis Huruf R', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf S', 'type' => 'theory', 'content' => 'Pelajari huruf S dalam Bahasa Isyarat Indonesia.', 'video_path' => 'https://youtu.be/y2XTZFSHbdw?si=taDQLtP0lCs3w6W7', 'images_path' => ['images/s.webp', 'images/s1.webp', 'images/s2.webp', 'images/s3.webp'], 'xp_reward' => 10],
            ['title' => 'Kuis Huruf S', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf T', 'type' => 'theory', 'content' => 'Pelajari huruf T dalam Bahasa Isyarat Indonesia.', 'video_path' => 'https://youtu.be/MBCUdrURkLo?si=_5DFK5XCNBm4B-WL', 'images_path' => ['images/t.webp', 'images/t1.webp', 'images/t2.webp', 'images/t3.webp'], 'xp_reward' => 10],
            ['title' => 'Kuis Huruf T', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf U', 'type' => 'theory', 'content' => 'Pelajari huruf U dalam Bahasa Isyarat Indonesia.', 'video_path' => 'https://youtu.be/JA5e1Y7UJV4?si=7kNpFlbqR5ke5Yvo', 'images_path' => ['images/u.webp', 'images/u1.webp', 'images/u2.webp', 'images/u3.webp'], 'xp_reward' => 10],
            ['title' => 'Kuis Huruf U', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf V', 'type' => 'theory', 'content' => 'Pelajari huruf V dalam Bahasa Isyarat Indonesia.', 'video_path' => 'https://youtu.be/UPxmw6uOX1c?si=GVeWpzXibCEnb4ed', 'images_path' => ['images/v.webp', 'images/v1.webp', 'images/v2.webp', 'images/v3.webp'], 'xp_reward' => 10],
            ['title' => 'Kuis Huruf V', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf W', 'type' => 'theory', 'content' => 'Pelajari huruf W dalam Bahasa Isyarat Indonesia.', 'video_path' => 'https://youtu.be/eF5OdoiLP-8?si=A1ySLAo67ReWU9Cm', 'images_path' => ['images/w.webp', 'images/w1.webp', 'images/w2.webp', 'images/w3.webp'], 'xp_reward' => 10],
            ['title' => 'Kuis Huruf W', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf X', 'type' => 'theory', 'content' => 'Pelajari huruf X dalam Bahasa Isyarat Indonesia.', 'video_path' => 'https://youtu.be/jGIbDXsdGVY?si=VP8h5t3ch5rOZtxv', 'images_path' => ['images/x.webp', 'images/x1.webp', 'images/x2.webp', 'images/x3.webp'], 'xp_reward' => 10],
            ['title' => 'Kuis Huruf X', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf Y', 'type' => 'theory', 'content' => 'Pelajari huruf Y dalam Bahasa Isyarat Indonesia.', 'video_path' => 'videos/y.mp4', 'images_path' => ['images/y.webp', 'images/y1.webp', 'images/y2.webp', 'images/y3.webp'], 'xp_reward' => 10],
            ['title' => 'Kuis Huruf Y', 'type' => 'quiz_letter', 'xp_reward' => 20],
            ['title' => 'Huruf Z', 'type' => 'theory', 'content' => 'Pelajari huruf Z dalam Bahasa Isyarat Indonesia.', 'video_path' => 'https://youtu.be/q0U2utP7CTs?si=EpQaqRliyoRS7pSw', 'images_path' => ['images/z.webp', 'images/z1.webp', 'images/z2.webp', 'images/z3.webp'], 'xp_reward' => 10],
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
            ['title' => 'Kosakata Perkenalan', 'type' => 'theory', 'content' => 'Pelajari kosakata perkenalan dalam Bahasa Isyarat Indonesia.', 'images_path' => ['images/perkenalan.webp', 'images/h3.webp', 'images/a3.webp', 'images/l3.webp', 'images/o3.webp'],'xp_reward' => 15, 'word' => null],
            ['title' => 'Kuis Kosakata Perkenalan', 'type' => 'quiz_word', 'xp_reward' => 20, 'word' => 'HALO'],
            ['title' => 'Kosakata Waktu', 'type' => 'theory', 'content' => 'Pelajari kosakata waktu dalam Bahasa Isyarat Indonesia.', 'images_path' => ['images/waktu.webp', 'images/p3.webp', 'images/a3.webp', 'images/g3.webp', 'images/i3.webp'], 'xp_reward' => 15, 'word' => null],
            ['title' => 'Kuis Kosakata Waktu', 'type' => 'quiz_word', 'xp_reward' => 20, 'word' => 'PAGI'],
            ['title' => 'Kosakata Keluarga', 'type' => 'theory', 'content' => 'Pelajari kosakata keluarga dalam Bahasa Isyarat Indonesia.', 'images_path' => ['images/keluarga.webp', 'images/a3.webp', 'images/y3.webp', 'images/a3.webp', 'images/h3.webp'], 'xp_reward' => 15, 'word' => null],
            ['title' => 'Kuis Kosakata Keluarga', 'type' => 'quiz_word', 'xp_reward' => 20, 'word' => 'AYAH'],
            ['title' => 'Kosakata Makanan & Minuman', 'type' => 'theory', 'content' => 'Pelajari kosakata makanan dan minuman dalam Bahasa Isyarat Indonesia.', 'images_path' => ['images/makanan.webp', 'images/n3.webp', 'images/a3.webp', 'images/s3.webp', 'images/i3.webp'], 'xp_reward' => 15, 'word' => null],
            ['title' => 'Kuis Kosakata Makanan & Minuman', 'type' => 'quiz_word', 'xp_reward' => 20, 'word' => 'NASI'],
        ];

        foreach ($vocabularyLessons as $index => $lessonData) {
            $lesson = Lesson::create([
                'module_id' => $vocabularyModule->id,
                'title' => $lessonData['title'],
                'lesson_type' => $lessonData['type'],
                'content' => $lessonData['content'] ?? null,
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
            'is_published' => true,
        ]);

        $advancedLessons = [
            ['title' => 'Mengucapkan salam', 'type' => 'theory', 'content' => 'Pelajari cara mengucapkan salam dalam Bahasa Isyarat Indonesia.', 'images_path' => ['images/salam.webp', 'images/s3.webp', 'images/e3.webp', 'images/l3.webp', 'images/a3.webp', 'images/m3.webp', 'images/a3.webp', 'images/t3.webp', 'images/p3.webp', 'images/a3.webp', 'images/g3.webp', 'images/i3.webp'], 'xp_reward' => 15, 'word' => null],
            ['title' => 'Kuis Mengucapkan Salam', 'type' => 'quiz_word', 'xp_reward' => 50, 'word' => 'SELAMATPAGI'],
            ['title' => 'Memperkenalkan diri', 'type' => 'theory', 'content' => 'Pelajari cara memperkenalkan diri dalam Bahasa Isyarat Indonesia.', 'images_path' => ['images/memperkenalkan.webp', 'images/n3.webp', 'images/a3.webp', 'images/m3.webp', 'images/a3.webp', 'images/s3.webp', 'images/a3.webp', 'images/y3.webp', 'images/a3.webp', 'images/a3.webp', 'images/a3.webp'], 'xp_reward' => 15, 'word' => null],
            ['title' => 'Kuis Memperkenalkan Diri', 'type' => 'quiz_word', 'xp_reward' => 50, 'word' => 'NAMASAYA'],
            ['title' => 'Menanyakan kabar', 'type' => 'theory', 'content' => 'Pelajari cara menanyakan kabar dalam Bahasa Isyarat Indonesia.', 'images_path' => ['images/kabar.webp', 'images/a3.webp', 'images/p3.webp', 'images/a3.webp', 'images/k3.webp', 'images/a3.webp', 'images/b3.webp', 'images/a3.webp', 'images/r3.webp'], 'xp_reward' => 15, 'word' => null],
            ['title' => 'Kuis Menanyakan Kabar', 'type' => 'quiz_word', 'xp_reward' => 50, 'word' => 'APAKABAR'],
            ['title' => 'Berbicara tentang hobi', 'type' => 'theory', 'content' => 'Pelajari cara berbicara tentang hobi dalam Bahasa Isyarat Indonesia.', 'images_path' => ['images/hobi.webp', 'images/h3.webp', 'images/o3.webp', 'images/b3.webp', 'images/i3.webp', 'images/k3.webp', 'images/u3.webp', 'images/m3.webp', 'images/e3.webp', 'images/m3.webp', 'images/b3.webp', 'images/a3.webp', 'images/c3.webp', 'images/a3.webp'], 'xp_reward' => 15, 'word' => null],
            ['title' => 'Kuis Berbicara tentang Hobi', 'type' => 'quiz_word', 'xp_reward' => 50, 'word' => 'HOBIKUMEMBACA'],
        ];

        foreach ($advancedLessons as $index => $lessonData) {
            $lesson = Lesson::create([
                'module_id' => $advancedModule->id,
                'title' => $lessonData['title'],
                'lesson_type' => $lessonData['type'],
                'content' => $lessonData['content'] ?? null,
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

            if ($lessonData['type'] == 'quiz_word') {
                $this->createQuizWord($lesson, $lessonData['word']);
            }
        }
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