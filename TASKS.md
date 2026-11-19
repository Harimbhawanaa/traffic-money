# TASKS.md — Traffic Money

**Versi:** 1.0  
**Acuan:** `SPEC.md` v1.0 dan `UI-SPEC.md` v1.0  
**Target:** workshop 1 hari (±420 menit efektif)  
**Stack:** Vite + HTML + CSS + JavaScript vanilla + localStorage. **Tidak ada backend, login, database server, atau library grafik tambahan.**

## Cara menggunakan checklist

- `[ ]` belum dikerjakan; ubah menjadi `[x]` hanya setelah **semua** acceptance criteria tugas lulus secara manual.
- **P0** = wajib agar MVP berfungsi; **P1** = wajib menurut SPEC tetapi dapat dikerjakan setelah alur inti; **P2** = penyempurnaan bila waktu memungkinkan.
- Dependensi merujuk ID tugas; `—` berarti tidak ada. Estimasi termasuk pemeriksaan manual singkat.
- Struktur file yang disarankan: `index.html`, `src/main.js`, `src/data.js` (data contoh), `src/store.js` (state, validasi, localStorage), `src/ui.js` (render dan event UI), `src/style.css`, `.gitignore`, `package.json`. Boleh memecah modul jika diperlukan, tetapi hindari kompleksitas workshop.
- Seluruh nominal adalah **rupiah bulat positif**; saldo global = pemasukan − pengeluaran. Data contoh harus fiktif.

## Milestone 1 — Setup project (35 menit)

- [ ] **TM-01 — Inisialisasi Vite vanilla**  
  **Prioritas:** P0 · **Dependensi:** — · **Estimasi:** 15 menit  
  **Deskripsi:** Buat proyek pada folder saat ini, siapkan skrip `dev`/`build`, `.gitignore` untuk `node_modules`, `dist`, `.env`, dan struktur modul dasar.  
  **Acceptance criteria:** `npm run dev` menampilkan halaman awal tanpa error; `npm run build` berhasil; tidak ada framework frontend atau dependensi tambahan yang tidak diperlukan.

- [ ] **TM-02 — Siapkan desain dasar dan app shell**  
  **Prioritas:** P0 · **Dependensi:** TM-01 · **Estimasi:** 20 menit  
  **Deskripsi:** Pasang token warna dari UI-SPEC (putih, biru, soft purple), font sans-serif, spacing, area header/main, dan ruang aman untuk navigasi bawah.  
  **Acceptance criteria:** Pada 360px dan 1280px latar, tipografi, dan kontainer terbaca; tidak ada overflow horizontal; konten tidak tertutup area navigasi bawah.

## Milestone 2 — Layout dan navigasi (35 menit)

- [ ] **TM-03 — Bottom navigation empat halaman**  
  **Prioritas:** P0 · **Dependensi:** TM-02 · **Estimasi:** 20 menit  
  **Deskripsi:** Buat menu Overview, Records, Chart, Budgeting memakai ikon dan label aksesibel; navigasi tetap di bawah pada mobile maupun desktop.  
  **Acceptance criteria:** Keempat menu dapat dibuka tanpa reload; hanya satu yang aktif; status aktif terlihat; semua menu dapat dioperasikan lewat keyboard dan memiliki nama aksesibel.

- [ ] **TM-04 — Komponen UI bersama**  
  **Prioritas:** P0 · **Dependensi:** TM-03 · **Estimasi:** 15 menit  
  **Deskripsi:** Siapkan pola card, tombol, input, select, pesan error, empty state, dan dialog konfirmasi yang digunakan lintas halaman.  
  **Acceptance criteria:** Kontrol memiliki label/fokus terlihat, area klik nyaman (target 44×44px), dialog dapat ditutup, dan komponen tetap terbaca pada 360px.

## Milestone 3 — Overview dan fondasi data (65 menit)

- [ ] **TM-05 — State, data contoh, dan localStorage**  
  **Prioritas:** P0 · **Dependensi:** TM-01 · **Estimasi:** 30 menit  
  **Deskripsi:** Definisikan `Transaction`, `Category`, `Budget` sesuai SPEC; state berversi `traffic-money:v1`; seed fiktif hanya bila key belum ada; fungsi baca/simpan dan validasi bentuk state.  
  **Acceptance criteria:** Refresh mempertahankan state valid; state kosong tidak memunculkan seed lagi; JSON rusak/storage tidak tersedia menampilkan error dan tidak ditimpa diam-diam.

- [ ] **TM-06 — Ringkasan Overview**  
  **Prioritas:** P0 · **Dependensi:** TM-04, TM-05 · **Estimasi:** 20 menit  
  **Deskripsi:** Tampilkan saldo global, total pemasukan, dan total pengeluaran dalam card responsif, format IDR.  
  **Acceptance criteria:** Dengan pemasukan Rp1.000.000 dan pengeluaran Rp250.000 pada state uji kosong, saldo Rp750.000; angka tidak berubah ketika periode Chart diganti.

