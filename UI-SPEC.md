# UI-SPEC.md — Traffic Money

**Versi:** 1.0  
**Status:** Spesifikasi antarmuka MVP (tanpa implementasi)  
**Acuan:** `SPEC.md` v1.0  
**Target:** Workshop 1 hari; Vite + HTML/CSS + JavaScript vanilla + localStorage

## 1. Tujuan dan Prinsip Desain

Traffic Money adalah dashboard keuangan pribadi tanpa login untuk satu pengguna pada satu browser/perangkat. UI harus mudah dipahami pemula, konsisten, responsif, dan bisa dibangun tanpa framework UI maupun library chart.

- **Mobile-first:** rancangan dimulai pada viewport 360px, lalu ditingkatkan untuk tablet/desktop.
- **Modern dan minimalis:** latar terang, card sederhana, whitespace cukup, ikon mudah dikenali, dekorasi seperlunya.
- **Keputusan berbasis angka:** nominal, kategori, tanggal, serta status anggaran mudah dipindai.
- **Aksesibel:** informasi tidak disampaikan hanya dengan warna; label form, fokus keyboard, dan pesan validasi selalu tersedia.
- **Konsisten dengan SPEC:** saldo global tidak mengikuti filter Chart; grafik berdasarkan bulan/tahun; kategori pengeluaran saja untuk anggaran.

## 2. Design Tokens

### 2.1 Color Palette

| Token | HEX | Pemakaian |
|---|---|---|
| `--color-bg` | `#F8FAFF` | Background aplikasi |
| `--color-surface` | `#FFFFFF` | Card, dialog, form |
| `--color-primary` | `#2457D6` | Tombol utama, ikon aktif, tautan |
| `--color-primary-hover` | `#1D45AA` | Hover/pressed primary |
| `--color-primary-soft` | `#EAF0FF` | Latar elemen aktif |
| `--color-purple` | `#7657C8` | Aksen soft purple, seri pengeluaran grafik |
| `--color-purple-soft` | `#F1EDFF` | Latar badge/card aksen |
| `--color-text` | `#17233C` | Teks utama |
| `--color-text-muted` | `#53627A` | Teks sekunder, label |
| `--color-border` | `#DCE4F1` | Border, divider |
| `--color-success` | `#167347` | Pemasukan, anggaran aman |
| `--color-success-soft` | `#E6F6ED` | Background status aman |
| `--color-danger` | `#B42338` | Error, pengeluaran dalam daftar, over budget |
| `--color-danger-soft` | `#FCECEF` | Background error |
| `--color-warning` | `#8B5800` | Anggaran mendekati batas |
| `--color-warning-soft` | `#FFF4D8` | Background warning |
| `--color-focus` | `#2457D6` | Outline fokus keyboard |

**Aturan:** nominal pemasukan memakai hijau dan pengeluaran memakai merah pada daftar; perbandingan seri Chart memakai biru (income) dan purple (expense), dengan legenda teks. Warna harus disertai simbol/label (`+`, `−`, `Aman`, `Mendekati`, `Melebihi`). Teks kecil menggunakan `--color-text`/`--color-text-muted`, bukan aksen pastel berkontras rendah. Target rasio kontras WCAG AA: **≥4,5:1** untuk teks biasa, **≥3:1** untuk teks besar dan komponen nonteks penting. Uji pasangan warna aktual sebelum rilis; jangan mengasumsikan token dekoratif cocok untuk teks kecil.

### 2.2 Typography

- Font: `Inter`, `Arial`, `Helvetica`, `sans-serif`; gunakan font sistem sebagai fallback dan jangan mensyaratkan font eksternal.
- Ukuran dasar: **16px**; line-height body **1.5**.
- Heading halaman: **24px/32px**, berat 700 pada mobile; **30px/38px** desktop.
- Heading section: **18px/26px**, berat 650–700.
- Angka saldo: **30px/38px** mobile; **40px/48px** desktop, berat 700, `font-variant-numeric: tabular-nums`.
- Angka KPI: **22px/30px**, berat 700.
- Body: **16px/24px**; metadata/label: **14px/20px**; caption: **12px/18px** hanya untuk informasi nonkritis.
- Format nominal: `Rp1.250.000`; angka negatif ditampilkan `−Rp100.000`; tanggal konsisten dengan locale Indonesia.

### 2.3 Spacing, Radius, Elevation

