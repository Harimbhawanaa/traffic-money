# Traffic Money — Laporan Unit Testing Vitest

Tanggal: 19 November 2026

## Perubahan
- Menambahkan `vitest` versi `^3.2.4` sebagai dev dependency pada `package.json` dan skrip `npm test` (`vitest run`).
- Membuat `tests/finance.vitest.test.js` berisi 21 skenario untuk filter, validasi, saldo, anggaran, dan localStorage.
- Memisahkan filter Records menjadi fungsi murni `filterTransactions` dalam `src/filters.js`, lalu menggunakan fungsi yang sama pada `src/ui.js`. Tidak mengubah desain.
- Mempertahankan lima pengujian Node bawaan dari tahap sebelumnya.

## Hasil yang benar-benar dijalankan
| Perintah | Hasil |
|---|---|
| `node --check src/ui.js` dan `node --check src/filters.js` | Lulus (exit 0) |
| `node --test tests/store.test.js` | 5 lulus, 0 gagal |
| `npm install --no-audit --no-fund --fetch-retries=0 --fetch-timeout=6000` | Gagal: `EAI_AGAIN` mengakses registry.npmjs.org |
| `npm test` | Gagal menjalankan runner (exit 127): `sh: 1: vitest: not found` |

**Penting:** 21 test Vitest telah ditulis, tetapi **belum dieksekusi** karena dependensi belum dapat diunduh. Tidak ada hasil lulus/gagal untuk 21 test tersebut. Kegagalan `npm test` merupakan masalah instalasi runner, bukan bukti test assertion gagal.

## Pengujian yang disiapkan
- Filter: data kosong, tipe, periode, pencarian kategori tanpa kapital, urutan tanggal.
- Transaksi: nominal nol, negatif, kategori tidak ada, tipe kategori tidak sesuai, tanggal invalid, transaksi valid.
- Saldo: pemasukan minus pengeluaran, tambah/edit transaksi, data kosong.
- Anggaran: terlampaui, filter periode/kategori.
- localStorage: inisialisasi, round-trip simpan/muat, JSON rusak, struktur tidak valid, nominal rusak dan data asli tidak tertimpa.

## Pengujian lanjutan
Di lingkungan yang dapat mengakses npm registry, jalankan `npm install`, `npm test`, dan `npm run build`. Uji browser tetap diperlukan untuk CRUD, modal, grafik, dan responsivitas.
