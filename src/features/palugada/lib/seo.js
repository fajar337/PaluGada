export const SITE_NAME = "Palugada Premium";
export const SITE_ORIGIN = "https://palugadapremium.my.id";
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-palugada-premium.jpg`;
export const DEFAULT_LOCALE = "id";
export const SUPPORTED_LOCALES = ["id", "jp"];

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
      "Garansi hanya berlaku untuk plan bertanda Garansi atau Fullgar selama dua pertiga durasi paket, dibulatkan ke bawah. Plan No Garansi atau Nogar tidak bergaransi. Klaim yang memenuhi ketentuan dapat menerima penggantian atau refund 50% dari nilai produk.",
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

export const STORE_FAQS_JA = [
  { id: "faq", eyebrow: "よくある質問", title: "商品はどのように届きますか？", question: "商品はどのように届きますか？", answer: "入金確認後、アカウントまたはアクセス情報をWhatsAppでお送りします。" },
  { id: "cara-order", eyebrow: "注文方法", title: "注文の流れを教えてください", question: "注文の流れを教えてください", answer: "商品、プラン、期間を選び、購入者情報と支払い方法を入力してください。その後WhatsAppで支払い明細を送信します。" },
  { id: "garansi", eyebrow: "保証", title: "保証はありますか？", question: "保証はありますか？", answer: "保証内容はプランごとに異なります。商品ページのプラン名とストアポリシーをご確認ください。" },
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

export function getViewPath(view, product = null, currentSearch = "", locale = DEFAULT_LOCALE) {
  const safeLocale = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;

  if (view === "detail" && product) {
    return `/${safeLocale}/produk/${slugifyProduct(product.name)}/`;
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
  if (view.startsWith("admin")) {
    return path;
  }

  const localizedPath = `/${safeLocale}${path}`;
  return view === "home" && currentSearch ? `${localizedPath}?q=${encodeURIComponent(currentSearch)}` : localizedPath;
}

export function getRouteState(pathname = "/") {
  const normalizedPath = `/${String(pathname).replace(/^\/+|\/+$/g, "")}`;
  const localeMatch = normalizedPath.match(/^\/(id|jp)(?=\/|$)/);
  const locale = localeMatch?.[1] || DEFAULT_LOCALE;
  const routePath = localeMatch ? normalizedPath.slice(localeMatch[0].length) || "/" : normalizedPath;

  if (routePath.startsWith("/produk/")) {
    return {
      locale,
      view: "detail",
      activeProductSlug: decodeURIComponent(routePath.slice("/produk/".length)),
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

  return { locale, view: views[routePath] || "home" };
}

export function absoluteUrl(path = "/") {
  return new URL(path, `${SITE_ORIGIN}/`).toString();
}