- Skala jarak (px): `4, 8, 12, 16, 20, 24, 32, 40, 48`.
- Padding halaman: **16px mobile**, **24px tablet**, **32px desktop**.
- Jarak antar-card: **12–16px mobile**, **20–24px desktop**.
- Padding card: **16px mobile**, **24px desktop**.
- Radius: input/button **12px**, card **16px**, modal **20px**, pill **999px**.
- Border: **1px** `#DCE4F1`; shadow card sangat halus (opsional), jangan bergantung pada shadow sebagai satu-satunya pembatas.
- Konten desktop: `max-width: 1200px`, berada di tengah.
- Target sentuh: minimal **44×44px** untuk kontrol interaktif.

## 3. Layout dan Breakpoints

| Rentang viewport | Susunan |
|---|---|
| **360–599px (mobile)** | Satu kolom; cards bertumpuk; list transaksi berupa rows/cards; filter bisa wrap; modal berupa sheet/dialog yang muat viewport |
| **600–899px (tablet)** | Grid KPI 2 kolom; konten lain 1–2 kolom sesuai ruang; modal terpusat |
| **≥900px (desktop)** | Grid KPI 3 kolom jika relevan; grafik/card 2 kolom; tabel transaksi penuh; form dialog terpusat |

Pada lebar di bawah 360px, desain tetap dapat di-scroll vertikal dan tidak boleh membuat overflow horizontal yang tidak disengaja. Bottom navigation **tetap di bawah pada semua ukuran**, bukan diubah menjadi sidebar. Gunakan ruang bawah (`padding-bottom`) yang memperhitungkan tinggi nav serta safe-area perangkat. Header dan konten dapat scroll; bottom nav tetap terlihat. Jika tabel desktop terlalu lebar, pada mobile ubah menjadi list card, bukan memaksa halaman melebar.

## 4. App Shell dan Navigasi

- Header: logo/teks **Traffic Money**, judul halaman, subtitle pendek opsional. Tidak ada avatar, login, profil, atau menu akun.
- Area utama: `main` berisi halaman aktif; satu halaman aktif pada satu waktu.
- Bottom nav: empat item **Overview** (ikon `house`), **Records** (`list-receipt`), **Chart** (`chart-column`), **Budgeting** (`wallet`).
- Ikon visual boleh dipadukan dengan label teks kecil di bawahnya untuk kejelasan; **nama aksesibel wajib** walau label visual disembunyikan pada lebar sempit.
- Item aktif: warna biru + latar biru muda/pill + `aria-current="page"`; item nonaktif berwarna teks muted.
- Navigasi dapat dioperasikan via mouse, touch, Tab, Enter/Space; fokus terlihat. Jangan menggunakan ikon dekoratif tanpa teks aksesibel.
- Tidak ada routing backend; perpindahan tampilan dilakukan di browser dan tidak memerlukan reload halaman.

## 5. Komponen UI Bersama

| Komponen | Desain dan perilaku |
|---|---|
| `PageHeader` | Judul halaman dan deskripsi singkat; tombol aksi kontekstual bila perlu |
| `SummaryCard` | Label, angka besar, ikon opsional, teks pendukung; jangan hanya membedakan dengan warna |
| `Button` | Primary, secondary, danger, icon-only; disabled jelas; minimum 44px |
| `Input/Select/Date` | Label di atas, helper/error di bawah, border dan fokus jelas; `required` ditandai |
| `SegmentedControl` | Pilih `Pemasukan` / `Pengeluaran`, status terpilih terlihat dan aksesibel |
| `FilterBar` | Search, tipe, bulan, tahun; pada mobile membungkus baris |
| `TransactionRow` | Kategori, tanggal, catatan ringkas, nominal bertanda, menu Edit/Hapus |
| `CategoryBadge` | Nama kategori sebagai teks; tidak mengandalkan warna saja |
| `Modal/Sheet` | Judul, close, isi form, Batal/Simpan; fokus terkelola; dapat scroll |
| `ConfirmDialog` | Konfirmasi hapus transaksi/anggaran, menjelaskan objek dan konsekuensi |
| `Toast/InlineAlert` | Feedback simpan, error validasi, dan storage error; error persisten bila butuh tindakan |
| `EmptyState` | Pesan spesifik dan CTA yang relevan; tidak menganggap data contoh wajib ada |
| `ChartLegend` | Label seri + swatch; nilai juga dapat dibaca dalam teks/tabel ringkas |
| `BudgetProgress` | Bar 0–100% secara visual, angka persentase aktual bisa >100%, teks terpakai/sisa/status |
| `Calculator` | Display, tombol 0–9, `+ − × ÷`, `=`, clear, backspace, `Gunakan hasil` |

