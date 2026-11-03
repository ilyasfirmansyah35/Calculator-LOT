# ⚡ XAUUSD Lot Calculator — PWA

Kalkulator ukuran lot trading emas XAUUSD, mobile-first, mendukung USD & IDR (Rupiah) dengan kurs live otomatis.

## 🚀 Demo
👉 **[Buka di GitHub Pages](https://[username].github.io/[repo-name]/)**

## ✨ Fitur
- 💱 Toggle mata uang **USD / IDR (Rupiah)**
- 📡 Kurs **USD/IDR live** otomatis (open.er-api.com)
- 📊 Mode risiko: **Persentase (%)** atau **Nominal siap hilang**
- ⚡ Quick-select chip risiko: 0.5% · 1% · 1.5% · 2% · 3%
- 🎯 Target Profit **R:R 1:1 · 1:2 · 1:3**
- 📊 Meter risiko visual
- 📋 Riwayat kalkulasi (disimpan di localStorage)
- 📵 Mode **offline** (kurs fallback Rp 15.900)
- 📲 **Installable PWA** — bisa diinstall di HP

## 📐 Formula XAUUSD

```
1 lot = 100 oz emas | 1 pip = $0.10
Pip Value = 100 × $0.10 = $10 per pip per lot

Lot Size = Risiko ($) ÷ (Stop Loss pips × $10)
```

**Contoh:** 0.01 lot × 60 pips × $10 = $6 ≈ **Rp 96.000–109.000**

## 📂 Struktur File

```
├── index.html       # Main app (PWA, standalone)
├── manifest.json    # PWA manifest
├── sw.js            # Service Worker (offline support)
└── icons/
    ├── icon-192.png
    └── icon-512.png
```

## 🌐 Deploy ke GitHub Pages

1. Upload semua file ke GitHub repository
2. Settings → Pages → Branch: `main` → folder: `/ (root)`
3. Akses di `https://[username].github.io/[repo-name]/`

## ⚠️ Disclaimer
Kalkulator ini hanya sebagai referensi. Selalu kelola risiko dengan bijak. Trading emas mengandung risiko tinggi.
