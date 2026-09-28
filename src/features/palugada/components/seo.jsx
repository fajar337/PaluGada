import { useEffect } from "react";
import {
  ADMIN_WHATSAPP_NUMBER,
  CONTACT_EMAIL,
  INSTAGRAM_URL,
} from "../constants";
import { createProductStructuredData } from "../lib/product-schema";
import { localizeProduct } from "../lib/i18n";
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_ORIGIN,
  STORE_FAQS,
  STORE_FAQS_JA,
  absoluteUrl,
  getViewPath,
  slugifyProduct,
} from "../lib/seo";

const DEFAULT_KEYWORDS = [
  "akun premium",
  "akun premium murah",
  "akun premium terpercaya",
  "chatgpt plus",
  "chatgpt premium",
  "spotify premium",
  "netflix premium",
  "youtube premium",
  "canva pro",
  "digital premium",
  "langganan premium",
  "palugada premium",
  "palugadapremium",
];

const VIEW_METADATA = {
  home: {
    title: "Akun Premium Murah & Terpercaya | Palugada Premium",
    description:
      "Beli akun premium murah dan terpercaya di Palugada Premium. Tersedia Netflix, ChatGPT Plus, Spotify, YouTube Premium, Canva Pro, CapCut Pro, dan lainnya.",
    indexable: true,
  },
  cart: {
    title: "Keranjang Belanja | Palugada Premium",
    description: "Periksa pilihan akun dan layanan digital premium di keranjang Palugada Premium.",
  },
  "track-order": {
    title: "Lacak Pesanan | Palugada Premium",
    description: "Lacak status pesanan Palugada Premium menggunakan Order ID dan nomor WhatsApp pembeli.",
  },
  checkout: {
    title: "Checkout Aman | Palugada Premium",
    description: "Selesaikan booking akun premium dan pilih metode pembayaran di Palugada Premium.",
  },
  "order-success": {
    title: "Pesanan Berhasil Dibuat | Palugada Premium",
    description: "Booking Palugada Premium berhasil dibuat dan sedang menunggu konfirmasi pembayaran.",
  },
  "reseller-login": {
    title: "Login Reseller | Palugada Premium",
    description: "Masuk ke portal reseller Palugada Premium untuk melihat tier, diskon, dan riwayat pesanan.",
  },
  "reseller-register": {
    title: "Program Reseller Akun Premium | Palugada Premium",
    description:
      "Daftar program reseller Palugada Premium dan dapatkan harga khusus untuk menjual kembali akun premium murah.",
    indexable: true,
  },
  "reseller-dashboard": {
    title: "Dashboard Reseller | Palugada Premium",
    description: "Kelola aktivitas dan riwayat pesanan reseller Palugada Premium.",
  },
  "admin-login": {
    title: "Login Admin | Palugada Premium",
    description: "Halaman autentikasi administrator Palugada Premium.",
  },
  admin: {
    title: "Admin Console | Palugada Premium",
    description: "Panel administrasi internal Palugada Premium.",
  },
};

const VIEW_METADATA_JA = {
  home: { title: "プレミアムアカウントをお手頃価格で | Palugada Premium", description: "Netflix、ChatGPT Plus、Spotify、YouTube Premium、Canva Proなどのプレミアムサービスを保証付きで購入できます。", indexable: true },
  cart: { title: "ショッピングカート | Palugada Premium", description: "カートに追加したプレミアムサービスを確認できます。" },
  "track-order": { title: "注文状況を確認 | Palugada Premium", description: "注文IDとWhatsApp番号で注文状況を確認できます。" },
  checkout: { title: "注文手続き | Palugada Premium", description: "購入者情報とお支払い方法を入力して注文を確定します。" },
  "order-success": { title: "注文を受け付けました | Palugada Premium", description: "ご注文を受け付けました。お支払いの確認をお待ちしています。" },
  "reseller-login": { title: "リセラーログイン | Palugada Premium", description: "Palugada Premiumのリセラーポータルにログインします。" },
  "reseller-register": { title: "リセラープログラム | Palugada Premium", description: "Palugada Premiumのリセラープログラムに登録できます。" },
  "reseller-dashboard": { title: "リセラーダッシュボード | Palugada Premium", description: "リセラーの注文履歴とアカウント情報を確認できます。" },
};

function truncateMetadataDescription(value, maxLength = 158) {
  const normalized = String(value || "").replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  const shortened = normalized.slice(0, maxLength - 3);
  const wordBoundary = shortened.lastIndexOf(" ");
  const safeText = shortened.slice(0, wordBoundary > 100 ? wordBoundary : shortened.length).replace(/[,:;.!?-]+$/g, "");
  return `${safeText}...`;
}

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
}