**Dialog:** tombol Escape menutup jika aman; fokus kembali ke pemicu setelah ditutup; saat dialog terbuka fokus tidak berpindah ke elemen di belakangnya. Konfirmasi penghapusan harus eksplisit. Gunakan teks input yang aman (bukan HTML yang dieksekusi).

## 6. Halaman Overview

**Tujuan:** pengguna langsung memahami posisi keuangan global.

**Urutan konten:** judul → saldo utama → kartu total pemasukan/pengeluaran → transaksi terbaru (maksimal 5) → tautan/aksi menuju Records. Semua angka berasal dari keseluruhan transaksi, **bukan** periode Chart.

**Interaksi:** pilih `Lihat semua` untuk pindah ke Records; setiap item terbaru dapat membuka edit transaksi jika diimplementasikan secara konsisten; kosong menampilkan `Belum ada transaksi` dan tombol `Tambah transaksi`.

### Wireframe Mobile (360px)

```text
┌──────────────────────────────────┐
│ Traffic Money                    │
│ Overview                         │
│ Ringkasan keuangan pribadi       │
├──────────────────────────────────┤
│ ┌──────────────────────────────┐ │
│ │ SALDO SAAT INI               │ │
│ │ Rp7.500.000                  │ │
│ │ Pemasukan − Pengeluaran      │ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ ↑ Total Pemasukan            │ │
│ │ Rp10.000.000                 │ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ ↓ Total Pengeluaran          │ │
│ │ Rp2.500.000                  │ │
│ └──────────────────────────────┘ │
│                                  │
│ Transaksi Terbaru    Lihat semua │
│ ┌──────────────────────────────┐ │
│ │ Makan        −Rp50.000       │ │
│ │ 19 Nov · Makan siang         │ │
│ ├──────────────────────────────┤ │
│ │ Gaji         +Rp5.000.000    │ │
│ │ 18 Nov                     │ │
│ │ ... maksimal 5 item          │ │
│ └──────────────────────────────┘ │
├──────────────────────────────────┤
│  ⌂       ≡       ▥       ◫      │
│ Overview Records Chart Budgeting │
└──────────────────────────────────┘
```

### Wireframe Desktop (≥900px)

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Traffic Money                                      Overview                 │
│ Ringkasan keuangan pribadi                                                  │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ SALDO SAAT INI                                      Rp7.500.000         │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│ ┌────────────────────────────────┐ ┌─────────────────────────────────────┐ │
│ │ ↑ TOTAL PEMASUKAN              │ │ ↓ TOTAL PENGELUARAN                 │ │
│ │ Rp10.000.000                   │ │ Rp2.500.000                         │ │
│ └────────────────────────────────┘ └─────────────────────────────────────┘ │
│ Transaksi Terbaru                                          [Lihat semua]    │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ Kategori         Tanggal         Catatan                Nominal          │ │
│ │ Makan            19 Nov          Makan siang            −Rp50.000        │ │
│ │ Gaji             18 Nov          —                      +Rp5.000.000     │ │
│ │ ... maksimal 5 transaksi                                              │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│                   [Overview] [Records] [Chart] [Budgeting]                   │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 7. Halaman Records

**Tujuan:** mencatat dan mengelola transaksi serta kategori dengan kalkulator.

**Isi:** judul + `Tambah transaksi`; pencarian catatan/kategori; filter tipe (`Semua`, `Pemasukan`, `Pengeluaran`) dan periode sederhana; daftar transaksi; tombol `Kelola kategori`. Form tambah/edit berisi tipe, nominal rupiah bulat positif, kategori sesuai tipe, tanggal valid, catatan opsional ≤200 karakter. Kategori memiliki nama 1–40 karakter, tipe, dan daftar dengan aksi tambah/edit/hapus.

