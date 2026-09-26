/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";
import { fmtCurrency } from "../constants";

const LocaleContext = createContext("id");

const JA = {
  "Toko Serba Ada": "プレミアムサービスストア",
  "Selamat datang di PaluGada": "PaluGadaへようこそ",
  "Apa lu mau,": "欲しいもの、",
  "gua ada.": "ここにあります。",
  "Toko serba ada untuk aplikasi premium. Dari Netflix sampai ChatGPT, dari Spotify sampai CapCut Pro — semua ada, semua murah, semua bergaransi.": "NetflixやChatGPT、Spotify、CapCut Proまで揃うプレミアムサービスストア。お手頃価格で、保証付きです。",
  "Lihat Semua Barang": "商品を見る",
  "Atau bergabung sebagai reseller": "リセラーとして参加",
  "BEST SELLER": "人気商品",
  "Jadi reseller & dapatkan diskon hingga 10%": "リセラー登録で最大10%オフ",
  "Tier Bronze • Silver • Gold — semakin sering belanja, semakin besar margin": "Bronze・Silver・Gold — 購入額に応じて利益率が上がります",
  "Daftar Sekarang": "今すぐ登録",
  "Katalog Pilihan": "おすすめカタログ",
  "Daftar isi.": "商品一覧。",
  "Cari aplikasi premium": "プレミアムサービスを検索",
  "Cari aplikasi…": "サービスを検索…",
  "Semua": "すべて",
  "Full Garansi": "全期間保証",
  "Urutan rekomendasi": "おすすめ順",
  "Nama A–Z": "名前順",
  "Harga termurah": "価格が安い順",
  "Harga termahal": "価格が高い順",
  "Stok terbanyak": "在庫が多い順",
  "Tidak ada hasil yang ditemukan…": "該当する商品はありません…",
  "Website Tutup": "サイト休止中",
  "Order sedang dinonaktifkan.": "現在ご注文いただけません。",
  "Toko sedang tutup sementara. Silakan cek lagi nanti.": "現在一時休業中です。しばらくしてからもう一度ご確認ください。",
  "READY": "販売中", "HABIS": "売り切れ", "Durasi": "期間", "Stok": "在庫", "Mulai dari": "最低価格",
  "Lihat Detail": "詳細を見る", "Pilih Paket": "プランを選ぶ", "Pilihan kamu": "プランを選択",
  "Tambah ke Keranjang": "カートに追加", "Kembali ke katalog": "カタログへ戻る",
  "Pilih Plan & Durasi": "プランと期間を選択", "Yang Termasuk": "サービス内容", "Beli Sekarang": "今すぐ購入",
  "Keranjang": "カート", "Ulasan Pembeli": "購入者レビュー", "Tulis Ulasan": "レビューを書く",
  "Kirim Ulasan": "レビューを送信", "Nama": "お名前", "Pesan": "レビュー内容", "Belum ada ulasan.": "レビューはまだありません。",
  "Lacak Pesanan": "注文を確認", "Order ID": "注文ID", "Nomor WhatsApp": "WhatsApp番号", "Cari Pesanan": "注文を検索",
  "Pesanan tidak ditemukan": "注文が見つかりません", "Status Pesanan": "注文状況", "Data Pembeli": "購入者情報",
  "Metode Pembayaran": "お支払い方法", "Pesananmu": "ご注文内容", "Nama Lengkap": "お名前",
  "Kode Kupon": "クーポンコード", "Hapus": "削除", "Pakai": "適用", "Subtotal": "小計", "Total": "合計",
  "Membuat booking...": "注文を作成中…", "Buat Booking Pesanan": "注文を確定",
  "Booking berhasil dibuat": "注文を受け付けました", "Pesanan menunggu pembayaran.": "お支払いをお待ちしています。",
  "Bayar": "支払う", "Konfirmasi": "連絡する", "Dikirim": "受け取る",
  "Konfirmasi Pembayaran via WhatsApp": "WhatsAppで支払いを連絡", "Kembali Belanja": "買い物を続ける",
  "Download Invoice": "請求書をダウンロード", "Detail Pembayaran": "お支払い情報", "Atas Nama": "口座名義",
  "Tujuan": "送金先", "Total Bayar": "お支払い合計", "Bukti Pembayaran": "お支払い明細",
  "Kirim Bukti via WhatsApp": "WhatsAppで明細を送信", "Kembali ke beranda": "ホームへ戻る",
  "Toko Sedang Tutup": "現在休業中", "Order belum bisa dibuat.": "現在ご注文いただけません。",
  "Tutup notifikasi": "通知を閉じる", "Cek Order": "注文確認", "Cart": "カート", "Lacak pesanan": "注文を確認",
  "Menunggu Pembayaran": "お支払い待ち", "Menunggu Verifikasi": "確認待ち", "Diproses": "処理中", "Selesai": "完了", "Dibatalkan": "キャンセル",
  Streaming: "動画配信", Editor: "編集", Music: "音楽", Design: "デザイン",
};

