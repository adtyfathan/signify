<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class StreakReminderNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $currentStreak;

    /**
     * Create a new message instance.
     */
    public function __construct($user, $currentStreak)
    {
        $this->user = $user;
        $this->currentStreak = $currentStreak;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "⏰ Jangan lupakan streakmu! Sekarang {$this->currentStreak} hari.",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.streak-reminder',
            with: [
                'userName' => $this->user->name,
                'currentStreak' => $this->currentStreak,
                'dashboardUrl' => route('dashboard'),
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
