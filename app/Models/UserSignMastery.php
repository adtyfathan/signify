<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserSignMastery extends Model
{
    use HasFactory;

    protected $table = 'user_sign_mastery';

    protected $fillable = [
        'user_id',
        'sign_id',
        'mastery_level',
        'total_correct',
        'total_attempts',
        'avg_confidence',
        'last_practiced_at',
    ];

    protected $casts = [
        'avg_confidence' => 'decimal:2',
        'last_practiced_at' => 'datetime',
    ];

    /**
     * Get the user that owns this mastery record.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the sign for this mastery record.
     */
    public function sign(): BelongsTo
    {
        return $this->belongsTo(Sign::class);
    }
}
