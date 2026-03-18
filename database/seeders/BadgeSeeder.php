<?php

namespace Database\Seeders;

use App\Models\Badge;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BadgeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $badges = [
            [
                'name' => 'Langkah Pertama',
                'slug' => 'langkah-pertama',
                'description' => 'Raih badge ini saat menyelesaikan pelajaran pertama',
                'icon_path' => 'images/badges/first-step.svg',
                'rarity' => 'common',
                'xp_bonus' => 0,
                'condition_type' => 'first_lesson',
                'condition_value' => null,
                'condition_score' => null,
            ],
            [
                'name' => 'Vokal Master',
                'slug' => 'vokal-master',
                'description' => 'Kuasai semua huruf vokal (A, E, I, O, U)',
                'icon_path' => 'images/badges/vowel-master.svg',
                'rarity' => 'common',
                'xp_bonus' => 50,
                'condition_type' => 'vowels_mastered',
                'condition_value' => null,
                'condition_score' => null,
            ],
            [
                'name' => 'Alfabet Lengkap',
                'slug' => 'alfabet-lengkap',
                'description' => 'Kuasai semua 26 huruf alfabet',
                'icon_path' => 'images/badges/alphabet-complete.svg',
                'rarity' => 'epic',
                'xp_bonus' => 200,
                'condition_type' => 'all_letters_mastered',
                'condition_value' => 26,
                'condition_score' => null,
            ],
            [
                'name' => 'Kata Pertama',
                'slug' => 'kata-pertama',
                'description' => 'Selesaikan kuis kata pertama',
                'icon_path' => 'images/badges/first-word.svg',
                'rarity' => 'common',
                'xp_bonus' => 0,
                'condition_type' => 'first_quiz_word',
                'condition_value' => null,
                'condition_score' => null,
            ],
            [
                'name' => 'Word Champion',
                'slug' => 'word-champion',
                'description' => 'Selesaikan 50 kuis kata dengan skor ≥90%',
                'icon_path' => 'images/badges/word-champion.svg',
                'rarity' => 'rare',
                'xp_bonus' => 150,
                'condition_type' => 'quiz_word_count_score',
                'condition_value' => 50,
                'condition_score' => 90,
            ],
            [
                'name' => 'Streak 7 Hari',
                'slug' => 'streak-7-hari',
                'description' => 'Pertahankan aktivitas harian selama 7 hari berturut-turut',
                'icon_path' => 'images/badges/streak-7.svg',
                'rarity' => 'rare',
                'xp_bonus' => 100,
                'condition_type' => 'streak_days',
                'condition_value' => 7,
                'condition_score' => null,
            ],
            [
                'name' => 'Streak 30 Hari',
                'slug' => 'streak-30-hari',
                'description' => 'Pertahankan aktivitas harian selama 30 hari berturut-turut',
                'icon_path' => 'images/badges/streak-30.svg',
                'rarity' => 'epic',
                'xp_bonus' => 300,
                'condition_type' => 'streak_days',
                'condition_value' => 30,
                'condition_score' => null,
            ],
            [
                'name' => 'Speed Demon',
                'slug' => 'speed-demon',
                'description' => 'Selesaikan kuis kata (≥5 huruf) dalam waktu <10 detik',
                'icon_path' => 'images/badges/speed-demon.svg',
                'rarity' => 'legendary',
                'xp_bonus' => 250,
                'condition_type' => 'quiz_speed',
                'condition_value' => 10,
                'condition_score' => null,
            ],
        ];

        foreach ($badges as $badge) {
            Badge::create($badge);
        }
    }
}
