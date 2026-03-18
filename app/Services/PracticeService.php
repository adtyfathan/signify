<?php

namespace App\Services;

class PracticeService
{
    /**
     * Get all practice categories
     */
    public function getCategories(): array
    {
        return [
            [
                'id' => 1,
                'title' => 'Huruf A-Z',
                'description' => 'Pelajari dan praktik ejaan tangan untuk semua huruf',
                'icon' => '🔤',
                'difficulty' => 'Beginner',
                'estimated_time' => '10 menit',
                'color' => 'from-blue-400 to-blue-600',
                'xp_reward' => 50,
            ],
            [
                'id' => 2,
                'title' => 'Angka 0-10',
                'description' => 'Kuasai gerakan tangan untuk angka dasar',
                'icon' => '🔢',
                'difficulty' => 'Beginner',
                'estimated_time' => '5 menit',
                'color' => 'from-purple-400 to-purple-600',
                'xp_reward' => 50,
            ],
            [
                'id' => 3,
                'title' => 'Kata Sehari-hari',
                'description' => 'Praktik gerakan untuk kata-kata umum yang sering digunakan',
                'icon' => '💬',
                'difficulty' => 'Intermediate',
                'estimated_time' => '15 menit',
                'color' => 'from-green-400 to-green-600',
                'xp_reward' => 50,
            ],
            [
                'id' => 4,
                'title' => 'Percakapan Singkat',
                'description' => 'Praktik percakapan isyarat sederhana dengan AI',
                'icon' => '👥',
                'difficulty' => 'Intermediate',
                'estimated_time' => '20 menit',
                'color' => 'from-orange-400 to-orange-600',
                'xp_reward' => 50,
            ],
        ];
    }

    /**
     * Get category by ID
     */
    public function getCategoryById(int $id): ?array
    {
        $categories = $this->getCategories();
        
        foreach ($categories as $category) {
            if ($category['id'] === $id) {
                return $category;
            }
        }

        return null;
    }
}