**Interaksi utama:**
1. Klik `Tambah transaksi` → dialog/sheet → pilih tipe → kategori tersaring → isi form → validasi → simpan → daftar dan semua ringkasan terkait diperbarui tanpa reload.
2. `Edit` membuka data lama; `Hapus` memunculkan konfirmasi; `Batal` tidak mengubah state.
3. `Kelola kategori` menampilkan CRUD; nama duplikat case-insensitive dalam tipe yang sama ditolak. Penghapusan kategori yang dipakai transaksi **atau anggaran** ditolak dengan pesan jelas; perubahan tipe kategori yang sudah dipakai transaksi ditolak.
4. Kalkulator tersedia melalui tombol di samping input nominal. Operasi `+ − × ÷`; pembagian nol dan hasil non-finite ditolak. `Gunakan hasil` hanya aktif untuk hasil **bilangan bulat positif**, lalu mengisi field nominal, tidak otomatis menyimpan transaksi.
5. Pencarian dan filter dapat dikombinasikan; ketika hasil kosong tampilkan `Tidak ada transaksi yang cocok` dengan opsi reset filter.

### Wireframe Mobile (360px)

```text
┌──────────────────────────────────┐
│ Traffic Money                    │
│ Records                          │
│ [ + Tambah transaksi ]           │
│ [ Kelola kategori ]              │
│ ┌──────────────────────────────┐ │
│ │ Cari kategori/catatan...     │ │
│ └──────────────────────────────┘ │
│ [Semua ▼] [Bulan ▼] [Tahun ▼]    │
│                                  │
│ Daftar Transaksi                 │
│ ┌──────────────────────────────┐ │
│ │ Makan          −Rp50.000     │ │
│ │ 19 Nov · Makan siang         │ │
│ │ [Edit] [Hapus]               │ │
│ ├──────────────────────────────┤ │
│ │ Gaji           +Rp5.000.000  │ │
│ │ 18 Nov                       │ │
│ │ [Edit] [Hapus]               │ │
│ └──────────────────────────────┘ │
├──────────────────────────────────┤
│  ⌂       ≡       ▥       ◫      │
│ Overview Records Chart Budgeting │
└──────────────────────────────────┘

Form tambah/edit (sheet):
┌──────────────────────────────────┐
│ Tambah Transaksi             [×] │
│ [Pemasukan] [Pengeluaran]        │
│ Nominal (Rp)                     │
│ [125000                ][Kalk.]  │
│ Kategori                         │
│ [Pilih kategori            ▼]    │
│ Tanggal                          │
│ [2026-11-19]                     │
│ Catatan (opsional)               │
│ [...........................]    │
│ [Batal]              [Simpan]    │
└──────────────────────────────────┘
```

### Wireframe Desktop (≥900px)

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Traffic Money                                       Records                 │
│ Kelola pemasukan dan pengeluaran                 [+ Tambah] [Kelola kategori]│
│ [Cari catatan/kategori...................] [Tipe ▼] [Bulan ▼] [Tahun ▼]     │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ Kategori   Tipe          Tanggal      Catatan         Nominal     Aksi    │ │
│ │ Makan      Pengeluaran   19 Nov       Makan siang     −Rp50.000   Edit/Hps│ │
│ │ Gaji       Pemasukan     18 Nov       —               +Rp5.000.000 Edit/Hps│ │
│ │ ...                                                                      │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│                   [Overview] [Records] [Chart] [Budgeting]                   │
└──────────────────────────────────────────────────────────────────────────────┘

