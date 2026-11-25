# UTS Pem Web — Aplikasi Biodata Team

Aplikasi web fullstack untuk mengelola data biodata anggota tim menggunakan **HTML + Bootstrap 5 + JavaScript Fetch API** di sisi frontend dan **Node.js + Express** di sisi backend.

## Anggota Tim

| Nama | NIM | Peran |
| --- | --- | --- |
| **Dimas Rizky Pandi Aprilio** | `24010110175` | Front-end |
| **Nadia Elastriani** | `24010110160` | Back-end |

## Fitur Utama

- **Tampilan Grid 3 Kolom (Bootstrap 5)**:
  - Card pertama berupa tombol **`+`** hijau besar untuk **Tambah Biodata**.
  - Card anggota menampilkan foto (`aspect-ratio: 4/3`, `object-fit: cover`, `object-position: center`), badge avatar inisial (`DR` / `NE`), tema warna card (`biru` / `hijau`), nama, NIM, deskripsi tugas, serta tombol **Edit** dan **Hapus**.
- **CRUD Lengkap via Modal & Fetch API**:
  - **Tambah & Edit Biodata** melalui modal form (`Nama`, `NIM`, `Deskripsi`, dan `Foto` via path/URL atau unggah file gambar lokal dengan preview).
  - **Hapus Biodata** dengan konfirmasi sebelum menghapus data.
  - **Alert Hijau Notifikasi**: menampilkan pesan `"Biodata berhasil diperbarui."` dengan tombol tutup `X` setelah menyimpan data.
- **Penyimpanan Persisten**: data disimpan di file JSON lokal (`backend/data/biodata.json`) sehingga perubahan tetap terjaga saat halaman di-refresh (`F5`) maupun saat server dijalankan ulang.

## Struktur Folder & File

```text
uts-pem-web/
├── README.md                    # Dokumentasi proyek
├── backend/                     # Server API (Node.js + Express)
│   ├── data/
│   │   └── biodata.json         # Penyimpanan data biodata persisten (JSON)
│   ├── node_modules/            # Dependensi hasil npm install
│   ├── package.json             # Konfigurasi proyek & dependensi backend
│   ├── package-lock.json        # Lockfile versi dependensi backend
│   └── server.js                # Entry point Express & route CRUD /api/biodata
└── frontend/                    # Antarmuka web (HTML + Bootstrap + Fetch API)
    ├── assets/
    │   ├── anggota.jpg          # Foto lokal anggota (Nadia Elastriani)
    │   └── dimas.jpg            # Foto lokal master (Dimas Rizky Pandi Aprilio)
    ├── app.js                   # Logika CRUD Fetch API, modal form, dan alert
    ├── index.html               # Halaman utama (Header, Alert, Grid 3 Card, Modal, Footer)
    └── style.css                # Styling tambahan (aspect-ratio 4/3, tema card biru & hijau)
```

### Struktur Data Biodata (`biodata.json`)

Setiap item biodata yang disimpan dan dikirim oleh API memiliki struktur objek JSON berikut:

```json
{
  "id": 1,
  "nama": "Dimas Rizky Pandi Aprilio",
  "nim": "24010110175",
  "deskripsi": "merupakan master dari uts ini dengan tugas membuat front-end dan mengirimkannya ke grup",
  "foto": "frontend/assets/dimas.jpg",
  "avatar": "DR",
  "warna": "biru"
}
```

## Teknologi yang Digunakan

- **Frontend**: HTML5, CSS3, Bootstrap 5.3.3 (CDN), JavaScript (Fetch API)
- **Backend**: Node.js, Express (`^4.21.2`), CORS (`^2.8.5`)

## Endpoint API Backend

Base URL: `http://localhost:3000`

| Method | Endpoint | Deskripsi |
| --- | --- | --- |
| `GET` | `/api/biodata` | Mengambil seluruh daftar biodata |
| `POST` | `/api/biodata` | Menambahkan biodata baru (`nama`, `nim`, `deskripsi`, `foto`) |
| `PUT` | `/api/biodata/:id` | Memperbarui biodata berdasarkan `id` |
| `DELETE` | `/api/biodata/:id` | Menghapus biodata berdasarkan `id` |

## Cara Menjalankan Proyek

### 1. Jalankan Backend

Masuk ke folder `backend/`, instal dependensi, lalu jalankan server Express:

```bash
cd backend
npm install
npm start
```

Backend akan berjalan di `http://localhost:3000`.

### 2. Jalankan Frontend

Buka folder `frontend/` menggunakan static server (misalnya ekstensi **Live Server** di VS Code, `npx serve frontend -l 8080`, atau `python -m http.server 8080 --directory frontend`), lalu akses di browser:

```text
http://localhost:8080
```

> Pastikan server backend (`http://localhost:3000`) dalam keadaan aktif agar frontend dapat memuat dan menyimpan data melalui Fetch API.

---

© 2025 Dibuat Sejujurnya Oleh Team Dimas Rizky Pandi Aprilio dan Nadia Elastriani Tanpa Mencontek dari Tim Lain

