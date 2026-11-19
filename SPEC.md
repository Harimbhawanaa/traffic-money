# SPEC.md — Traffic Money

**Versi:** 1.0  
**Status:** Spesifikasi MVP  
**Target:** Workshop pengembangan web 1 hari  
**Stack:** Vite, vanilla JavaScript, HTML, CSS, localStorage

## 1. Tujuan
Traffic Money adalah aplikasi manajemen keuangan pribadi berbasis web untuk mencatat pemasukan dan pengeluaran, memantau saldo, melihat pola transaksi, serta merencanakan anggaran bulanan. MVP dibuat sebagai latihan workshop satu hari dengan fokus pada DOM, state sederhana, CRUD, perhitungan, visualisasi, dan penyimpanan lokal tanpa backend.

**Indikator keberhasilan:** peserta dapat menjalankan aplikasi, mengelola transaksi/kategori/anggaran, melihat ringkasan dan grafik yang konsisten, serta memverifikasi persistensi data setelah reload.

## 2. Pengguna dan Asumsi
- **Pengguna utama:** individu yang mengelola keuangan pribadi pada satu perangkat dan satu browser tanpa akun.
- **Lingkungan:** browser modern pada desktop atau ponsel; JavaScript dan localStorage aktif.
- **Asumsi:** satu pengguna per profil browser, satu mata uang (IDR), tanggal berdasarkan waktu lokal perangkat, tanpa sinkronisasi lintas perangkat.
- **Data awal:** data contoh fiktif/nonpribadi untuk demonstrasi; tidak otomatis menggantikan data pengguna yang sudah ada.

## 3. Fitur MVP

### 3.1 Overview
- Menampilkan **saldo = total pemasukan − total pengeluaran** dari seluruh transaksi.
- Menampilkan total pemasukan dan pengeluaran keseluruhan.
- Menampilkan transaksi terbaru, diurutkan berdasarkan tanggal terbaru (jika sama, transaksi yang dibuat terakhir ditampilkan lebih dahulu).
- Menampilkan kondisi kosong jika belum ada transaksi.

### 3.2 Records
- Membuat, membaca, mengubah, dan menghapus transaksi pemasukan/pengeluaran.
- Setiap transaksi memiliki nominal, kategori yang sesuai tipe, tanggal, dan catatan opsional.
- Menampilkan daftar transaksi dengan pencarian catatan/kategori serta filter tipe dan periode sederhana.
- Membuat, mengubah, dan menghapus kategori; kategori memiliki nama dan tipe pemasukan/pengeluaran.
- Menyediakan kalkulator sederhana untuk operasi tambah, kurang, kali, bagi, dan mengisi nominal transaksi dari hasil perhitungan.

### 3.3 Chart
- Menampilkan perbandingan total pemasukan dan pengeluaran untuk periode yang dipilih.
- Menampilkan distribusi nominal transaksi per kategori untuk tipe dan periode terpilih.
- Mendukung periode **bulan dan tahun**; default bulan berjalan.
- Grafik dapat dibuat menggunakan HTML/CSS/JavaScript atau SVG sederhana tanpa library tambahan.

### 3.4 Budgeting
- Membuat, membaca, mengubah, dan menghapus anggaran bulanan per kategori pengeluaran.
- Menampilkan total pengeluaran kategori pada bulan/tahun anggaran.
- Menampilkan sisa anggaran dan progress bar: `spent / budget × 100%`.
- Menampilkan status ketika pengeluaran melampaui anggaran; persentase angka boleh lebih dari 100%, tetapi panjang progress bar maksimum 100%.

## 4. Model Data

### 4.1 Transaction
| Field | Tipe | Aturan |
|---|---|---|
| `id` | string | Unik, dibuat aplikasi |
| `type` | string | `income` atau `expense` |
| `amount` | number | Finite, lebih dari 0, satuan rupiah bulat |
| `categoryId` | string | Merujuk kategori aktif dengan tipe sama |
| `date` | string | Format `YYYY-MM-DD`, tanggal valid |
| `note` | string | Opsional, maksimum 200 karakter |

### 4.2 Category
| Field | Tipe | Aturan |
|---|---|---|
| `id` | string | Unik |
| `name` | string | Wajib, 1–40 karakter setelah trim |
| `type` | string | `income` atau `expense` |

Nama kategori harus unik secara case-insensitive **di dalam tipe yang sama**. Tipe kategori yang sudah digunakan transaksi tidak dapat diubah.

