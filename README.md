# Palugada

Frontend toko produk digital berbasis React + Vite. App ini berisi storefront, checkout, pelacakan order, dashboard reseller, dan panel admin untuk mengelola produk, promo, order, review, reseller, serta request produk.

## Fitur

- Katalog produk digital dengan pencarian, kategori, filter garansi, sorting, dan pilihan plan/durasi.
- Keranjang belanja, checkout, invoice, detail pembayaran, QRIS, dan link konfirmasi WhatsApp.
- Panel admin untuk produk, plan & durasi, promo, order, reseller, review, dan request produk.
- Auth admin/reseller memakai Firebase Authentication.
- Data utama tersimpan di Firestore dengan fallback cache lokal di `localStorage`.
- Deploy siap untuk Netlify lewat `netlify.toml`.

## Tech Stack

- React 19
- Vite 8
- Tailwind CSS
- Firebase Auth + Firestore
- Lucide React

## Menjalankan Project

```bash
npm install
npm run dev
```

Default dev server Vite biasanya berjalan di:

```text
http://localhost:5173
```

Build production:

```bash
npm run build
```

Preview hasil build:

```bash
npm run preview
```

Lint:

```bash
npm run lint
```

## Environment

Salin `.env.example` menjadi `.env`, lalu isi konfigurasi Firebase.

```env
VITE_GOOGLE_CLIENT_ID=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_ADMIN_EMAIL=
```

`VITE_FIREBASE_ADMIN_EMAIL` adalah email yang dianggap sebagai admin saat login. User lain akan diperlakukan sebagai reseller.

## Firebase

Aktifkan layanan berikut di Firebase project:

- Authentication: Email/Password
- Authentication: Google, jika tombol login Google ingin dipakai
- Firestore Database

Firestore dipakai untuk koleksi:

- `products`
- `promos`
- `orders`
- `resellers`
- `reviews`
- `productRequests`
- `appConfig`

Jika Firestore belum berisi produk, app akan memakai seed produk dari `src/features/palugada/constants.js`, lalu menyimpannya ke storage.

## Admin

Admin masuk memakai Firebase Auth dengan email yang sama seperti `VITE_FIREBASE_ADMIN_EMAIL`.

Panel admin dapat mengelola:

- Produk, termasuk plan, durasi, harga opsi, harga lama, stok, ikon, warna, fitur, dan deskripsi.
- Promo per produk, plan, atau opsi durasi.
- Order dan status order.
- Reseller dan tier diskon.
- Review pelanggan.
- Request produk dari storefront.

## Pembayaran

Metode pembayaran didefinisikan di:

```text
src/features/palugada/constants.js
```

Asset QRIS aktif berada di:

```text
public/payments/qris-palugada.jpeg
```

Jika QRIS diganti, pakai nama file yang sama atau sesuaikan path `PAYMENT_DETAILS.QRIS.image`.

## Struktur Penting

```text
src/palugada.jsx
src/features/palugada/constants.js
src/features/palugada/components/storefront.jsx
src/features/palugada/components/admin.jsx
src/features/palugada/components/auth.jsx
src/features/palugada/components/reseller.jsx
src/features/palugada/lib/firebase.js
src/features/palugada/lib/storage.js
public/payments/qris-palugada.jpeg
```

## Deploy Netlify

Konfigurasi deploy ada di `netlify.toml`.

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

Tambahkan semua variable `.env` ke Environment Variables di Netlify sebelum deploy production.
