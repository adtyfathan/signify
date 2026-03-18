<x-mail::message>
# 🎉 Selamat Naik Level!

{{ $userName }}, Anda telah mencapai **Level {{ $newLevel }}**! 

Anda telah mengumpulkan total **{{ $totalXp }} XP**. Terus tingkatkan kemampuan Anda dalam belajar Bahasa Isyarat Indonesia!

<x-mail::button :url="route('dashboard')">
Lihat Progress Saya
</x-mail::button>

Terima kasih telah belajar bersama TunaWicara!<br>
{{ config('app.name') }}
</x-mail::message>
