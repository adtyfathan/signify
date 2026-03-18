<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sign extends Model
{
    use HasFactory;

    protected $fillable = [
        'letter',
        'is_vowel',
        'description',
        'video_path',
        'thumbnail_path',
        'guide_image_path',
        'order_index',
        'difficulty',
    ];

    protected $casts = [
        'is_vowel' => 'boolean',
    ];

    /**
     * Get the lessons for this sign.
     */
    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class);
    }

    /**
     * Get the user mastery records for this sign.
     */
    public function userMastery(): HasMany
    {
        return $this->hasMany(UserSignMastery::class);
    }
}
