# QA Layout Checklist

Checklist ini dipakai sebelum merge atau deploy untuk mencegah bug layout seperti konten menumpuk di kiri, double navbar, atau container tidak center.

## 1) Pemeriksaan Route dan Layout

- Pastikan route dashboard memakai layout khusus dashboard (tanpa Navbar/Footer global).
- Pastikan route publik memakai layout publik (Navbar/Footer global aktif).
- Pastikan tidak ada route dashboard yang ikut terbungkus layout publik.

## 2) Pemeriksaan Global CSS

- Pastikan tidak ada aturan global yang membatasi lebar root secara tidak sengaja.
- Verifikasi selector berikut aman:
  - body
  - html
  - #root
  - main
  - *
- Hindari memberi max-width pada #root jika halaman sudah mengatur container sendiri.

## 3) Pemeriksaan Halaman Dashboard

- Buka /dashboard dan pastikan hanya satu navbar yang tampil.
- Pastikan wrapper utama dashboard memakai container center, misalnya max-w-7xl mx-auto.
- Pastikan grid utama berubah responsif di breakpoint:
  - Mobile: 1 kolom
  - Tablet: 2 kolom (sesuai desain)
  - Desktop: 3 atau 4 kolom (sesuai desain)

## 4) Pemeriksaan Halaman Publik

- Buka /, /login, /register, /profile, /module/:id, /quiz/:moduleId.
- Pastikan Navbar/Footer global muncul normal di halaman publik.
- Pastikan tidak ada komponen dashboard yang menyisip ke halaman publik.

## 5) Uji Responsif Manual

- 360x800 (mobile kecil)
- 390x844 (mobile modern)
- 768x1024 (tablet)
- 1366x768 (laptop)
- 1920x1080 (desktop)

Setiap ukuran layar, cek:
- Horizontal scroll tidak muncul.
- Container tetap center.
- Jarak kiri-kanan konsisten.
- Sticky navbar tidak menutup konten utama.

## 6) Uji Build

- Jalankan npm run build.
- Pastikan build sukses tanpa error.
- Jika warning chunk besar muncul, evaluasi lazy loading route dan manualChunks.

## 7) Kriteria Lulus

- Tidak ada double navbar.
- Tidak ada konten yang terkunci di kiri.
- Dashboard dan halaman publik masing-masing mengikuti layout yang tepat.
- Build production sukses.
