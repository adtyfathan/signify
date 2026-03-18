<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Module extends Model
{
    use HasFactory;

    protected $fillable = [
        'level_id',
        'name',
        'slug',
        'description',
        'type',
        'order_index',
        'thumbnail_path',
        'xp_reward',
        'is_published',
    ];

    protected $casts = [
        'is_published' => 'boolean',
    ];

    /**
     * Get the level that owns this module.
     */
    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class);
    }

    /**
     * Get the lessons for this module.
     */
    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class);
    }
}