### 4.3 Budget
| Field | Tipe | Aturan |
|---|---|---|
| `id` | string | Unik |
| `categoryId` | string | Merujuk kategori `expense` |
| `amount` | number | Finite, lebih dari 0, rupiah bulat |
| `month` | number | Bilangan bulat 1–12 |
| `year` | number | Tahun empat digit, 2000–2100 |

Satu kategori hanya boleh memiliki satu anggaran untuk kombinasi bulan dan tahun yang sama.

### 4.4 Relasi dan Persistensi
- Satu kategori dapat digunakan banyak transaksi dan banyak anggaran pada periode berbeda.
- Data disimpan sebagai JSON di localStorage menggunakan key berversi, misalnya `traffic-money:v1`.
- Bentuk state: `{ version: 1, transactions: [], categories: [], budgets: [] }`.
- Data contoh diinisialisasi hanya ketika key aplikasi belum ada; state kosong yang valid tidak diisi ulang.
- Penghapusan kategori yang sedang digunakan transaksi atau anggaran **ditolak** dengan pesan yang jelas. Pengguna harus memindahkan/menghapus data terkait terlebih dahulu.
- Perubahan nama kategori langsung tercermin pada semua tampilan melalui relasi `categoryId`.

## 5. Functional Requirements
| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-01 | Aplikasi menampilkan empat menu: Overview, Records, Chart, Budgeting | Must |
| FR-02 | Navigasi bawah menggunakan ikon dengan label aksesibel dan status aktif | Must |
| FR-03 | Overview menghitung saldo, pemasukan, pengeluaran dari transaksi | Must |
| FR-04 | Overview menampilkan maksimal lima transaksi terbaru | Must |
| FR-05 | Pengguna dapat CRUD transaksi dengan validasi | Must |
| FR-06 | Pengguna dapat mencari dan memfilter transaksi | Should |
| FR-07 | Pengguna dapat CRUD kategori dan tidak dapat menghapus kategori yang masih dipakai | Must |
| FR-08 | Kalkulator dapat menghitung `+`, `−`, `×`, `÷` dan menerapkan hasil positif ke nominal | Must |
| FR-09 | Chart menampilkan ringkasan dan nilai per kategori sesuai periode | Must |
| FR-10 | Pengguna dapat CRUD anggaran bulanan per kategori pengeluaran | Must |
| FR-11 | Budgeting menghitung pengeluaran aktual, sisa, dan persentase pemakaian | Must |
| FR-12 | Data bertahan setelah reload melalui localStorage | Must |
| FR-13 | Aplikasi menangani data kosong dan error penyimpanan tanpa crash | Must |
| FR-14 | Data contoh fiktif tersedia pada kunjungan pertama | Should |

## 6. Aturan Bisnis dan Perhitungan
1. **Saldo global** = jumlah semua transaksi `income` − jumlah semua transaksi `expense`; tidak dibatasi filter Chart.
2. **Total periode** = jumlah nominal transaksi yang tanggalnya berada pada bulan/tahun terpilih dan sesuai tipe.
3. **Pengeluaran kategori** = jumlah transaksi `expense` dengan `categoryId` sama pada bulan/tahun anggaran.
4. **Sisa anggaran** = `budget.amount − spent`; hasil negatif menandakan melebihi anggaran.
5. **Persentase pemakaian** = `(spent / budget.amount) × 100`, ditampilkan dengan pembulatan yang konsisten (misalnya satu angka desimal).
6. Input nominal hanya menerima rupiah bulat positif; nol, negatif, desimal, `NaN`, dan `Infinity` ditolak.
7. Kalkulator menolak pembagian dengan nol dan hasil yang bukan angka finite; hasil yang akan dimasukkan ke transaksi harus berupa rupiah bulat positif.
8. Jika kategori tidak sesuai tipe transaksi, simpan ditolak.
9. Penghapusan transaksi dan anggaran meminta konfirmasi agar tidak terhapus tanpa sengaja.
10. Setelah CRUD, seluruh tampilan terkait diperbarui tanpa reload manual.