- [ ] **TM-07 — Transaksi terbaru dan empty state**  
  **Prioritas:** P0 · **Dependensi:** TM-06 · **Estimasi:** 15 menit  
  **Deskripsi:** Tampilkan maksimal lima transaksi terbaru dengan tanggal, kategori, tipe, nominal; tampilkan pesan saat kosong.  
  **Acceptance criteria:** Urutan berdasarkan tanggal terbaru (tie-break transaksi yang dibuat terakhir); maksimal lima item; tidak crash jika daftar kosong.

## Milestone 4 — Records dan kategori (115 menit)

- [ ] **TM-08 — Daftar Records**  
  **Prioritas:** P0 · **Dependensi:** TM-04, TM-05 · **Estimasi:** 15 menit  
  **Deskripsi:** Render semua transaksi, tipe, nominal, kategori, tanggal, catatan, serta tombol aksi edit/hapus.  
  **Acceptance criteria:** Data contoh tampil; urutan masuk akal dan konsisten; pada mobile tampil sebagai baris/card tanpa scroll horizontal halaman.

- [ ] **TM-09 — Tambah transaksi dan validasi**  
  **Prioritas:** P0 · **Dependensi:** TM-08 · **Estimasi:** 25 menit  
  **Deskripsi:** Form pemasukan/pengeluaran dengan nominal, kategori sesuai tipe, tanggal lokal `YYYY-MM-DD`, dan catatan opsional maksimal 200 karakter.  
  **Acceptance criteria:** Transaksi valid muncul di Records dan memperbarui Overview tanpa reload; nominal kosong/0/negatif/desimal ditolak; kategori dengan tipe salah ditolak; catatan terlalu panjang ditolak.

- [ ] **TM-10 — Edit dan hapus transaksi**  
  **Prioritas:** P0 · **Dependensi:** TM-09 · **Estimasi:** 20 menit  
  **Deskripsi:** Form edit dengan nilai awal dan aksi hapus dengan konfirmasi.  
  **Acceptance criteria:** Edit pengeluaran Rp250.000 menjadi Rp300.000 mengubah saldo uji menjadi Rp700.000; batal hapus tidak mengubah data; konfirmasi hapus mengembalikan saldo uji menjadi Rp1.000.000; hasil tersimpan setelah refresh.

- [ ] **TM-11 — CRUD kategori dan integritas relasi**  
  **Prioritas:** P0 · **Dependensi:** TM-09 · **Estimasi:** 30 menit  
  **Deskripsi:** Tambah, ubah nama, hapus kategori income/expense; validasi nama unik case-insensitive dalam tipe yang sama; larang ubah tipe jika telah dipakai; larang hapus jika dipakai transaksi atau anggaran.  
  **Acceptance criteria:** Kategori baru tersedia di form; perubahan nama tercermin di transaksi; nama duplikat ditolak; hapus kategori terpakai ditolak dengan pesan; kategori tanpa relasi bisa dihapus.

- [ ] **TM-12 — Filter dan pencarian Records**  
  **Prioritas:** P1 · **Dependensi:** TM-08 · **Estimasi:** 10 menit  
  **Deskripsi:** Tambahkan filter tipe/periode dan pencarian catatan atau nama kategori.  
  **Acceptance criteria:** Filter mengubah daftar sesuai kriteria, reset menampilkan seluruh transaksi, dan tidak mengubah saldo global maupun data tersimpan.

- [ ] **TM-13 — Kalkulator nominal sederhana**  
  **Prioritas:** P1 · **Dependensi:** TM-09 · **Estimasi:** 15 menit  
  **Deskripsi:** Kalkulator `+`, `−`, `×`, `÷` yang dapat memasukkan hasil ke form transaksi.  
  **Acceptance criteria:** `100000 + 25000` mengisi `125000`; pembagian nol ditolak; hasil negatif, pecahan, atau non-finite tidak dapat diterapkan sebagai nominal transaksi.

## Milestone 5 — Chart (45 menit)

- [ ] **TM-14 — Pilih periode dan hitung ringkasan**  
  **Prioritas:** P0 · **Dependensi:** TM-05, TM-09 · **Estimasi:** 20 menit  
  **Deskripsi:** Pilih bulan/tahun (default bulan berjalan), hitung pemasukan dan pengeluaran untuk periode terpilih.  
  **Acceptance criteria:** Transaksi di bulan berbeda tidak tercampur; pergantian periode memperbarui total Chart tanpa mengubah Overview global.

- [ ] **TM-15 — Grafik perbandingan dan distribusi kategori**  
  **Prioritas:** P0 · **Dependensi:** TM-14 · **Estimasi:** 25 menit  
  **Deskripsi:** Buat grafik sederhana dengan HTML/CSS atau SVG; tampilkan perbandingan income/expense dan total per kategori berdasarkan tipe/periode. Sertakan label angka dan legenda, tanpa library grafik.  
  **Acceptance criteria:** Nilai grafik sesuai penjumlahan transaksi periode; pilihan tipe mengubah kategori; periode tanpa transaksi menampilkan empty state; informasi tetap dapat dipahami tanpa mengandalkan warna.

