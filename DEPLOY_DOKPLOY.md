# Panduan Deployment Dokploy

Berikut adalah langkah-langkah untuk men-deploy aplikasi Next.js ini ke Dokploy.

## Prasyarat
- Server Dokploy yang sudah aktif.
- Project ini sudah di-push ke repository Git (GitHub/GitLab).

## Konfigurasi Dokploy

1.  **Buat Aplikasi Baru**:
    - Buka dashboard Dokploy.
    - Masuk ke project Anda.
    - Klik "Create Service" -> "Application".

2.  **Pengaturan Source**:
    - **Repository**: Pilih repository Git Anda.
    - **Branch**: Pilih branch utama (misal `main`).
    - **Build Type**: Pilih **"Dockerfile"**.
    - **Docker Context Path**: `/` (biarkan default).
    - **Dockerfile Path**: `./Dockerfile` (biarkan default).

3.  **Environment Variables**:
    - Masuk ke tab "Environment".
    - Salin isi dari `.env.local` (atau variable yang dibutuhkan) ke sini.
    - Contoh: `NEXT_PUBLIC_API_URL`, `DATABASE_URL`, dll.

4.  **Network / Ports**:
    - Pastikan port aplikasi mengarah ke port container **3000**.
    - Dokploy biasanya otomatis mendeteksi, tapi jika perlu manual, set internal port ke `3000`.

5.  **Deploy**:
    - Klik tombol **"Deploy"**.
    - Dokploy akan menjalankan proses build di dalam Docker (sesuai request) dan menjalankan aplikasi.

## Struktur Docker

Kami telah menyiapkan file-file berikut:
- **Dockerfile**: Menggunakan multi-stage build (deps -> builder -> runner) untuk image yang kecil dan efisien. Build dilakukan *di dalam* Docker.
- **.dockerignore**: Mencegah file tidak penting masuk ke image.
- **docker-compose.yml**: Untuk testing lokal (opsional).
- **next.config.mjs**: Diupdate dengan `output: 'standalone'` untuk optimasi Docker.

## Testing Lokal (Jika ada Docker Desktop)

```bash
docker compose up --build
```

Akses `http://localhost:3000`.
