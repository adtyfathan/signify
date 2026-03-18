<x-mail::message>
# 🏆 Anda Mendapatkan Badge Baru!

{{ $userName }}, selamat! Anda berhasil mendapatkan badge:

## {{ $badgeName }}

{{ $badgeDescription }}

**Bonus XP:** +{{ $xpBonus }} XP

Lihat koleksi badge Anda dan bagikan pencapaian Anda!

<x-mail::button :url="route('badges.user')">
Lihat Badge Saya
</x-mail::button>

Terima kasih telah belajar bersama TunaWicara!<br>
{{ config('app.name') }}
</x-mail::message>
