<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FreePracticeLetter extends Model
{
    use HasFactory;

    protected $table = 'free_practice_letters';

    protected $fillable = [
        'session_id',
        'letter',
        'confidence',
        'detected_at_sec',
    ];

    protected $casts = [
        'confidence' => 'decimal:2',
        'detected_at_sec' => 'decimal:1'
    ];

    /**
     * Get the practice session that owns this letter record.
     */
    public function session(): BelongsTo
    {
        return $this->belongsTo(FreePracticeSession::class);
    }
}