Dialog desktop (di atas halaman):
┌───────────────────────────────────────────────┐
│ Tambah/Edit Transaksi                     [×] │
│ [Pemasukan] [Pengeluaran]                     │
│ Nominal (Rp) [....................] [Kalk.]    │
│ Kategori     [.......................▼]       │
│ Tanggal      [YYYY-MM-DD]                     │
│ Catatan      [........................]       │
│ [Batal]                           [Simpan]    │
└───────────────────────────────────────────────┘
```

## 8. Halaman Chart

**Tujuan:** memahami total dan distribusi transaksi menurut periode serta kategori.

**Isi:** filter bulan dan tahun (default bulan berjalan); kartu total pemasukan dan pengeluaran **untuk periode terpilih**; grafik perbandingan dua seri; grafik distribusi per kategori dengan pemilih tipe `Pemasukan/Pengeluaran` dan nilai/legenda. Gunakan batang HTML/CSS atau SVG sederhana, tanpa chart library.

**Interaksi:** mengubah bulan/tahun memperbarui semua angka/grafik Chart saja; mengganti tipe distribusi memperbarui grafik kategori; kategori tanpa transaksi pada periode terpilih boleh tidak ditampilkan; jika tidak ada data, tampilkan empty state dan nilai `Rp0`. Tooltip hover boleh opsional, tetapi nilai penting tetap tersedia sebagai label atau daftar pendamping untuk keyboard/touch. Skala grafik tidak boleh menghasilkan NaN atau pembagian nol.

### Wireframe Mobile (360px)

```text
┌──────────────────────────────────┐
│ Traffic Money                    │
│ Chart                            │
│ [November ▼] [2026 ▼]            │
│ ┌──────────────────────────────┐ │
│ │ Pemasukan periode            │ │
│ │ Rp5.000.000                  │ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ Pengeluaran periode          │ │
│ │ Rp1.200.000                  │ │
│ └──────────────────────────────┘ │
│ Perbandingan                     │
│ ┌──────────────────────────────┐ │
│ │ Pemasukan    ███████████     │ │
│ │ Pengeluaran  ███             │ │
│ │ Biru: masuk | Ungu: keluar   │ │
│ └──────────────────────────────┘ │
│ Berdasarkan Kategori             │
│ [Pemasukan] [Pengeluaran]        │
│ ┌──────────────────────────────┐ │
│ │ Makan      █████  Rp600.000  │ │
│ │ Transport  ███    Rp350.000  │ │
│ │ Lainnya    ██     Rp250.000  │ │
│ └──────────────────────────────┘ │
├──────────────────────────────────┤
│  ⌂       ≡       ▥       ◫      │
│ Overview Records Chart Budgeting │
└──────────────────────────────────┘
```

### Wireframe Desktop (≥900px)

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Traffic Money                                          Chart                │
│ Analisis transaksi                           [November ▼] [2026 ▼]         │
│ ┌────────────────────────────────┐ ┌─────────────────────────────────────┐ │
│ │ Pemasukan periode              │ │ Pengeluaran periode                 │ │
│ │ Rp5.000.000                    │ │ Rp1.200.000                         │ │
│ └────────────────────────────────┘ └─────────────────────────────────────┘ │
│ ┌────────────────────────────────┐ ┌─────────────────────────────────────┐ │
│ │ Perbandingan                   │ │ Distribusi per Kategori             │ │
│ │ Masuk  █████████████           │ │ [Pemasukan] [Pengeluaran]          │ │
│ │ Keluar ████                    │ │ Makan      █████  Rp600.000         │ │
│ │ Legenda: Biru/Ungu             │ │ Transport  ███    Rp350.000         │ │
│ │ Nilai total terlihat           │ │ Lainnya    ██     Rp250.000         │ │
│ └────────────────────────────────┘ └─────────────────────────────────────┘ │
│                   [Overview] [Records] [Chart] [Budgeting]                   │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 9. Halaman Budgeting

**Tujuan:** menetapkan dan memantau batas pengeluaran per kategori per bulan.

**Isi:** pemilih bulan/tahun; `Tambah anggaran`; daftar anggaran per kategori pengeluaran; tiap card menampilkan batas, terpakai, sisa, persentase aktual, status, dan progress bar. Form berisi kategori **expense**, nominal positif, bulan (1–12), tahun (2000–2100). Kombinasi kategori+bulan+tahun harus unik.

**Status visual:**
- `Aman`: penggunaan <80% (hijau + teks).
- `Mendekati batas`: 80% sampai 100% inklusif (kuning + teks).
- `Melebihi anggaran`: >100% (merah + teks).

Ambang 80% adalah **keputusan UI** untuk pemberian peringatan, bukan aturan bisnis baru. Panjang bar dibatasi 100%; label numerik tetap menampilkan persentase aktual (misalnya `120%`). Sisa negatif ditampilkan `−Rp100.000`, bukan nol. Jika belum ada budget pada periode, tampilkan empty state `Belum ada anggaran` dan CTA.

**Interaksi:** tambah/edit membuka form; hapus meminta konfirmasi; setelah transaksi berubah, angka spent/sisa/progress ikut berubah; filter periode hanya mengubah daftar anggaran yang dilihat, bukan menghapus data periode lain. Penghapusan kategori yang sedang digunakan anggaran ditolak di halaman Records.

### Wireframe Mobile (360px)

```text
┌──────────────────────────────────┐
│ Traffic Money                    │
│ Budgeting                        │
│ [November ▼] [2026 ▼]            │
│ [ + Tambah anggaran ]            │
│                                  │
│ ┌──────────────────────────────┐ │
│ │ Transport        [Edit][Hps] │ │
│ │ Batas       Rp500.000        │ │
│ │ Terpakai    Rp200.000        │ │
│ │ Sisa        Rp300.000        │ │
│ │ ████████░░░░░░░░ 40%         │ │
│ │ Status: Aman                 │ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ Makan            [Edit][Hps] │ │
│ │ Batas       Rp500.000        │ │
│ │ Terpakai    Rp600.000        │ │
│ │ Sisa       −Rp100.000        │ │
│ │ ████████████████ 120%        │ │
│ │ Status: Melebihi anggaran    │ │
│ └──────────────────────────────┘ │
├──────────────────────────────────┤
│  ⌂       ≡       ▥       ◫      │
│ Overview Records Chart Budgeting │
└──────────────────────────────────┘
```

### Wireframe Desktop (≥900px)

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Traffic Money                                        Budgeting              │
│ Anggaran bulanan                  [November ▼] [2026 ▼] [+ Tambah anggaran] │
│ ┌────────────────────────────────┐ ┌─────────────────────────────────────┐ │
│ │ Transport          [Edit][Hps] │ │ Makan                   [Edit][Hps]  │ │
│ │ Batas       Rp500.000         │ │ Batas          Rp500.000            │ │
│ │ Terpakai    Rp200.000         │ │ Terpakai       Rp600.000            │ │
│ │ Sisa        Rp300.000         │ │ Sisa          −Rp100.000            │ │
│ │ ████████░░░░░░░░ 40%          │ │ ████████████████ 120%              │ │
│ │ Aman                           │ │ Melebihi anggaran                  │ │
│ └────────────────────────────────┘ └─────────────────────────────────────┘ │
│                   [Overview] [Records] [Chart] [Budgeting]                   │
└──────────────────────────────────────────────────────────────────────────────┘

Dialog: [Kategori pengeluaran ▼] [Nominal Rp] [Bulan ▼] [Tahun] [Batal] [Simpan]
```

