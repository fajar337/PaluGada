import { Tv, Music, Video, Brain, Palette, Cloud } from "lucide-react";

export const RESELLER_TIERS = {
  Bronze: { min: 0, discount: 0.05, color: "#cd7f32" },
  Silver: { min: 500000, discount: 0.08, color: "#a8a8a8" },
  Gold: { min: 2000000, discount: 0.1, color: "#c89b3c" },
};

export const NETFLIX_PLANS = [
  {
    id: "sharing-1p1u",
    name: "SHARING 1P1U",
    options: [
      { id: "1-bulan", duration: "1 Bulan", price: 35000 },
      { id: "2-bulan", duration: "2 Bulan", price: 55000 },
      { id: "3-bulan", duration: "3 Bulan", price: 75000 },
      { id: "4-bulan", duration: "4 Bulan", price: 90000 },
      { id: "6-bulan", duration: "6 Bulan", price: 125000 },
    ],
  },
  {
    id: "sharing-1p2u",
    name: "SHARING 1P2U",
    options: [
      { id: "1-bulan", duration: "1 Bulan", price: 25000 },
      { id: "2-bulan", duration: "2 Bulan", price: 35000 },
      { id: "3-bulan", duration: "3 Bulan", price: 40000 },
    ],
  },
  {
    id: "semi-private",
    name: "SEMI PRIVATE",
    options: [
      { id: "1-bulan", duration: "1 Bulan", price: 40000 },
      { id: "2-bulan", duration: "2 Bulan", price: 65000 },
      { id: "3-bulan", duration: "3 Bulan", price: 87000 },
    ],
  },
  {
    id: "semi-private-vpn",
    name: "SEMI PRIVATE VPN",
    options: [
      { id: "1-bulan", duration: "1 Bulan", price: 20000 },
      { id: "3-bulan", duration: "3 Bulan", price: 30000 },
    ],
  },
  {
    id: "private-account",
    name: "PRIVATE ACCOUNT",
    options: [
      { id: "1-bulan", duration: "1 Bulan", price: 150000 },
      { id: "2-bulan", duration: "2 Bulan", price: 275000 },
      { id: "3-bulan", duration: "3 Bulan", price: 400000 },
    ],
  },
];

export const CAPCUT_PLANS = [
  {
    id: "private-fullgar",
    name: "PRIVATE FULLGAR",
    options: [
      { id: "30-day", duration: "30 Day", price: 18000 },
      { id: "35-day", duration: "35 Day", price: 20000 },
      { id: "42-day", duration: "42 Day", price: 25000 },
      { id: "180-day", duration: "180 Day", price: 110000 },
    ],
  },
  {
    id: "sharing-2u",
    name: "SHARING 2U",
    options: [
      { id: "35-day", duration: "35 Day", price: 9000 },
      { id: "42-day", duration: "42 Day", price: 11000 },
    ],
  },
];

export const CANVA_PLANS = [
  {
    id: "member",
    name: "MEMBER",
    options: [
      { id: "1-bulan", duration: "1 Bulan", price: 15000 },
      { id: "lifetime-edu", duration: "Lifetime Edu", price: 20000 },
    ],
  },
  {
    id: "admin-member",
    name: "ADMIN MEMBER",
    options: [
      { id: "lifetime-edu", duration: "Lifetime Edu - Bisa invite 100 member", price: 45000 },
    ],
  },
  {
    id: "admin-head",
    name: "ADMIN HEAD",
    options: [
      { id: "1-bulan", duration: "1 Bulan - Bisa invite 100 member", price: 20000 },
      { id: "lifetime-edu", duration: "Lifetime Edu - Bisa invite 500 member", price: 100000 },
    ],
  },
];

export const CHATGPT_PLANS = [
  {
    id: "head-team",
    name: "HEAD TEAM",
    options: [
      { id: "1-month-garansi", duration: "1 Month Garansi", price: 70000 },
      { id: "1-month-no-garansi", duration: "1 Month No Garansi", price: 60000 },
    ],
  },
  {
    id: "plus",
    name: "PLUS",
    options: [
      { id: "1-month-garansi", duration: "1 Month Garansi", price: 60000 },
      { id: "1-month-no-garansi", duration: "1 Month No Garansi", price: 50000 },
    ],
  },
  {
    id: "via-invite",
    name: "VIA INVITE",
    options: [
      { id: "1-month-fullgar", duration: "1 Month Fullgarr", price: 35000 },
      { id: "2-week-fullgar", duration: "2 Week Fullgarr", price: 20000 },
      { id: "1-week-fullgar", duration: "1 Week Fullgarr", price: 15000 },
    ],
  },
  {
    id: "chatgpt-go",
    name: "CHATGPT GO",
    options: [
      { id: "1-year-garansi", duration: "1 Year Garansi", price: 90000 },
    ],
  },
];