const PRODUCTS = {
  p_netflix: ["シェア・セミプライベート・プライベート", "Netflix Premiumを、シェア、セミプライベート、プライベートなど複数のプランから選べます。", ["プロフィールとPINに対応", "1P2U：1プロフィールを2ユーザーで利用", "1P1U：1プロフィールを1ユーザーで利用", "プライベート：1アカウント5プロフィール", "利用期間中の保証付き", "安定したアカウント", "自社提供アカウント"]],
  p_disney: ["6ユーザー共有・1ユーザー1端末", "Disney+ Premiumの6ユーザー共有プランです。1ユーザーにつき1端末で利用でき、手動OTPと保証が付きます。", ["最大4K Ultra HD画質", "対応端末でHDR・Dolby Visionを利用可能", "広告なし", "オフライン視聴用ダウンロード", "1ユーザーにつき1端末", "利用期間中の保証付き", "延長可能", "OTPは手動対応です"]],
  p_prime_video: ["プライベート・1P1U共有・保証付き", "Prime Videoの1か月プランです。プライベートまたは1プロフィール1ユーザー共有から選べます。", ["メールアクセス付き", "プライベートアカウント", "25〜30日利用可能", "利用期間中の保証付き", "対応端末で最大4K HDR", "X-Ray機能対応", "広告なし", "オフライン視聴用ダウンロード"]],
  p_hbo_max: ["プライベート・1P1U共有・保証付き", "HBO Max Standardの1か月プランです。プライベートまたは1プロフィール1ユーザー共有から選べます。", ["Standardプラン・最大2画面", "Full HD 1080p", "すぐに利用可能", "プライベートプランはメールアクセス付き", "最大10端末でログイン可能", "1か月保証", "有効期間中は同じアカウントで延長可能"]],
  p_capcut: ["インドネシア地域プライベート・7日／30日", "インドネシア地域のCapCut Proプライベートプランです。7日または30日から選べます。", ["インドネシア地域のプライベートアカウント", "1端末のみログイン可能", "すべてのPro機能", "透かしなしで動画を書き出し", "プレミアムテンプレート・フィルター・エフェクト"]],
  p_yt: ["招待・GSuite・INDPLAN", "YouTube Premiumを招待、GSuite、INDPLANから選べます。メール条件と保証内容をご確認ください。", ["購入者のメールはPremium未使用のものが必要", "無料プランへ戻った場合は保証対象", "アカウント無効化やGmail以外は保証対象外", "広告なし", "バックグラウンド再生", "オフライン再生", "YouTube Music付き"]],
  p_spotify: ["INDPLAN・FAMPLAN", "Spotify PremiumをINDPLANまたはFAMPLANから選べます。保証付きと保証なしのプランがあります。", ["販売者提供アカウント", "利用条件を守った場合は全期間保証", "無料プランへ戻った場合のみ保証", "アカウント停止は保証対象外", "広告なし", "スキップ無制限", "オフラインモード"]],
  p_chatgpt: ["Head Team・Plus・招待・Go", "ChatGPTのHead Team、Plus、招待、ChatGPT Goから用途に合うプランを選べます。", ["PayPal・VCC決済アカウント", "停止前25日保証", "ChatGPT Goは10日保証", "プライベートは全期間保証", "高性能モデルへアクセス", "より多いメッセージ上限", "長い会話メモリ", "優先アクセス", "画像生成"]],
  p_canva: ["Member・Admin Member・Admin Head", "Canva PremiumをMemberからAdmin Headまで選べます。個人利用やチーム管理に対応します。", ["25〜30日を1か月として計算", "Ownerは最大100人を招待可能", "Memberはメールで招待", "延長は期限前に管理者へご連絡ください", "Lifetime Eduは3か月保証", "30日間の全期間保証"]],
};

export function LocaleProvider({ locale, children }) {
  return <LocaleContext.Provider value={locale === "jp" ? "jp" : "id"}>{children}</LocaleContext.Provider>;
}

export function translate(locale, text) {
  return locale === "jp" ? JA[text] || text : text;
}

export function localizeCatalogText(locale, text = "") {
  if (locale !== "jp") return text;
  return (JA[text] || String(text))
    .replace(/Pilih Durasi/gi, "期間を選択")
    .replace(/(\d+) Bulan/gi, "$1か月").replace(/(\d+) Hari/gi, "$1日")
    .replace(/(\d+) Month/gi, "$1か月").replace(/(\d+) Week/gi, "$1週間").replace(/(\d+) Year/gi, "$1年")
    .replace(/Full\s*Gar(?:ansi|r)?/gi, "全期間保証").replace(/No\s*Gar(?:ansi|r)?|Nogaransi|Nogarr?/gi, "保証なし")
    .replace(/Garansi/gi, "保証").replace(/Email Sendiri/gi, "ご自身のメール").replace(/Email Seller/gi, "販売者のメール");
}

export function localizeProduct(value, locale) {
  if (!value || locale !== "jp") return value;
  const copy = PRODUCTS[value.id];
  return {
    ...value,
    category: localizeCatalogText(locale, value.category),
    duration: localizeCatalogText(locale, value.duration),
    tagline: copy?.[0] || localizeCatalogText(locale, value.tagline),
    description: copy?.[1] || value.description,
    features: copy?.[2] || value.features,
    pricingPlans: (value.pricingPlans || []).map((plan) => ({ ...plan, name: localizeCatalogText(locale, plan.name), options: (plan.options || []).map((option) => ({ ...option, duration: localizeCatalogText(locale, option.duration) })) })),
  };
}

export function useI18n() {
  const locale = useContext(LocaleContext);
  return { locale, isJapanese: locale === "jp", t: (text) => translate(locale, text), product: (value) => localizeProduct(value, locale), catalogText: (value) => localizeCatalogText(locale, value), money: (value) => fmtCurrency(value, locale) };
}
