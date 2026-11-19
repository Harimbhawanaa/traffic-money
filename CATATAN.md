# CATATAN.md — Traffic Money

## 1. Tujuan Pengembangan

Traffic Money adalah aplikasi manajemen keuangan pribadi berbasis web yang membantu pengguna mencatat pemasukan, pengeluaran, memantau saldo, dan mengatur anggaran secara praktis.

Aplikasi dikembangkan menggunakan pendekatan Vibe Coding dengan bantuan AI untuk mempercepat proses pengembangan, sementara pengembang tetap bertanggung jawab terhadap pengujian dan kualitas aplikasi.

## 2. Target Aplikasi

Traffic Money memiliki empat menu utama:

1. **Overview:** Menampilkan total saldo, total pemasukan, total pengeluaran, dan riwayat transaksi terbaru.
2. **Records:** Menambahkan, mengedit, dan menghapus transaksi pemasukan maupun pengeluaran, mengelola kategori, serta menyediakan kalkulator sederhana.
3. **Chart:** Menampilkan grafik pemasukan dan pengeluaran berdasarkan kategori dan periode.
4. **Budgeting:** Membuat dan mengelola anggaran berdasarkan kategori, serta menampilkan progress penggunaan anggaran.

## 3. Teknologi

- HTML5 untuk struktur halaman.
- CSS3 untuk desain dan responsivitas.
- JavaScript vanilla untuk interaksi dan logika aplikasi.
- localStorage untuk menyimpan data pengguna.
- Tanpa backend, database server, atau framework yang kompleks.

## 4. Konsep Antarmuka

Traffic Money menggunakan desain modern, minimalis, dan responsif dengan kombinasi warna putih, biru, dan soft purple.

Navigasi utama berada di bagian bawah layar menggunakan ikon untuk empat menu utama: Overview, Records, Chart, dan Budgeting.

Antarmuka dirancang agar nyaman digunakan pada perangkat desktop maupun mobile.

## 5. Batasan Pengembangan

- Aplikasi digunakan untuk pengelolaan keuangan pribadi.
- Tidak memerlukan login atau registrasi.
- Transaksi dimasukkan secara manual.
- Tidak menggunakan integrasi bank, e-wallet, atau payment gateway.
- Data disimpan menggunakan localStorage pada browser.
- Data tidak otomatis tersinkronisasi antarperangkat.
- Mata uang utama menggunakan Rupiah (IDR).
- Tidak menyimpan API key atau informasi sensitif.
- Menggunakan data contoh nonpribadi untuk pengujian.

## 6. Risiko Penggunaan AI

Penggunaan AI dapat menghasilkan kode dengan kesalahan logika, terutama dalam perhitungan saldo, transaksi, dan anggaran.

Selain itu, penggunaan localStorage memiliki keterbatasan karena data dapat hilang apabila penyimpanan browser dibersihkan.

Untuk mengurangi risiko tersebut, setiap fitur harus diperiksa dan diuji secara manual sebelum dinyatakan selesai.

## 7. Kriteria Keberhasilan

Traffic Money dinyatakan berhasil apabila:

1. Pengguna dapat menambahkan, mengedit, dan menghapus transaksi.
2. Total saldo dihitung dengan benar berdasarkan pemasukan dikurangi pengeluaran.
3. Pengguna dapat menambah, mengedit, dan menghapus kategori.
4. Grafik menampilkan data keuangan sesuai transaksi.
5. Pengguna dapat membuat dan memantau anggaran.
6. Data tetap tersimpan setelah halaman dimuat ulang.
7. Tampilan responsif pada desktop dan mobile.
8. Seluruh fitur utama dapat diuji secara manual melalui browser.