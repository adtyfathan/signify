<?php

namespace Database\Seeders;

use App\Models\Level;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Level::create([
            'name' => 'Pemula',
            'slug' => 'pemula',
            'description' => 'Level dasar untuk pemula yang baru belajar Bahasa Isyarat',
            'order_index' => 1,
            'color_hex' => '#10B981',
        ]);

        Level::create([
            'name' => 'Menengah',
            'slug' => 'menengah',
            'description' => 'Level menengah untuk pengguna yang sudah terbiasa',
            'order_index' => 2,
            'color_hex' => '#3B82F6',
        ]);

        Level::create([
            'name' => 'Mahir',
            'slug' => 'mahir',
            'description' => 'Level mahir untuk pengguna yang sudah menguasai Bahasa Isyarat',
            'order_index' => 3,
            'color_hex' => '#8B5CF6',
        ]);
    }
}
