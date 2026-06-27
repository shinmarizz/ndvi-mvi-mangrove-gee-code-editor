# ndvi-mvi-mangrove-gee-code-editor

# Peta NDVI & MVI Persebaran Mangrove di Pesisir Kabupaten Karawang Menggunakan Google Earth Engine Tahun 2017

## 📋 Deskripsi Proyek

Proyek ini bertujuan untuk memetakan dan menganalisis persebaran vegetasi mangrove di wilayah pesisir Kabupaten Karawang dengan memanfaatkan citra satelit Sentinel-2A melalui platform Google Earth Engine (GEE). Analisis dilakukan menggunakan dua indeks spektral utama, yaitu **NDVI (Normalized Difference Vegetation Index)** untuk mengidentifikasi kerapatan vegetasi secara umum, dan **MVI (Mangrove Vegetation Index)** yang lebih spesifik digunakan untuk membedakan vegetasi mangrove dari jenis vegetasi lain di sekitarnya.

### Tools yang Digunakan
- **Google Earth Engine (GEE)** — platform pengolahan citra satelit berbasis cloud untuk ekstraksi dan analisis data spasial
- **JavaScript (GEE Code Editor)** — bahasa skrip untuk pemrosesan citra dan perhitungan indeks spektral
- **QGIS** — untuk visualisasi, layouting peta, dan validasi hasil akhir
- **Google Drive / Google Colab** *(opsional)* — untuk ekspor hasil dan analisis lanjutan

### Tujuan Proyek
1. Memetakan distribusi spasial vegetasi mangrove di wilayah pesisir Kabupaten Karawang
2. Menghitung dan membandingkan nilai indeks NDVI dan MVI pada area kajian
3. Mengidentifikasi area dengan potensi kerapatan mangrove tinggi, sedang, dan rendah
4. Menyediakan basis data spasial yang dapat digunakan untuk mendukung upaya konservasi dan pengelolaan ekosistem mangrove

---

## 🛰️ Dataset yang Digunakan

| Dataset | Sumber | Keterangan |
|---|---|---|
| Sentinel-2A (Level-2A) | Copernicus / ESA via GEE Data Catalog | Resolusi spasial 10m, digunakan untuk band Red, NIR, Green, dan SWIR |
| Batas Administrasi Kabupaten Karawang | BIG / Shapefile RBI | Digunakan sebagai *area of interest* (AOI) |
| Data Lapangan/Survei *(opsional)* | Observasi lapangan | Untuk validasi hasil klasifikasi |

**Periode Akuisisi Citra:** *(isi sesuai tanggal citra yang digunakan, contoh: Juni–Agustus 2025)*
**Tingkat Tutupan Awan:** *(contoh: < 10%)*

---

## ⚙️ Metodologi Singkat

1. Pengumpulan dan filtering citra Sentinel-2A berdasarkan AOI, rentang waktu, dan tutupan awan
2. Masking awan menggunakan band QA60/SCL
3. Perhitungan indeks spektral:
   - **NDVI** = (NIR − Red) / (NIR + Red)
   - **MVI** = (NIR − Green) / (SWIR − Green)
4. Klasifikasi tingkat kerapatan vegetasi/mangrove berdasarkan ambang nilai (*threshold*)
5. Visualisasi hasil dalam bentuk peta tematik

---

## 🖼️ Hasil Visualisasi

### Peta NDVI
```
```

### Peta MVI
*(sisipkan gambar/screenshot hasil peta MVI di sini)*
```
```

### Peta Persebaran Mangrove (Hasil Klasifikasi)
```
```

### Perbandingan Statistik

---

## 📁 Struktur Repository

```
├── scripts/
│   └── gee_ndvi_mvi_mangrove.js
├── images/
│   ├── ndvi_map.png
│   ├── mvi_map.png
│   └── mangrove_distribution_map.png
├── data/
│   └── aoi_karawang.geojson
└── README.md
```

---

## 📚 Daftar Pustaka

1. I'zzuddiin, M., Alina, A. N., Mahardianti, M. A., Yahya, F., & Prabawa, S. E. (2025). Analisis Perubahan Indeks Kerapatan Vegetasi Mangrove Menggunakan Algoritma Normalized Difference Vegetation Index (NDVI) di Pantai Timur Surabaya Berbasis Sistem Informasi Geografis (SIG). *Jurnal Geodesi Undip*, 12(4), 21–32.
2. Semedi, B., Marjono, M., Savitri, N. L. E., Hikmawati, V. F., Bayuaji, G. D. A. P., Syam's, N. D. S., & Diza, N. F. (2023). Pemanfaatan Google Earth Engine untuk Memantau Perubahan Luasan Hutan Mangrove di Probolinggo. *Journal of Fisheries and Marine Research*, 7(2), 79–87.
3. Nurzihan, Y. M., Rinzani, A., Kamaluddin, M. R., Ridwana, R., & Somantri, L. (2023). Analisis Indeks Kerapatan Vegetasi di Desa Cihanjuang Rahayu Menggunakan Citra Satelit Sentinel-2A dengan Metode MSARVI. *Jurnal Pendidikan Geografi Undiksha*, 11(3), 223–233. https://doi.org/10.23887/jjpg.v11i3.66790
4. Cardille, J. A., Crowley, M. A., Saah, D., & Clinton, N. E. (Eds.). (2024). Cloud-Based Remote Sensing with Google Earth Engine: Fundamentals and Applications. Springer Nature Switzerland. https://doi.org/10.1007/978-3-031-26588-4

---

## 👤 Penulis

**Nama:** *Adnan Yusuf Hartawan*
Mahasiswa Teknik Geodesi, Universitas Diponegoro

---

