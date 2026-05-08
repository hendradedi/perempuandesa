# Perempuan Desa App

Platform pembelajaran perempuan desa berbasis React + Firebase + Vercel.

## Fitur Baru

- Panel Admin untuk melihat pengguna terdaftar.
- Admin utama dapat mengubah role pengguna (user/assistant_admin/admin).
- Asisten admin dapat melihat registrasi user dan membantu menambah modul.
- Admin utama dapat menonaktifkan atau mengaktifkan akun pengguna.
- Admin dapat menambahkan materi baru ke Firestore.
- Admin dan asisten admin dapat menambah modul manual.
- Tersedia asisten AI untuk menyusun draft modul, lalu admin menyetujui hasilnya.
- Admin utama dapat reset password user jika user lupa.
- Hasil kuis memiliki AI interaktif untuk penjelasan dan saran belajar.

## Menjalankan Proyek

1. Install dependency:

```bash
npm install
```

2. Jalankan mode development:

```bash
npm run dev
```

3. Build production:

```bash
npm run build
```

## Konfigurasi Environment

Gunakan file contoh [.env.example](.env.example) sebagai acuan.

Variable penting:

- VITE_ADMIN_EMAILS: daftar email admin, pisahkan dengan koma.
- VITE_ASSISTANT_ADMIN_EMAILS: daftar email asisten admin, pisahkan dengan koma.
- VITE_AI_ENDPOINT: endpoint AI untuk frontend, default /api/ai-quiz-explain.
- OPENROUTER_API_KEY: API key OpenRouter (rahasia, server-only).
- OPENROUTER_MODEL: model OpenRouter yang dipakai endpoint AI.
- OPENROUTER_SITE_URL: URL aplikasi untuk header OpenRouter.
- OPENROUTER_APP_NAME: nama aplikasi untuk header OpenRouter.
- SUPER_ADMIN_EMAILS: email admin utama untuk endpoint reset password.
- FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY: kredensial Firebase Admin SDK untuk endpoint reset password.

## API Key OpenRouter Harus Taruh Di Mana?

Taruh OPENROUTER_API_KEY hanya di server, bukan di frontend.

Untuk deploy Vercel:

1. Buka Project di Vercel.
2. Masuk ke Settings > Environment Variables.
3. Tambahkan key: OPENROUTER_API_KEY.
4. Isi value dengan API key OpenRouter Anda.
5. Redeploy aplikasi.

Tambahkan juga untuk fitur reset password user:

- SUPER_ADMIN_EMAILS
- FIREBASE_PROJECT_ID
- FIREBASE_CLIENT_EMAIL
- FIREBASE_PRIVATE_KEY (format private key service account, newline gunakan \\n)

Penting:

- Jangan gunakan variable dengan prefix VITE_ untuk API key rahasia.
- Jangan hardcode API key di file React (src).
- Endpoint server ada di [api/ai-quiz-explain.js](api/ai-quiz-explain.js) dan key dibaca via process.env.OPENROUTER_API_KEY.

## Catatan Akses Admin

- User dianggap admin jika role di Firestore adalah admin, atau email ada di VITE_ADMIN_EMAILS.
- User dianggap asisten admin jika role assistant_admin, atau email ada di VITE_ASSISTANT_ADMIN_EMAILS.
- Collection user: users
- Collection materi admin: materials
- Collection modul admin: modules

## Endpoint Admin & AI

- AI hasil kuis: [api/ai-quiz-explain.js](api/ai-quiz-explain.js)
- AI penyusun modul: [api/ai-generate-module.js](api/ai-generate-module.js)
- Reset password admin utama: [api/admin-reset-password.js](api/admin-reset-password.js)

## Catatan Firestore Rules

Agar aman di production, buat rule Firestore yang membatasi:

- Hanya admin yang boleh update role/active user lain.
- Hanya admin yang boleh create materi di collection materials.
- User biasa hanya boleh baca data publik yang diperlukan.

Contoh rules tersedia di [firestore.rules.example](firestore.rules.example).