## 7. Nonfunctional Requirements
| ID | Kebutuhan | Ukuran pemeriksaan |
|---|---|---|
| NFR-01 | Teknologi sederhana | Hanya Vite + HTML/CSS/JS vanilla, tanpa backend/database server/login |
| NFR-02 | Responsif | Tidak ada horizontal overflow pada lebar 360px dan desktop 1280px |
| NFR-03 | Konsistensi visual | Warna utama putih, biru, soft purple; navigasi bawah konsisten |
| NFR-04 | Aksesibilitas dasar | Tombol ikon memiliki label; form memiliki label; fokus keyboard terlihat |
| NFR-05 | Persistensi lokal | Data valid tetap ada setelah refresh dan browser dibuka kembali pada profil yang sama |
| NFR-06 | Keamanan frontend | Teks pengguna ditampilkan sebagai teks, bukan HTML yang dieksekusi; tanpa API key |
| NFR-07 | Validasi | Semua input diperiksa sebelum mutasi state dan penyimpanan |
| NFR-08 | Penanganan kegagalan | JSON rusak/storage tidak tersedia memunculkan pesan dan tidak menimpa data secara diam-diam |
| NFR-09 | Keterbacaan kode | Modul terpisah untuk data, storage, UI, dan entry point |
| NFR-10 | Kinerja dasar | Dengan 100 transaksi contoh, interaksi utama terasa responsif pada browser modern |

## 8. Struktur Implementasi yang Direncanakan
```text
traffic-money/
├── index.html
├── package.json
├── .gitignore
├── SPEC.md
├── UI-SPEC.md             # disusun pada tahap berikutnya
├── TASKS.md               # disusun pada tahap berikutnya
└── src/
    ├── main.js           # bootstrap, event wiring
    ├── products.js       # data contoh dan definisi data (nama dapat diganti ke data.js)
    ├── store.js          # state, CRUD, validasi, localStorage
    ├── ui.js             # render menu, form, grafik
    └── style.css         # tema dan responsivitas
```
Tidak diperlukan instalasi paket selain dependensi dasar Vite. Pembagian modul dapat disederhanakan selama tanggung jawab tetap jelas.

## 9. Risiko dan Mitigasi
| Risiko | Dampak | Mitigasi |
|---|---|---|
| localStorage dibersihkan/browser diganti | Data hilang | Informasikan bahwa data hanya lokal; jangan klaim ada backup |
| Storage penuh/dinonaktifkan | Penyimpanan gagal | Tangkap error, beri pesan, jangan tampilkan keberhasilan palsu |
| JSON tersimpan rusak | Aplikasi gagal memuat | Validasi bentuk data; tampilkan error dan hindari overwrite otomatis |
| Penghapusan kategori yang direferensikan | Data menjadi yatim | Tolak penghapusan sampai relasi diselesaikan |
| Manipulasi input/XSS | Konten berbahaya tampil | Gunakan `textContent`, validasi panjang dan tipe data |
| Keterbatasan waktu workshop | Fitur belum selesai | Bangun berdasarkan prioritas Must; fitur Should belakangan |
| Perbedaan tanggal/zona waktu | Filter periode keliru | Gunakan string tanggal lokal `YYYY-MM-DD` secara konsisten |

## 10. Out of Scope
- Login, registrasi, profil, multiuser, hak akses.
- Backend, REST API, database server, cloud sync, backup otomatis.
- Integrasi bank, e-wallet, payment gateway, API eksternal.
- Multi-mata uang, kurs, pajak, investasi, utang/piutang.
- Anggaran berulang otomatis, notifikasi push, prediksi keuangan.
- Import/export CSV/PDF, lampiran struk, transaksi berulang.
- Grafik interaktif tingkat lanjut atau library chart tambahan.

