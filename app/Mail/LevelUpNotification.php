<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LevelUpNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $newLevel;
    public $totalXp;

    /**
     * Create a new message instance.
     */
    public function __construct($user, $newLevel, $totalXp)
    {
        $this->user = $user;
        $this->newLevel = $newLevel;
        $this->totalXp = $totalXp;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "🎉 Selamat! Anda naik ke Level {$this->newLevel}!",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.level-up',
            with: [
                'userName' => $this->user->name,
                'newLevel' => $this->newLevel,
                'totalXp' => $this->totalXp,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
