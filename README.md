# SIGNIFY

## Institusi
Universitas Jenderal Soedirman

## Anggota Tim
- Ketua: Aditya Fathan Naufaldi
- Anggota 1: Feidinata Artandi

## Demo Aplikasi
https://github.com/user-attachments/assets/473d8f0f-f069-4bea-84bc-33c3da476081

## Deskripsi Karya
Signify adalah website edukasi bahasa isyarat yang dirancang untuk memudahkan masyarakat dalam mempelajari dan mempraktikkan bahasa isyarat secara mandiri dan menyenangkan. Website ini hadir sebagai solusi inklusif yang menjembatani komunikasi antara penyandang tunarungu dengan masyarakat umum.

Signify menyediakan berbagai fitur unggulan, antara lain:
- **Modul Belajar** — Materi pembelajaran bahasa isyarat yang terstruktur, mencakup teori dan sesi praktik interaktif menggunakan deteksi gerakan tangan secara real-time.
- **Latihan Bebas** — Fitur latihan mandiri di mana pengguna dapat memperagakan bahasa isyarat secara bebas dan mendapatkan umpan balik langsung.
- **Peringkat Poin** — Sistem leaderboard yang menampilkan peringkat pengguna berdasarkan poin yang dikumpulkan, mendorong semangat belajar secara kompetitif.
- **Badges Pencapaian** — Penghargaan digital yang diberikan kepada pengguna atas pencapaian tertentu dalam perjalanan belajar mereka.
- **Autentikasi** — Sistem registrasi dan login yang aman untuk melindungi data pengguna.
- **Profil Pengguna** — Halaman profil yang menampilkan statistik belajar, poin, dan badges yang telah diraih.

Subtema yang diangkat adalah **Pendidikan Inklusif dan Teknologi Aksesibilitas**, dengan tujuan menciptakan ekosistem belajar yang ramah bagi semua kalangan, khususnya para penyandang disabilitas sensorik.

## Link Website
https://signifyweb.my.id/

## Akun Untuk Demo
email : superuser@gmail.com
password : user1234

## Langkah Instalasi

### Prasyarat
- PHP >= 8.2
- Composer
- Node.js & NPM
- Python >= 3.10
- Git

---

### 1. Instalasi Aplikasi Laravel (Backend & Frontend)

```bash
# 1. Clone repositori
git clone https://github.com/username/signify.git
cd signify

# 2. Install dependensi PHP
composer install

# 3. Install dependensi Node.js
npm install

# 4. Salin file environment dan generate key
cp .env.example .env
php artisan key:generate

# 5. Konfigurasi database pada file .env, lalu jalankan migrasi
php artisan migrate --seed

# 6. Build aset frontend
npm run build

# 7. Jalankan server Laravel
php artisan serve
```

---

### 2. Instalasi Layanan Python (Model Deteksi Bahasa Isyarat)

```bash
# 1. Masuk ke direktori python
cd python

# 2. Buat virtual environment
python -m venv venv

# 3. Aktifkan virtual environment
source venv/bin/activate
# Windows: venv\Scripts\activate

# 4. Install dependensi Python
pip install -r requirements.txt

# 5. Jalankan server FastAPI
uvicorn main:app --host 127.0.0.1 --port 8001
```

> Pastikan layanan Python berjalan sebelum menggunakan fitur deteksi bahasa isyarat pada website.