function upsertLink(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
}

function getReviewAggregate(reviews = []) {
  const validRatings = reviews
    .map((review) => Number(review.rating))
    .filter((rating) => Number.isFinite(rating) && rating >= 1 && rating <= 5);

  if (!validRatings.length) {
    return null;
  }

  return {
    "@type": "AggregateRating",
    ratingValue: (validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length).toFixed(1),
    ratingCount: validRatings.length,
    bestRating: 5,
    worstRating: 1,
  };
}

function createProductSchema(product, promos, reviews, locale) {
  const aggregateRating = getReviewAggregate(reviews);
  const schema = createProductStructuredData(product, promos, aggregateRating, locale);
  if (locale !== "jp") return schema;
  const localized = localizeProduct(product, locale);
  return { ...schema, description: localized.description || localized.tagline, category: localized.category };
}

function createBaseGraph(locale = "id") {
  const japan = locale === "jp";
  const telephone = `+${ADMIN_WHATSAPP_NUMBER}`;
  const organization = {
    "@type": "Organization",
    "@id": `${SITE_ORIGIN}/#organization`,
    name: SITE_NAME,
    alternateName: ["Palugada", "PaluGada Premium", "palugadapremium"],
    url: `${SITE_ORIGIN}/`,
    logo: `${SITE_ORIGIN}/icon.png`,
    image: DEFAULT_OG_IMAGE,
    email: CONTACT_EMAIL,
    telephone,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone,
      email: CONTACT_EMAIL,
      areaServed: japan ? "JP" : "ID",
      availableLanguage: [japan ? "ja" : "id"],
    },
    sameAs: [INSTAGRAM_URL],
  };

  const website = {
    "@type": "WebSite",
    "@id": `${SITE_ORIGIN}/#website`,
    url: `${SITE_ORIGIN}/`,
    name: SITE_NAME,
    inLanguage: japan ? "ja-JP" : "id-ID",
    publisher: { "@id": `${SITE_ORIGIN}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_ORIGIN}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const store = {
    "@type": ["OnlineStore", "LocalBusiness"],
    "@id": `${SITE_ORIGIN}/#store`,
    name: SITE_NAME,
    url: `${SITE_ORIGIN}/`,
    image: DEFAULT_OG_IMAGE,
    logo: `${SITE_ORIGIN}/icon.png`,
    email: CONTACT_EMAIL,
    telephone,
    priceRange: japan ? "¥100-¥2,000" : "Rp5.000-Rp150.000",
    currenciesAccepted: japan ? "JPY" : "IDR",
    paymentAccepted: "DANA, OVO, GoPay, ShopeePay, SeaBank, QRIS",
    areaServed: { "@type": "Country", name: japan ? "Japan" : "Indonesia" },
    parentOrganization: { "@id": `${SITE_ORIGIN}/#organization` },
    sameAs: [INSTAGRAM_URL],
  };

  return [organization, website, store];
}

function createStructuredData(view, activeProduct, products, promos, reviews, canonicalUrl, locale) {
  const graph = createBaseGraph(locale);
  const localizedHome = absoluteUrl(`/${locale}/`);
  const breadcrumbItems = [{ "@type": "ListItem", position: 1, name: locale === "jp" ? "ホーム" : "Beranda", item: localizedHome }];

  if (view === "detail" && activeProduct) {
    breadcrumbItems.push(
      { "@type": "ListItem", position: 2, name: locale === "jp" ? "商品一覧" : "Katalog", item: `${localizedHome}#katalog` },
      { "@type": "ListItem", position: 3, name: activeProduct.name, item: canonicalUrl }
    );
    graph.push(createProductSchema(activeProduct, promos, reviews.filter((review) => review.productId === activeProduct.id), locale));
  } else if (view === "home") {
    graph.push({
      "@type": "FAQPage",
      "@id": `${SITE_ORIGIN}/#faq-schema`,
      mainEntity: (locale === "jp" ? STORE_FAQS_JA : STORE_FAQS).map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });

    if (products.length) {
      graph.push({
        "@type": "ItemList",
        "@id": `${SITE_ORIGIN}/#product-list`,
        name: locale === "jp" ? "PaluGada Premiumの商品一覧" : "Katalog akun premium Palugada Premium",
        numberOfItems: products.length,
        itemListElement: products.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: absoluteUrl(`/${locale}/produk/${slugifyProduct(product.name)}/`),
          item: { "@id": `${absoluteUrl(`/${locale}/produk/${slugifyProduct(product.name)}/`)}#product` },
        })),
      });
      graph.push(
        ...products.map((product) =>
          createProductSchema(product, promos, reviews.filter((review) => review.productId === product.id), locale)
        )
      );
    }
  } else if (view === "reseller-register") {
    breadcrumbItems.push({ "@type": "ListItem", position: 2, name: locale === "jp" ? "リセラープログラム" : "Program Reseller", item: canonicalUrl });
  }

  graph.push({
    "@type": "BreadcrumbList",
    "@id": `${canonicalUrl}#breadcrumb`,
    itemListElement: breadcrumbItems,
  });

  return { "@context": "https://schema.org", "@graph": graph };
}

