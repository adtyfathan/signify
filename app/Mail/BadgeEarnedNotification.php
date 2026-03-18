<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BadgeEarnedNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $badge;

    /**
     * Create a new message instance.
     */
    public function __construct($user, $badge)
    {
        $this->user = $user;
        $this->badge = $badge;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "🏆 Anda mendapatkan Badge: {$this->badge->name}!",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.badge-earned',
            with: [
                'userName' => $this->user->name,
                'badgeName' => $this->badge->name,
                'badgeDescription' => $this->badge->description,
                'xpBonus' => $this->badge->xp_bonus,
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
