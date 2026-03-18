<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Level extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'order_index',
        'color_hex',
    ];

    /**
     * Get the modules for this level.
     */
    public function modules(): HasMany
    {
        return $this->hasMany(Module::class);
    }

    /**
     * Get the match sessions for this level.
     */
    public function matchSessions(): HasMany
    {
        return $this->hasMany(MatchSession::class);
    }
}