export function SeoHead({ locale = "id", view, activeProduct, products = [], promos = [], reviews = [] }) {
  useEffect(() => {
    const metadata = locale === "jp" ? VIEW_METADATA_JA : VIEW_METADATA;
    const base = metadata[view] || metadata.home || VIEW_METADATA[view] || VIEW_METADATA.home;
    const isProduct = view === "detail" && activeProduct;
    const title = isProduct
      ? locale === "jp"
        ? `${activeProduct.name} 保証付き | ${SITE_NAME}`
        : `${activeProduct.name} Murah & Bergaransi | ${SITE_NAME}`
      : base.title;
    const productDescription = activeProduct?.description || activeProduct?.tagline || "";
    const description = isProduct
      ? truncateMetadataDescription(locale === "jp"
        ? `${activeProduct.name}をPaluGada Premiumで購入できます。保証付きで安心してご利用いただけます。`
        : `Beli ${activeProduct.name} murah dan terpercaya di Palugada Premium. ${productDescription}`)
      : base.description;
    const currentSearch = view === "home" ? new URLSearchParams(window.location.search).get("q") || "" : "";
    const path = getViewPath(view, activeProduct, currentSearch, locale);
    const idPath = getViewPath(view, activeProduct, currentSearch, "id");
    const jpPath = getViewPath(view, activeProduct, currentSearch, "jp");
    const canonicalUrl = absoluteUrl(path.split("?")[0]);
    const indexable = Boolean(base.indexable || isProduct);
    const robots = indexable
      ? "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      : "noindex, nofollow, noarchive";
    const keywords = locale === "jp"
      ? [activeProduct?.name, localizeProduct(activeProduct, locale)?.category, "プレミアムサービス", "デジタルサービス", "PaluGada Premium"].filter(Boolean).join(", ")
      : [activeProduct?.name, activeProduct?.category, ...DEFAULT_KEYWORDS].filter(Boolean).join(", ");

    document.title = title;
    document.documentElement.lang = locale === "jp" ? "ja" : "id";

    upsertMeta('meta[name="description"]', { name: "description", content: description });
    upsertMeta('meta[name="keywords"]', { name: "keywords", content: keywords });
    upsertMeta('meta[name="robots"]', { name: "robots", content: robots });
    upsertMeta('meta[name="googlebot"]', { name: "googlebot", content: robots });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: title });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: isProduct ? "product" : "website" });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
    upsertMeta('meta[property="og:image"]', { property: "og:image", content: DEFAULT_OG_IMAGE });
    upsertMeta('meta[property="og:image:alt"]', {
      property: "og:image:alt",
      content: locale === "jp" ? "PaluGada Premiumのプレミアムサービス" : "Palugada Premium - akun premium murah dan terpercaya",
    });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: DEFAULT_OG_IMAGE });
    upsertMeta('meta[name="twitter:image:alt"]', {
      name: "twitter:image:alt",
      content: locale === "jp" ? "PaluGada Premiumのプレミアムサービス" : "Palugada Premium - akun premium murah dan terpercaya",
    });

    upsertLink('link[rel="canonical"]', { rel: "canonical", href: canonicalUrl });
    upsertLink('link[rel="alternate"][hreflang="id-ID"]', {
      rel: "alternate",
      hreflang: "id-ID",
      href: absoluteUrl(idPath.split("?")[0]),
    });
    upsertLink('link[rel="alternate"][hreflang="ja-JP"]', {
      rel: "alternate",
      hreflang: "ja-JP",
      href: absoluteUrl(jpPath.split("?")[0]),
    });
    upsertLink('link[rel="alternate"][hreflang="x-default"]', {
      rel: "alternate",
      hreflang: "x-default",
      href: absoluteUrl(idPath.split("?")[0]),
    });

    let structuredData = document.getElementById("palugada-structured-data");
    if (!structuredData) {
      structuredData = document.createElement("script");
      structuredData.id = "palugada-structured-data";
      structuredData.type = "application/ld+json";
      document.head.appendChild(structuredData);
    }
    structuredData.textContent = JSON.stringify(
      createStructuredData(view, activeProduct, products, promos, reviews, canonicalUrl, locale)
    );
  }, [activeProduct, locale, products, promos, reviews, view]);

  return null;
}