## Milestone 6 — Budgeting (65 menit)

- [ ] **TM-16 — CRUD anggaran bulanan**  
  **Prioritas:** P0 · **Dependensi:** TM-11 · **Estimasi:** 35 menit  
  **Deskripsi:** Tambah, edit, hapus anggaran untuk kategori expense dan kombinasi bulan/tahun; konfirmasi hapus.  
  **Acceptance criteria:** Nominal harus rupiah bulat positif; kategori income tidak dapat dipilih; anggaran duplikat pada kategori/bulan/tahun sama ditolak; edit/hapus tersimpan setelah reload; batal hapus tidak mengubah data.

- [ ] **TM-17 — Progress, sisa, dan status anggaran**  
  **Prioritas:** P0 · **Dependensi:** TM-16, TM-10 · **Estimasi:** 30 menit  
  **Deskripsi:** Hitung pengeluaran aktual kategori per bulan/tahun, sisa, persentase, dan progress bar; tampilkan status aman/mendekati/melebihi.  
  **Acceptance criteria:** Budget Rp500.000 dengan pengeluaran Rp200.000 menghasilkan 40% dan sisa Rp300.000; total Rp600.000 menghasilkan 120%, sisa −Rp100.000, status melebihi, panjang bar maksimal 100%; edit/hapus transaksi langsung mengubah progress.

## Milestone 7 — Testing dan perbaikan (60 menit)

- [ ] **TM-18 — Uji alur end-to-end dan persistensi**  
  **Prioritas:** P0 · **Dependensi:** TM-07, TM-10, TM-11, TM-15, TM-17 · **Estimasi:** 25 menit  
  **Deskripsi:** Jalankan skenario tambah/edit/hapus transaksi, kategori, dan anggaran; cek sinkronisasi Overview–Records–Chart–Budgeting serta reload.  
  **Acceptance criteria:** Semua skenario utama SPEC AC-01–AC-04, AC-06–AC-08, AC-11–AC-15, AC-18, AC-20 lulus; tidak ada error JavaScript kritis.

- [ ] **TM-19 — Validasi, keamanan, dan aksesibilitas**  
  **Prioritas:** P0 · **Dependensi:** TM-18 · **Estimasi:** 20 menit  
  **Deskripsi:** Uji input tidak valid, catatan yang menyerupai HTML/script, fokus keyboard, label kontrol, error storage, dan state rusak.  
  **Acceptance criteria:** SPEC AC-05, AC-17, AC-19 lulus; teks `<script>alert(1)</script>` tidak dieksekusi; kontras teks/kontrol diperiksa terhadap target WCAG AA UI-SPEC; pesan error mudah ditemukan.

- [ ] **TM-20 — Responsivitas, kalkulator, dan build akhir**  
  **Prioritas:** P0 · **Dependensi:** TM-19, TM-13 · **Estimasi:** 15 menit  
  **Deskripsi:** Periksa empat halaman pada 360px dan 1280px, interaksi kalkulator, navigasi bawah, serta build produksi.  
  **Acceptance criteria:** SPEC AC-09, AC-10, AC-16 lulus; tidak ada overflow horizontal; navigasi tidak menutupi konten; `npm run build` berhasil.

## Rekap waktu dan prioritas

| Milestone | Durasi |
|---|---:|
| 1. Setup project | 35 menit |
| 2. Layout dan navigasi | 35 menit |
| 3. Overview + fondasi data | 65 menit |
| 4. Records + kategori | 115 menit |
| 5. Chart | 45 menit |
| 6. Budgeting | 65 menit |
| 7. Testing + perbaikan | 60 menit |
| **Total** | **420 menit (7 jam efektif)** |

**Jika waktu mepet:** selesaikan P0 terlebih dahulu. TM-12 (filter/pencarian) dan TM-13 (kalkulator) dapat digeser ke sesi tambahan; bila TM-13 tertunda, sesuaikan dependensi pemeriksaan TM-20 dan tandai AC-09/AC-10 sebagai **belum lulus**, bukan selesai. Alokasikan waktu pengujian minimal untuk fitur yang sudah jadi. Walaupun P1 dapat ditunda demi workshop, seluruh fitur yang dinyatakan *Must* dalam SPEC tetap wajib diselesaikan sebelum MVP dinyatakan tuntas.

## Definition of Done

- [ ] Semua tugas **P0** selesai dan acceptance criteria-nya lulus.
- [ ] Semua kebutuhan **Must** di SPEC terpenuhi, termasuk kalkulator (TM-13), meskipun dikerjakan setelah alur inti.
- [ ] Empat halaman responsif, bisa dinavigasi dengan keyboard, dan tidak memiliki error JavaScript kritis.
- [ ] Data valid bertahan setelah refresh; data rusak atau gagal disimpan tidak diam-diam ditimpa.
- [ ] `npm run build` berhasil.

**Catatan:** Dokumen ini hanya rencana kerja/checklist. Belum mengimplementasikan kode aplikasi.
