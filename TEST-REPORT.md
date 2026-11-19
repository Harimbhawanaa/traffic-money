# Traffic Money — Laporan Testing Tahap 7

Tanggal: 19 November 2026

## Lingkup dan hasil

| Area | Pemeriksaan | Hasil |
|---|---|---|
| Overview | Saldo = pemasukan − pengeluaran dengan data contoh | LULUS (unit) |
| Records | Validasi tipe, nominal positif, kategori sesuai tipe, tanggal kalender | LULUS (unit) |
| Categories | Deteksi kategori duplikat | LULUS (unit) |
| Chart | Audit logika filter periode, agregasi, persentase kategori | DITINJAU KODE; perlu browser |
| Budgeting | Perhitungan terpakai, sisa, dan status melebihi batas | LULUS (unit) |
| localStorage | Data awal, save/load, JSON.parse try/catch, data tidak valid tidak ditimpa | LULUS (unit) |
| CRUD semua entitas | Alur event/form/konfirmasi pada kode | DITINJAU KODE; perlu browser |
| XSS | Konten pengguna dipasang melalui textContent dan atribut DOM, bukan HTML dinamis | DITINJAU KODE; perlu browser |
| Kalkulator | Penolakan operand kosong, nol pembagi, hasil tidak valid | DIPERBAIKI; perlu browser |
| Filter Records | Pemisahan input pencarian dan perubahan bulan | DIPERBAIKI; perlu browser |
| Empty state | Render daftar kosong pada Records/Chart/Budgeting/Overview | DITINJAU KODE; perlu browser |
| Responsivitas | CSS mobile-first dan bottom navigation | DITINJAU KODE; perlu viewport 360/1280px |
| Build | `npm run build` | TERHALANG: `vite: not found` |

## Bug dan perbaikan

1. **Data localStorage dengan isi array tidak valid sebelumnya diterima.** `isStateShapeValid` kini memvalidasi entri, tipe, jumlah, tanggal, ID unik, referensi kategori, dan duplikasi anggaran. Data rusak **tidak dihapus atau ditimpa**; aplikasi menampilkan error dan tidak melakukan mutasi. Pemulihan otomatis parsial tidak dilakukan untuk menghindari kehilangan data.
2. **Kalkulator menganggap operand kosong sebagai nol.** Operand kosong kini menghasilkan pesan kesalahan; nominal transaksi hanya diisi jika hasil bilangan bulat positif yang aman.
3. **Filter periode bertipe month berpotensi melempar `InvalidStateError`** ketika kode mencoba membaca/mengatur posisi kursor. Re-render pada input dibatasi ke pencarian; filter bulan diproses pada event change.
4. **Commit dapat melempar kesalahan sebelum blok try/catch.** Proses clone dan mutasi kini berada di dalam blok try/catch, sehingga gagal simpan tidak mengubah state aplikasi.

## Pengujian yang dijalankan

- `node --check src/main.js`, `node --check src/store.js`, `node --check src/ui.js`: lulus.
- `node --test tests/store.test.js`: **5 lulus, 0 gagal**.
- `npm install --no-audit --no-fund`: timeout (ketergantungan belum terpasang).
- `npm run build`: gagal karena executable `vite` tidak ditemukan. **Tidak dapat menyatakan build berhasil.**

## Pengujian manual yang masih diperlukan

1. Jalankan `npm install`, `npm run dev`, dan `npm run build` di lingkungan dengan akses npm.
2. Pada browser, tambah/edit/hapus transaksi; cek konfirmasi, perubahan Overview dan Chart, serta reload.
3. Tambah/edit/hapus kategori, termasuk kategori yang sedang digunakan transaksi atau anggaran.
4. Tambah/edit/hapus anggaran; ubah transaksi pada periode sama; cek progress 40%, 100%, dan >100%.
5. Uji nominal 0, negatif, pecahan, tanggal invalid, kategori salah, nama duplikat, dan pembagian nol.
6. Uji input `<script>alert(1)</script>` pada nama kategori dan catatan; pastikan tampil sebagai teks.
7. Uji filter pencarian, tipe, bulan/tahun, serta empty state setiap halaman.
8. Uji keyboard, focus ring, label, kontras WCAG AA, viewport 360px dan 1280px, overflow dan posisi navigasi bawah.
9. Simulasikan localStorage terblokir/penuh dan JSON rusak; pastikan pesan muncul serta data asli tetap ada.

## Keputusan checklist

TM-18, TM-19, dan TM-20 tetap belum dicentang karena acceptance criteria mensyaratkan verifikasi browser dan build yang belum tersedia. Tidak ada klaim bahwa seluruh MVP sudah lolos pengujian akhir.
