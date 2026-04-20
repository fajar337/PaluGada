# Palugada

Frontend toko aplikasi premium berbasis React + Vite.

## Menjalankan project

```bash
npm install
npm run dev
```

## Login Google

Fitur `Masuk dengan Google` memakai Google Identity Services.

Tambahkan `.env` berikut:

```env
VITE_GOOGLE_CLIENT_ID=your-google-web-client-id.apps.googleusercontent.com
```

Catatan:
- Gunakan OAuth Client ID tipe Web dari Google Cloud Console.
- Tambahkan origin development, misalnya `http://localhost:5173`, ke daftar Authorized JavaScript origins.
- Pada implementasi sekarang, hasil login Google dipakai untuk membuat atau menghubungkan akun reseller di `localStorage`.
- Untuk production, ID token Google sebaiknya diverifikasi juga di backend.