## 10. Interaksi, State, dan Validasi

| Situasi | Respons UI |
|---|---|
| Submit valid | Tutup form, perbarui tampilan terkait, tampilkan pesan sukses **setelah** penyimpanan berhasil |
| Nominal kosong/0/negatif/desimal | Tolak simpan; error inline `Masukkan nominal rupiah bulat lebih dari 0` |
| Tanggal tidak valid | Error inline, data lama tidak berubah |
| Kategori tak cocok tipe | Nonaktifkan pilihan tak cocok; tetap validasi sebelum simpan |
| Kategori dipakai transaksi/anggaran lalu dihapus | Tolak, tampilkan alasan dan arahkan untuk menyelesaikan relasi |
| Budget duplikat pada kategori+bulan+tahun | Tolak, beri pesan `Anggaran untuk kategori dan periode ini sudah ada` |
| Kalkulator bagi nol/non-finite | Pesan error; hasil tidak dapat digunakan |
| Kalkulator hasil 0/negatif/desimal | Boleh ditampilkan sebagai hasil hitung, tetapi tombol `Gunakan hasil` nonaktif |
| Tidak ada transaksi/anggaran | Empty state yang relevan dan CTA |
| Filter tidak menemukan hasil | Empty state khusus hasil filter + `Reset filter` |
| localStorage gagal/tidak tersedia | Pesan error jelas, jangan menyatakan sukses; jangan diam-diam menimpa data |
| JSON tersimpan rusak | Tampilkan error pemuatan; jangan otomatis reset/overwrite |
| Data contoh | Hanya saat key state aplikasi belum ada; state kosong valid tetap kosong |

Data di layar harus mengikuti state yang sama: `transactions`, `categories`, `budgets`. Nama kategori dibaca melalui `categoryId`, sehingga rename kategori tercermin di semua halaman. Seluruh input dan output harus memperlakukan catatan/nama kategori sebagai teks biasa; tidak boleh mengeksekusi markup pengguna.

## 11. Aksesibilitas dan Responsivitas Detail