export const SPOTIFY_PLANS = [
  {
    id: "indplan",
    name: "INDPLAN",
    options: [
      { id: "1-bulan-fullgar", duration: "1 Bulan Fullgarr", price: 20000 },
      { id: "1-bulan-nogar", duration: "1 Bulan Nogarrr", price: 15000 },
      { id: "2-bulan-fullgar", duration: "2 Bulan Fullgarr", price: 25000 },
      { id: "2-bulan-nogar", duration: "2 Bulan Nogarr", price: 20000 },
      { id: "3-bulan-fullgar", duration: "3 Bulan Fullgarr", price: 38000 },
    ],
  },
  {
    id: "famplan",
    name: "FAMPLAN",
    options: [
      { id: "1-bulan-fullgar", duration: "1 Bulan Fullgarr", price: 25000 },
      { id: "2-bulan-fullgar", duration: "2 Bulan Fullgarr", price: 30000 },
    ],
  },
];

export const YOUTUBE_PLANS = [
  {
    id: "via-invite-1b",
    name: "VIA INVITE [1B]",
    options: [
      { id: "email-sendiri-fullgar", duration: "Email Sendiri - 1 Bulan Full Garansi", price: 5000 },
      { id: "email-seller-fullgar", duration: "Email Seller - 1 Bulan Full Garansi", price: 8000 },
    ],
  },
  {
    id: "youtube-gsuite-1b",
    name: "YOUTUBE GSUITE [1B]",
    options: [
      { id: "individu-fullgar", duration: "Individu - 1 Bulan Full Garansi", price: 10000 },
    ],
  },
  {
    id: "youtube-indplan-3b-nogar",
    name: "YOUTUBE INDPLAN [3B] - NOGAR",
    options: [
      { id: "email-seller-nogar", duration: "Email Seller - 3 Bulan Nogaransi", price: 20000 },
    ],
  },
  {
    id: "youtube-indplan-3b-garansi-1b",
    name: "YOUTUBE INDPLAN [3B] - GARANSI 1 BULAN",
    options: [
      { id: "email-seller-garansi-1b", duration: "Email Seller - 3 Bulan Garansi 1 Bulan", price: 30000 },
    ],
  },
  {
    id: "youtube-indplan-3b-fullgar",
    name: "YOUTUBE INDPLAN [3B] - FULL GARANSI",
    options: [
      { id: "email-seller-fullgar", duration: "Email Seller - 3 Bulan Full Garansi", price: 50000 },
    ],
  },
];