## 11. Acceptance Criteria (Pengujian Manual)
| ID | Langkah uji | Hasil yang diharapkan |
|---|---|---|
| AC-01 | Jalankan aplikasi dan buka tiap ikon navigasi | Keempat menu terbuka dan menu aktif jelas |
| AC-02 | Tambahkan pemasukan Rp1.000.000 dan pengeluaran Rp250.000 pada data kosong | Overview menampilkan pemasukan Rp1.000.000, pengeluaran Rp250.000, saldo Rp750.000 |
| AC-03 | Edit pengeluaran menjadi Rp300.000 | Saldo berubah menjadi Rp700.000 |
| AC-04 | Hapus pengeluaran setelah konfirmasi | Pengeluaran berkurang dan saldo kembali Rp1.000.000 |
| AC-05 | Coba simpan nominal 0, -1, 1,5, atau kosong | Semua ditolak dengan pesan validasi |
| AC-06 | Tambah kategori `Transport`, ubah ke `Perjalanan`, lalu gunakan pada transaksi | Nama baru muncul pada transaksi yang terkait |
| AC-07 | Coba hapus kategori yang digunakan transaksi | Penghapusan ditolak dan data tetap utuh |
| AC-08 | Buat kategori tanpa relasi lalu hapus | Kategori berhasil dihapus |
| AC-09 | Hitung 100000 + 25000, lalu gunakan hasil pada form | Nominal form menjadi 125000 |
| AC-10 | Hitung 100 / 0 | Kalkulator menampilkan kesalahan, tidak mengisi nominal |
| AC-11 | Buat transaksi pada dua bulan berbeda lalu ganti periode Chart | Nilai dan distribusi kategori berubah sesuai bulan terpilih |
| AC-12 | Buat anggaran Transport Rp500.000 dan pengeluaran kategori itu Rp200.000 di bulan yang sama | Terpakai Rp200.000, sisa Rp300.000, progress 40% |
| AC-13 | Tambahkan pengeluaran Rp400.000 lagi pada kategori/bulan tersebut | Terpakai Rp600.000, sisa -Rp100.000, status over budget dan bar penuh |
| AC-14 | Coba buat anggaran kedua untuk kategori/bulan/tahun yang sama | Ditolak sebagai duplikat |
| AC-15 | Reload halaman setelah menambah/mengedit data | Data dan hasil perhitungan tetap konsisten |
| AC-16 | Uji layar 360px dan 1280px | Navigasi bawah terlihat, konten tidak terpotong horizontal |
| AC-17 | Masukkan teks `<script>alert(1)</script>` sebagai catatan | Teks ditampilkan aman dan tidak menjalankan skrip |
| AC-18 | Buka aplikasi dengan state kosong valid | Tidak ada crash, muncul empty state, data contoh tidak muncul ulang |
| AC-19 | Simulasikan storage tidak tersedia atau JSON rusak melalui DevTools | Ada pesan kesalahan; data lama tidak diam-diam ditimpa |
| AC-20 | Coba menghapus kategori yang digunakan anggaran | Penghapusan ditolak |

**Catatan pengujian AC-02:** gunakan localStorage kosong atau data uji yang direset secara sengaja agar saldo awal benar-benar nol. Jangan hapus data pengguna tanpa konfirmasi.

## 12. Implementation Plan — Workshop 1 Hari
Estimasi total **±7 jam efektif**, di luar istirahat.

| Iterasi | Durasi | Pekerjaan | Definition of Done |
|---|---:|---|---|
| 1. Scaffold & UI shell | 45 menit | Inisialisasi Vite, struktur modul, tema, navigasi bawah | Empat menu dapat dibuka, tampilan dasar responsif |
| 2. State & data | 45 menit | Model data, seed contoh, validasi, localStorage | Data contoh hanya dibuat sekali, reload mempertahankan perubahan |
| 3. Records | 100 menit | CRUD transaksi, kategori, kalkulator | Transaksi dan kategori bisa dikelola dengan validasi |
| 4. Overview | 40 menit | Ringkasan saldo dan transaksi terbaru | Total konsisten dengan Records |
| 5. Chart | 50 menit | Filter bulan/tahun, total dan grafik kategori | Grafik berubah mengikuti data dan periode |
| 6. Budgeting | 65 menit | CRUD anggaran, spent, remaining, progress | Nilai dan status over-budget benar |
| 7. QA & build | 75 menit | Uji acceptance criteria utama, responsivitas, perbaikan, build | Tidak ada error kritis; `npm run build` berhasil |

**Urutan prioritas jika waktu terbatas:** navigasi → storage → CRUD transaksi → Overview → CRUD kategori → Budgeting → Chart → kalkulator/pencarian. Kebutuhan Must yang tertunda dicatat sebagai pekerjaan lanjutan, bukan dianggap selesai.

## 13. Definition of Done MVP
MVP dinyatakan selesai apabila seluruh kebutuhan prioritas **Must** berfungsi, seluruh acceptance criteria yang terkait Must lulus secara manual, data bertahan setelah reload, tidak ada error JavaScript kritis, tampilan dapat digunakan pada ponsel dan desktop, dan build produksi Vite berhasil.

---

**Batas dokumen:** ini hanya spesifikasi; belum ada implementasi kode aplikasi.