- Gunakan struktur semantik `header`, `main`, `nav`, judul hierarkis, `button`, `label`, dan tabel hanya saat data memang tabular.
- Form: label selalu terlihat; placeholder bukan pengganti label; error dikaitkan dengan field dan disampaikan dengan teks.
- Ikon tanpa teks visual: wajib `aria-label` yang jelas (`Edit transaksi`, `Hapus anggaran`, dan sebagainya).
- Focus ring terlihat (misalnya outline 2px dan offset 2px), jangan hilangkan default focus tanpa pengganti.
- Kontras teks minimal WCAG AA; warna pastel terutama untuk **background**, bukan teks kecil.
- Grafik punya judul, legenda, nilai angka, dan ringkasan teks; informasi tidak hanya disampaikan oleh bentuk/warna.
- Progress anggaran punya teks `Terpakai Rp… dari Rp… (…%)` serta status; tidak bergantung pada bar saja.
- Animasi transisi singkat 120–200ms dan hormati `prefers-reduced-motion`.
- Gunakan `overflow-wrap` pada catatan/kategori panjang; tidak ada horizontal scroll halaman pada 360px dan 1280px.
- Konten dan dialog tidak tertutup bottom nav; form tetap dapat diakses saat keyboard ponsel muncul.

## 12. Pemeriksaan Manual UI (Acceptance Criteria)

| ID | Langkah pemeriksaan | Hasil yang diharapkan |
|---|---|---|
| UI-01 | Buka pada 360px dan 1280px | Tidak ada overflow horizontal; nav bawah dan konten terbaca |
| UI-02 | Buka empat menu dari bottom nav | Menu benar terbuka; ikon aktif jelas; label aksesibel tersedia |
| UI-03 | Navigasi dengan Tab/Enter/Space | Semua aksi utama dapat dijalankan; fokus terlihat |
| UI-04 | Periksa teks, badge, tombol, dan input | Kontras memenuhi target AA; status tidak bergantung pada warna |
| UI-05 | Buka Overview pada data kosong | Saldo/total Rp0 dan empty state; tidak crash |
| UI-06 | Tambah/edit/hapus transaksi | Dialog dan feedback jelas; angka Overview ikut berubah |
| UI-07 | Pilih tipe transaksi berbeda | Daftar kategori hanya menampilkan tipe yang sesuai |
| UI-08 | Uji nominal tidak valid | Error inline dan simpan ditolak |
| UI-09 | Hapus kategori yang dipakai | Ada pesan penolakan; kategori tidak hilang |
| UI-10 | Hitung `100000 + 25000` lalu gunakan hasil | Input nominal menjadi `125000`, belum otomatis tersimpan |
| UI-11 | Ganti bulan/tahun Chart | Total dan grafik berubah sesuai periode; saldo Overview tidak berubah |
| UI-12 | Buka Chart tanpa transaksi pada periode | Tampil nilai Rp0/empty state; tidak ada bar rusak |
| UI-13 | Buat budget 500000 dengan spent 200000 | Tampil 40%, sisa Rp300.000, status Aman |
| UI-14 | Ubah spent menjadi 600000 | Tampil 120%, sisa −Rp100.000, bar penuh, status Melebihi |
| UI-15 | Simpan data lalu refresh | UI menampilkan data persisten yang sama |
| UI-16 | Simulasikan kegagalan storage | Pesan error muncul; tidak ada pesan sukses palsu |
| UI-17 | Uji nama kategori/catatan sangat panjang | Teks membungkus/terpotong secara aman tanpa merusak layout |
| UI-18 | Uji dialog pada layar mobile | Tombol simpan/batal dapat dijangkau dan tidak tertutup nav |

## 13. Urutan Penerapan UI dalam Workshop

1. **Iterasi 1 — Shell:** token warna, typography, spacing, header, bottom navigation, responsivitas dasar.
2. **Iterasi 2 — Komponen dasar:** card, button, input, dialog, empty state, alert.
3. **Iterasi 3 — Records:** list/tabel, filter, CRUD modal, kategori, kalkulator.
4. **Iterasi 4 — Overview:** saldo, dua kartu ringkasan, lima transaksi terbaru.
5. **Iterasi 5 — Chart:** filter bulan/tahun, bar chart sederhana, daftar distribusi kategori.
6. **Iterasi 6 — Budgeting:** kartu anggaran, form CRUD, progress dan status.
7. **Iterasi 7 — QA:** uji keyboard, kontras, 360px/1280px, error/empty state, penyimpanan, build.

**Batas dokumen:** seluruh gambar kotak dan nominal pada wireframe bersifat ilustratif (bukan data yang harus di-hardcode). Ini spesifikasi UI saja; belum ada kode aplikasi.