export const SEED_PRODUCTS = [
  {
    id: "p_netflix",
    name: "Netflix Premium",
    category: "Streaming",
    icon: "tv",
    color: "#E50914",
    price: 20000,
    oldPrice: 65000,
    stock: 24,
    duration: "Pilih Durasi",
    tagline: "Sharing, Semi Private, Private",
    description:
      "Netflix Premium dengan pilihan plan fleksibel: Sharing 1P1U, Sharing 1P2U, Semi Private, Semi Private VPN, dan Private Account.",
    features: [
      "REQ profile + PIN +2K",
      "1P2U: 1 profile 2 user",
      "1P1U: 1 profile 1 user",
      "Private: 1 akun 5 profile",
      "Full garansi selama durasi",
      "Strong account hasil PPJ AN",
      "Hasil maker sendiri",
    ],
    pricingPlans: NETFLIX_PLANS,
  },
  {
    id: "p_capcut",
    name: "CapCut Pro",
    category: "Editor",
    icon: "video",
    color: "#00C2FF",
    price: 9000,
    oldPrice: 55000,
    stock: 40,
    duration: "Pilih Durasi",
    tagline: "Private Fullgar, Sharing 2U",
    description:
      "CapCut Pro dengan email sudah disediakan seller, tinggal pakai. Pilih plan Private Fullgar atau Sharing 2U sesuai kebutuhan.",
    features: [
      "Email sudah disediakan seller",
      "Login only 1 device",
      "Garansi apabila account error atau backfree",
      "Maksimum number of attempts reset password agar bisa login",
      "Semua fitur PRO terbuka",
    ],
    pricingPlans: CAPCUT_PLANS,
  },
  {
    id: "p_yt",
    name: "YouTube Premium",
    category: "Streaming",
    icon: "video",
    color: "#FF0000",
    price: 5000,
    oldPrice: 59000,
    stock: 35,
    duration: "Pilih Durasi",
    tagline: "Invite, GSuite, INDPLAN",
    description:
      "YouTube Premium dengan pilihan Via Invite, GSuite, dan INDPLAN. Pilih paket sesuai email dan kebutuhan garansi.",
    features: [
      "Khusus email buyer wajib fresh / belum pernah premium",
      "Garansi apabila account terkena back free",
      "Disable account / ke non Gmail tidak termasuk garansi",
      "Bebas iklan",
      "Background play",
      "Download offline",
      "YouTube Music included",
    ],
    pricingPlans: YOUTUBE_PLANS,
  },
  {
    id: "p_spotify",
    name: "Spotify Premium",
    category: "Music",
    icon: "music",
    color: "#1DB954",
    price: 15000,
    oldPrice: 54000,
    stock: 50,
    duration: "Pilih Durasi",
    tagline: "INDPLAN, FAMPLAN",
    description:
      "Spotify Premium dengan pilihan INDPLAN dan FAMPLAN. Cocok untuk akun seller dengan opsi fullgaransi atau nogaransi.",
    features: [
      "Akun seller",
      "Fullgaransi apabila mematuhi SNK yang berlaku",
      "Garansi backfree only",
      "Suspend account tanggung sendiri",
      "No ads",
      "Skip unlimited",
      "Offline mode",
    ],
    pricingPlans: SPOTIFY_PLANS,
  },
  {
    id: "p_chatgpt",
    name: "ChatGPT Plus",
    category: "AI",
    icon: "brain",
    color: "#10A37F",
    price: 15000,
    oldPrice: 320000,
    stock: 12,
    duration: "Pilih Durasi",
    tagline: "Head Team, Plus, Invite, Go",
    description:
      "ChatGPT dengan pilihan Head Team, Plus, Via Invite, dan ChatGPT Go. Pilih paket sesuai kebutuhan akses dan garansi.",
    features: [
      "Bill PayPal & VCC",
      "Garansi 25Day sebelum deactive",
      "ChatGPT Go garansi 10Day",
      "Full garansi private",
      "Akses ke model yang lebih canggih",
      "Limit pesan yang lebih longgar",
      "Memori percakapan panjang",
      "Akses prioritas",
      "Pembuatan gambar (Image Generation)",
    ],
    pricingPlans: CHATGPT_PLANS,
  },
  {
    id: "p_canva",
    name: "Canva Pro",
    category: "Design",
    icon: "palette",
    color: "#7c3aed",
    price: 15000,
    oldPrice: 75000,
    stock: 28,
    duration: "Pilih Durasi",
    tagline: "Member, Admin Member, Admin Head",
    description:
      "Canva Premium dengan pilihan member sampai admin head. Cocok untuk kebutuhan pribadi, invite member, atau kelola tim besar.",
    features: [
      "25-30 hari dihitung 1 bulan",
      "Canva owner bisa invite 100 orang",
      "Canva member invite via email",
      "Jika ingin perpanjang, beritahu admin sebelum waktu berakhir",
      "Lifetime edu garansi 3 bulan",
      "30 Day FullGaransi",
    ],
    pricingPlans: CANVA_PLANS,
  },
];

export const ICONS = {
  tv: Tv,
  music: Music,
  video: Video,
  brain: Brain,
  palette: Palette,
  cloud: Cloud,
};

export const fmtIDR = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");

export function getDefaultPlanSelection(product) {
  const plan = product?.pricingPlans?.[0];
  const option = plan?.options?.[0];

  if (!plan || !option) {
    return null;
  }

  return { planId: plan.id, optionId: option.id };
}

export function getPlanSelection(product, planId, optionId) {
  const plan = product?.pricingPlans?.find((item) => item.id === planId) || product?.pricingPlans?.[0];
  const option = plan?.options?.find((item) => item.id === optionId) || plan?.options?.[0];

  if (!plan || !option) {
    return null;
  }

  return { plan, option };
}

export function getMatchingPromo(promos = [], product, planId = null, optionId = null) {
  if (!product?.id) {
    return null;
  }

  const candidates = promos.filter((promo) => {
    if (!promo?.active || promo.productId !== product.id) {
      return false;
    }

    if (promo.optionId) {
      return promo.planId === planId && promo.optionId === optionId;
    }

    if (promo.planId) {
      return promo.planId === planId;
    }

    return true;
  });

  if (!candidates.length) {
    return null;
  }

  const getScore = (promo) => {
    if (promo.optionId) return 3;
    if (promo.planId) return 2;
    return 1;
  };

  return candidates.sort((first, second) => getScore(second) - getScore(first))[0] || null;
}

