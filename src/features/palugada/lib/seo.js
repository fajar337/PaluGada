export const SITE_NAME = "Palugada Premium";
export const SITE_ORIGIN = "https://palugadapremium.my.id";
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-palugada-premium.jpg`;

export const STORE_FAQS = [
  {
    id: "faq",
    eyebrow: "Bantuan",
    title: "FAQ",
    question: "Bagaimana cara membeli akun premium di Palugada Premium?",
    answer:
      "Pilih produk, buat booking, bayar sesuai metode pilihan, lalu konfirmasi lewat WhatsApp. Admin akan memproses pesanan setelah pembayaran dinyatakan valid.",
  },
  {
    id: "garansi",
    eyebrow: "Garansi",
    title: "Gimana Cara Garansi",
    question: "Bagaimana cara mengajukan garansi akun premium?",
    answer:
      "Jika akun bermasalah selama masa garansi, kirim Order ID dan detail kendala melalui WhatsApp. Admin akan membantu pengecekan, penggantian, atau memandu akses ulang.",
  },
  {
    id: "cara-order",
    eyebrow: "Cara Order",
    title: "Gimana Cara Order",
    question: "Apa saja langkah untuk membuat pesanan?",
    answer:
      "Masukkan produk ke keranjang, lanjutkan checkout, isi nomor WhatsApp aktif, pilih metode pembayaran, lalu kirim bukti transfer dari halaman booking.",
  },
];

export function slugifyProduct(value = "") {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getViewPath(view, product = null, currentSearch = "") {
  if (view === "detail" && product) {
    return `/produk/${slugifyProduct(product.name)}/`;
  }

  const paths = {
    home: "/",
    cart: "/keranjang",
    "track-order": "/lacak-pesanan",
    checkout: "/checkout",
    "order-success": "/pesanan-berhasil",
    "reseller-login": "/reseller/masuk",
    "reseller-register": "/reseller/daftar/",
    "reseller-dashboard": "/reseller/dashboard",
    "admin-login": "/admin/masuk",
    admin: "/admin",
  };

  const path = paths[view] || "/";
  return view === "home" && currentSearch ? `/?q=${encodeURIComponent(currentSearch)}` : path;
}

export function getRouteState(pathname = "/") {
  const normalizedPath = `/${String(pathname).replace(/^\/+|\/+$/g, "")}`;

  if (normalizedPath.startsWith("/produk/")) {
    return {
      view: "detail",
      activeProductSlug: decodeURIComponent(normalizedPath.slice("/produk/".length)),
    };
  }

  const views = {
    "/": "home",
    "/keranjang": "cart",
    "/lacak-pesanan": "track-order",
    "/checkout": "checkout",
    "/pesanan-berhasil": "order-success",
    "/reseller/masuk": "reseller-login",
    "/reseller/daftar": "reseller-register",
    "/reseller/dashboard": "reseller-dashboard",
    "/admin/masuk": "admin-login",
    "/admin": "admin",
  };

  return { view: views[normalizedPath] || "home" };
}

export function absoluteUrl(path = "/") {
  return new URL(path, `${SITE_ORIGIN}/`).toString();
}
