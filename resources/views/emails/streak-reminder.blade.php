<x-mail::message>
# ⏰ Jangan Lupakan Streakmu!

Hai {{ $userName }},

Kami perhatikan Anda belum belajar hari ini. Streakmu saat ini adalah **{{ $currentStreak }} hari** — jangan biarkan putus!

Mari kembali ke aplikasi dan lanjutkan belajar. Setiap hari yang Anda belajar, streakmu akan terus meningkat!

<x-mail::button :url="$dashboardUrl">
Mulai Belajar Sekarang
</x-mail::button>

Terima kasih telah belajar bersama TunaWicara!<br>
{{ config('app.name') }}
</x-mail::message>
