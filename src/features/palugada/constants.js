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
    id: "private-reg-id",
    name: "PRIVATE REG ID",
    options: [
      { id: "30-hari", duration: "30 Hari", price: 30000, stock: 0 },
      { id: "7-hari", duration: "7 Hari", price: 15000, stock: 0 },
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
    id: "p_disney",
    name: "Disney+ Premium",
    category: "Streaming",
    icon: "tv",
    color: "#113CCF",
    price: 22000,
    oldPrice: 22000,
    stock: 0,
    duration: "Pilih Durasi",
    tagline: "Sharing 6 User • 1 User 1 Device",
    description:
      "Disney+ Premium Sharing 6 User untuk 1 bulan. Setiap user memakai 1 perangkat agar terhindar dari screen limit, dengan OTP manual dan full garansi.",
    features: [
      "Kualitas gambar hingga 4K Ultra HD",
      "Mendukung HDR dan Dolby Vision pada perangkat kompatibel",
      "Bebas iklan",
      "Mendukung download untuk ditonton offline",
      "1 user hanya untuk 1 perangkat",
      "Full garansi selama durasi",
      "Bisa diperpanjang",
      "OTP manual, mohon tidak terburu-buru",
    ],
    pricingPlans: [
      {
        id: "sharing-6-user",
        name: "SHARING 6 USER",
        options: [
          {
            id: "1-bulan-full-garansi",
            duration: "1 Bulan - Full Garansi",
            price: 22000,
            stock: 0,
          },
        ],
      },
    ],
  },
  {
    id: "p_prime_video",
    name: "Prime Video Premium",
    category: "Streaming",
    icon: "tv",
    color: "#00A8E1",
    price: 25000,
    oldPrice: 25000,
    stock: 44,
    duration: "Pilih Durasi",
    tagline: "Private Account • Sharing 1P1U • Full Garansi",
    description:
      "Prime Video untuk 1 bulan dengan pilihan Private Account atau Sharing 1 Profile 1 User. Tersedia full garansi selama durasi.",
    features: [
      "Akses email gratis",
      "Private account",
      "Fresh bill 25-30 hari",
      "Full garansi selama durasi",
      "Tayangan hingga 4K HDR pada perangkat kompatibel",
      "Fitur X-Ray untuk melihat informasi pemeran dan lagu",
      "Bebas iklan",
      "Mendukung download untuk ditonton offline",
    ],
    pricingPlans: [
      {
        id: "private-account",
        name: "PRIVATE ACCOUNT",
        options: [
          {
            id: "1-bulan-full-garansi",
            duration: "1 Bulan - Full Garansi",
            price: 25000,
            stock: 22,
          },
        ],
      },
      {
        id: "sharing-1p1u",
        name: "SHARING 1 PROFILE 1 USER",
        options: [
          {
            id: "1-bulan-full-garansi",
            duration: "1 Bulan - Full Garansi",
            price: 12000,
            stock: 22,
          },
        ],
      },
    ],
  },
  {
    id: "p_hbo_max",
    name: "HBO Max Standard",
    category: "Streaming",
    icon: "tv",
    color: "#5822B4",
    price: 35000,
    oldPrice: 35000,
    stock: 504,
    duration: "Pilih Durasi",
    tagline: "Private • Sharing 1P1U • Full Garansi",
    description:
      "HBO Max Standard untuk 1 bulan dengan pilihan Private Account atau Sharing 1 Profile 1 User. Akun siap digunakan dan mendapat full garansi.",
    features: [
      "Plan Standard dengan maksimal 2 layar",
      "Kualitas Full HD 1080p",
      "Akun siap digunakan",
      "Akses email untuk paket Private",
      "Dapat login hingga 10 perangkat",
      "Full garansi selama 1 bulan",
      "Bisa diperpanjang pada akun yang sama selama akun masih aktif",
    ],
    pricingPlans: [
      {
        id: "private-account",
        name: "PRIVATE ACCOUNT",
        options: [
          {
            id: "1-bulan-full-garansi",
            duration: "1 Bulan - Full Garansi",
            price: 35000,
            stock: 252,
          },
        ],
      },
      {
        id: "sharing-1p1u",
        name: "SHARING 1 PROFILE 1 USER",
        options: [
          {
            id: "1-bulan-full-garansi",
            duration: "1 Bulan - Full Garansi",
            price: 20000,
            stock: 252,
          },
        ],
      },
    ],
  },
  {
    id: "p_capcut",
    name: "CapCut Pro",
    category: "Editor",
    icon: "video",
    color: "#00C2FF",
    price: 15000,
    oldPrice: 30000,
    stock: 0,
    duration: "Pilih Durasi",
    tagline: "Private REG ID • 7 Hari & 30 Hari",
    description:
      "CapCut Pro Private region Indonesia dengan pilihan akses 7 hari atau 30 hari. Pilih durasi sesuai kebutuhan editing.",
    features: [
      "Akun private region Indonesia",
      "Login hanya di 1 perangkat",
      "Semua fitur Pro terbuka",
      "Ekspor video tanpa watermark",
      "Akses template, filter, dan efek premium",
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
  {
    id: "p_viu",
    name: "Viu Premium",
    category: "Streaming",
    icon: "tv",
    color: "#F4B600",
    price: 1000,
    stock: 0,
    duration: "Pilih Durasi",
    tagline: "Premium 1 Tahun • Lifetime Anti Limit",
    taglineJa: "1年プラン・無期限プラン",
    description: "Viu Premium tersedia dalam paket Premium 1 Tahun dan Lifetime Anti Limit. Pilih paket yang sesuai sebelum memesan.",
    descriptionJa: "Viu Premiumは1年プランと無期限・制限なしプランから選べます。ご注文前にプランをご確認ください。",
    features: [
      "Pilihan paket Premium 1 Tahun atau Lifetime Anti Limit",
      "Informasi akses diberikan melalui WhatsApp setelah pembayaran dikonfirmasi",
    ],
    featuresJa: [
      "1年プランまたは無期限・制限なしプランを選択可能",
      "お支払い確認後、WhatsAppでアクセス情報をお送りします",
    ],
    pricingPlans: [
      {
        id: "premium-1-tahun",
        name: "PREMIUM 1 TAHUN",
        nameJa: "プレミアム 1年",
        options: [{ id: "1-tahun", duration: "1 Tahun", durationJa: "1年", price: 1000, stock: 0 }],
      },
      {
        id: "lifetime-anti-limit",
        name: "LIFETIME ANTI LIMIT",
        nameJa: "無期限・制限なし",
        options: [{ id: "lifetime", duration: "Lifetime", durationJa: "無期限", price: 2000, stock: 0 }],
      },
    ],
  },
  {
    id: "p_getcontact",
    name: "Getcontact Pro",
    category: "Utilities",
    categoryJa: "ユーティリティ",
    icon: "cloud",
    color: "#635BFF",
    price: 5000,
    stock: 0,
    duration: "1 Bulan",
    durationJa: "1か月",
    tagline: "Akses Pro selama 1 bulan",
    taglineJa: "Proプラン・1か月",
    description: "Getcontact Pro dengan masa akses 1 bulan. Informasi aktivasi dan ketentuan penggunaan diberikan setelah pesanan dikonfirmasi.",
    descriptionJa: "Getcontact Proの1か月プランです。ご注文確認後、利用開始方法とご利用条件をご案内します。",
    features: [
      "Masa akses 1 bulan",
      "Informasi aktivasi diberikan melalui WhatsApp setelah pembayaran dikonfirmasi",
    ],
    featuresJa: [
      "利用期間は1か月",
      "お支払い確認後、WhatsAppで利用開始方法をご案内します",
    ],
    pricingPlans: [{
      id: "pro",
      name: "PRO",
      nameJa: "Proプラン",
      options: [{ id: "1-bulan", duration: "1 Bulan", durationJa: "1か月", price: 5000, stock: 0 }],
    }],
  },
  {
    id: "p_vidio",
    name: "Vidio",
    category: "Streaming",
    icon: "tv",
    color: "#E62575",
    price: 6500,
    stock: 0,
    duration: "Pilih Durasi",
    tagline: "Mobile • All Device • TV",
    taglineJa: "モバイル・全デバイス・テレビ",
    description: "Vidio Platinum tersedia dalam pilihan Mobile 1 Bulan, All Device 1 Bulan, dan TV 1 Tahun. Periksa jenis perangkat dan durasi sebelum memilih paket.",
    descriptionJa: "Vidio Platinumはモバイル1か月、全デバイス1か月、テレビ1年から選べます。ご注文前に対応デバイスと利用期間をご確認ください。",
    features: [
      "Pilihan paket Mobile, All Device, atau TV",
      "Masa akses mengikuti durasi paket yang dipilih",
      "Informasi akses diberikan melalui WhatsApp setelah pembayaran dikonfirmasi",
    ],
    featuresJa: [
      "モバイル、全デバイス、テレビのプランから選択可能",
      "利用期間は選択したプランに準じます",
      "お支払い確認後、WhatsAppでアクセス情報をお送りします",
    ],
    pricingPlans: [
      {
        id: "platinum-mobile",
        name: "PLATINUM MOBILE",
        nameJa: "プラチナ・モバイル",
        options: [{ id: "1-bulan", duration: "1 Bulan", durationJa: "1か月", price: 21800, stock: 0 }],
      },
      {
        id: "platinum-all-device",
        name: "PLATINUM ALL DEVICE",
        nameJa: "プラチナ・全デバイス",
        options: [{ id: "1-bulan", duration: "1 Bulan", durationJa: "1か月", price: 36000, stock: 0 }],
      },
      {
        id: "platinum-tv",
        name: "PLATINUM TV",
        nameJa: "プラチナ・テレビ",
        options: [{ id: "1-tahun", duration: "1 Tahun", durationJa: "1年", price: 6500, stock: 0 }],
      },
    ],
  },
  {
    id: "p_gemini",
    name: "Gemini Pro",
    category: "AI",
    icon: "brain",
    color: "#4285F4",
    price: 10000,
    stock: 0,
    duration: "Pilih Durasi",
    tagline: "Head • Jaspay • Invite • Link",
    taglineJa: "管理者・Jaspay・招待・リンク",
    description: "Gemini Pro tersedia dalam pilihan Head, Jaspay, Invite, dan Link. Paket 1 tahun dan 18 bulan mencakup Google Drive 5 TB.",
    descriptionJa: "Gemini Proは管理者、Jaspay、招待、リンクの各プランから選べます。1年プランと18か月プランにはGoogleドライブ5 TBが含まれます。",
    features: [
      "Pilihan durasi 1 bulan, 4 bulan, 1 tahun, atau 18 bulan",
      "Google Drive 5 TB untuk paket 1 tahun dan 18 bulan",
      "Informasi akses diberikan melalui WhatsApp setelah pembayaran dikonfirmasi",
    ],
    featuresJa: [
      "1か月、4か月、1年、18か月のプランから選択可能",
      "1年プランと18か月プランはGoogleドライブ5 TB",
      "お支払い確認後、WhatsAppでアクセス情報をお送りします",
    ],
    pricingPlans: [
      {
        id: "head",
        name: "GEMINI HEAD",
        nameJa: "Gemini 管理者",
        options: [
          { id: "1-bulan-fullgar", duration: "1 Bulan - Full Garansi", durationJa: "1か月・全期間保証", price: 10000, stock: 0 },
          { id: "4-bulan", duration: "4 Bulan", durationJa: "4か月", price: 25000, stock: 0 },
          { id: "1-tahun", duration: "1 Tahun + Google Drive 5 TB", durationJa: "1年・Googleドライブ 5 TB", price: 75000, stock: 0 },
        ],
      },
      {
        id: "jaspay",
        name: "JASPAY GEMINI PRO",
        nameJa: "Jaspay Gemini Pro",
        options: [{ id: "1-tahun", duration: "1 Tahun + Google Drive 5 TB", durationJa: "1年・Googleドライブ 5 TB", price: 40000, stock: 0 }],
      },
      {
        id: "invite",
        name: "GEMINI INVITE",
        nameJa: "Gemini 招待",
        options: [{ id: "1-tahun", duration: "1 Tahun + Google Drive 5 TB", durationJa: "1年・Googleドライブ 5 TB", price: 15000, stock: 0 }],
      },
      {
        id: "link",
        name: "LINK GEMINI PRO",
        nameJa: "Gemini Pro リンク",
        options: [{ id: "18-bulan", duration: "18 Bulan + Google Drive 5 TB", durationJa: "18か月・Googleドライブ 5 TB", price: 15000, stock: 0 }],
      },
    ],
  },
];

export const AUTO_SYNC_SEED_PRODUCT_IDS = ["p_disney", "p_prime_video", "p_hbo_max", "p_viu", "p_getcontact", "p_vidio", "p_gemini"];

export const ICONS = {
  tv: Tv,
  music: Music,
  video: Video,
  brain: Brain,
  palette: Palette,
  cloud: Cloud,
};

export const fmtIDR = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");

export const getCurrency = (locale = "id") => locale === "jp" ? "JPY" : "IDR";

export const fmtCurrency = (value, currencyOrLocale = "IDR") => {
  const currency = currencyOrLocale === "jp" ? "JPY" : currencyOrLocale === "id" ? "IDR" : currencyOrLocale;
  return new Intl.NumberFormat(currency === "JPY" ? "ja-JP" : "id-ID", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
};

export function getFallbackJpyPrice(idrPrice) {
  const converted = Math.ceil(Math.max(0, Number(idrPrice) || 0) / 100);
  return converted > 0 ? Math.max(100, Math.ceil(converted / 10) * 10) : 0;
}

export function getLocalizedAmount(jpyAmount, idrAmount, locale = "id") {
  if (locale !== "jp") {
    return Math.max(0, Number(idrAmount) || 0);
  }

  const configured = Math.max(0, Number(jpyAmount) || 0);
  return configured > 0 ? configured : getFallbackJpyPrice(idrAmount);
}

export function hasOptionLevelStock(product) {
  return (product?.pricingPlans || [])
    .flatMap((plan) => plan.options || [])
    .some((option) => option.stock !== undefined && option.stock !== null);
}

export function getProductTotalStock(product) {
  if (!hasOptionLevelStock(product)) {
    return Math.max(0, Number(product?.stock) || 0);
  }

  return (product?.pricingPlans || [])
    .flatMap((plan) => plan.options || [])
    .reduce((total, option) => total + Math.max(0, Number(option.stock) || 0), 0);
}

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

export function getPricingForSelection(product, promos = [], selection = null, locale = "id") {
  const resolvedSelection =
    selection?.plan && selection?.option
      ? selection
      : getPlanSelection(product, selection?.planId, selection?.optionId);

  const planId = resolvedSelection?.plan?.id || selection?.planId || null;
  const optionId = resolvedSelection?.option?.id || selection?.optionId || null;
  const optionPrice = resolvedSelection?.option?.price ?? product?.price ?? 0;
  const basePrice = getLocalizedAmount(resolvedSelection?.option?.priceJpy ?? product?.priceJpy, optionPrice, locale);
  const defaultCompareAt = getLocalizedAmount(product?.oldPriceJpy, product?.oldPrice ?? optionPrice, locale);
  const promo = getMatchingPromo(promos, product, planId, optionId);
  const promoPrice = locale === "jp" ? Math.max(0, Number(promo?.promoPriceJpy) || 0) : Number(promo?.promoPrice ?? 0);
  const promoCompareAt = locale === "jp" ? Math.max(0, Number(promo?.compareAtPriceJpy) || 0) : Number(promo?.compareAtPrice ?? 0);
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

export function getProductStartingPrice(product, promos = [], locale = "id") {
  if (!product?.pricingPlans?.length) {
    return getPricingForSelection(product, promos, null, locale).displayPrice;
  }

  return Math.min(
    ...product.pricingPlans.flatMap((plan) =>
      plan.options.map((option) => getPricingForSelection(product, promos, { plan, option }, locale).displayPrice)
    )
  );
}

export function getProductStartingCompareAt(product, promos = [], locale = "id") {
  if (!product?.pricingPlans?.length) {
    return getPricingForSelection(product, promos, null, locale).compareAt;
  }

  const allPrices = product.pricingPlans.flatMap((plan) =>
    plan.options.map((option) => getPricingForSelection(product, promos, { plan, option }, locale))
  );
  const best = allPrices.sort((first, second) => first.displayPrice - second.displayPrice)[0];
  return best?.compareAt || best?.displayPrice || 0;
}

export const ADMIN_WHATSAPP_NUMBER = "62895372490058";
export const INSTAGRAM_URL = "https://www.instagram.com/palugada_premium/";
export const CONTACT_EMAIL = "palugadapremium@gmail.com";

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
    accountName: "PALUGADA - SOFTWARE",
    accountNumber: "NMID: ID1026515873481",
    instruction: "Scan QRIS berikut dari aplikasi pembayaran kamu.",
    image: "/payments/qris-palugada.jpeg",
  },
};

export const getPaymentDetail = (method) => PAYMENT_DETAILS[method] || PAYMENT_DETAILS.DANA;

export function getWhatsAppConfirmationUrl(order) {
  const payment = getPaymentDetail(order.buyer.method);
  const japanese = order.locale === "jp";
  const items = order.items
    .map((item) => `- ${item.qty}x ${item.name}${item.plan ? ` - ${item.plan} (${item.duration})` : ""}`)
    .join("\n");
  const message = [
    japanese ? "PaluGadaの注文のお支払いを確認していただきたいです。" : "Halo admin Palugada, saya ingin konfirmasi pembayaran.",
    "",
    `Order ID: ${order.id}`,
    `${japanese ? "お名前" : "Nama"}: ${order.buyer.name}`,
    `WhatsApp: ${order.buyer.wa}`,
    `${japanese ? "決済方法" : "Metode"}: ${order.buyer.method}`,
    `${japanese ? "口座名義" : "Atas Nama"}: ${payment.accountName}`,
    `${japanese ? "送金先" : "Tujuan"}: ${payment.accountNumber}`,
    order.coupon ? `${japanese ? "クーポン" : "Kupon"}: ${order.coupon.code} (-${fmtCurrency(order.discount, order.currency || "IDR")})` : null,
    `${japanese ? "お支払い合計" : "Total"}: ${fmtCurrency(order.total, order.currency || "IDR")}`,
    "",
    japanese ? "商品：" : "Produk:",
    items,
    "",
    japanese ? "このチャットでお支払い明細をお送りします。" : "Saya akan kirim bukti transfer di chat ini.",
  ].filter(Boolean).join("\n");

  return `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