export function getPricingForSelection(product, promos = [], selection = null) {
  const resolvedSelection =
    selection?.plan && selection?.option
      ? selection
      : getPlanSelection(product, selection?.planId, selection?.optionId);

  const planId = resolvedSelection?.plan?.id || selection?.planId || null;
  const optionId = resolvedSelection?.option?.id || selection?.optionId || null;
  const basePrice = Number(resolvedSelection?.option?.price ?? product?.price ?? 0);
  const defaultCompareAt = Number(product?.oldPrice ?? basePrice);
  const promo = getMatchingPromo(promos, product, planId, optionId);
  const promoPrice = Number(promo?.promoPrice ?? 0);
  const promoCompareAt = Number(promo?.compareAtPrice ?? 0);
  const displayPrice = promoPrice > 0 ? promoPrice : basePrice;
  const compareAt =
    promoCompareAt > 0
      ? promoCompareAt
      : promoPrice > 0
        ? Math.max(basePrice, defaultCompareAt, displayPrice)
        : defaultCompareAt;

  return {
    promo,
    selection: resolvedSelection,
    planId,
    optionId,
    basePrice,
    displayPrice,
    compareAt,
  };
}

export function getProductStartingPrice(product, promos = []) {
  if (!product?.pricingPlans?.length) {
    return getPricingForSelection(product, promos).displayPrice;
  }

  return Math.min(
    ...product.pricingPlans.flatMap((plan) =>
      plan.options.map((option) => getPricingForSelection(product, promos, { plan, option }).displayPrice)
    )
  );
}

export function getProductStartingCompareAt(product, promos = []) {
  if (!product?.pricingPlans?.length) {
    return getPricingForSelection(product, promos).compareAt;
  }

  const allPrices = product.pricingPlans.flatMap((plan) =>
    plan.options.map((option) => getPricingForSelection(product, promos, { plan, option }))
  );
  const best = allPrices.sort((first, second) => first.displayPrice - second.displayPrice)[0];
  return best?.compareAt || best?.displayPrice || 0;
}

export const ADMIN_WHATSAPP_NUMBER = "6289513947458";
export const INSTAGRAM_URL = "https://www.instagram.com/fjr.muustafa";
export const CONTACT_EMAIL = "mustofafajar733@gmail.com";

export const PAYMENT_METHODS = ["DANA", "OVO", "GoPay", "ShopeePay", "SeaBank", "QRIS"];

export const PAYMENT_DETAILS = {
  DANA: {
    label: "DANA",
    accountName: "Fajar Mustofa",
    accountNumber: "089513947458",
    instruction: "Transfer ke nomor DANA berikut.",
  },
  OVO: {
    label: "OVO",
    accountName: "Fajar Mustofa",
    accountNumber: "089513947458",
    instruction: "Transfer ke nomor OVO berikut.",
  },
  GoPay: {
    label: "GoPay",
    accountName: "Fajar Mustofa",
    accountNumber: "089513947458",
    instruction: "Transfer ke nomor GoPay berikut.",
  },
  ShopeePay: {
    label: "ShopeePay",
    accountName: "Fajar Mustofa",
    accountNumber: "089513947458",
    instruction: "Transfer ke nomor ShopeePay berikut.",
  },
  SeaBank: {
    label: "SeaBank",
    accountName: "Fajar Mustofa",
    accountNumber: "901841783594",
    instruction: "Transfer ke rekening SeaBank berikut.",
  },
  QRIS: {
    label: "QRIS",
    accountName: "JAR STORE",
    accountNumber: "NMID: ID1026487245338",
    instruction: "Scan QRIS berikut dari aplikasi pembayaran kamu.",
    image: "/payments/qris-palugada.jpeg",
  },
};

export const getPaymentDetail = (method) => PAYMENT_DETAILS[method] || PAYMENT_DETAILS.DANA;

export function getWhatsAppConfirmationUrl(order) {
  const payment = getPaymentDetail(order.buyer.method);
  const items = order.items
    .map((item) => `- ${item.qty}x ${item.name}${item.plan ? ` - ${item.plan} (${item.duration})` : ""}`)
    .join("\n");
  const message = [
    "Halo admin Palugada, saya ingin konfirmasi pembayaran.",
    "",
    `Order ID: ${order.id}`,
    `Nama: ${order.buyer.name}`,
    `WhatsApp: ${order.buyer.wa}`,
    `Metode: ${order.buyer.method}`,
    `Atas Nama: ${payment.accountName}`,
    `Tujuan: ${payment.accountNumber}`,
    `Total: ${fmtIDR(order.total)}`,
    "",
    "Produk:",
    items,
    "",
    "Saya akan kirim bukti transfer di chat ini.",
  ].join("\n");

  return `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
