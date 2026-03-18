<?php

namespace Database\Seeders;

use App\Models\Sign;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SignSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $vowels = ['A', 'E', 'I', 'O', 'U'];
        $alphabet = range('A', 'Z');
        $difficulty = ['easy', 'easy', 'medium', 'medium', 'hard']; // 5 huruf dengan difficulty berbeda

        foreach ($alphabet as $index => $letter) {
            $difficultyIndex = $index % 5;
            $isVowel = in_array($letter, $vowels);

            Sign::create([
                'letter' => $letter,
                'is_vowel' => $isVowel,
                'description' => "Isyarat untuk huruf {$letter} dalam Bahasa Isyarat Indonesia (BISINDO)",
                'video_path' => "videos/signs/{$letter}.mp4",
                'thumbnail_path' => "images/signs/{$letter}_thumb.jpg",
                'guide_image_path' => "images/signs/{$letter}_guide.jpg",
                'order_index' => $index + 1,
                'difficulty' => $difficulty[$difficultyIndex],
            ]);
        }
    }
}
