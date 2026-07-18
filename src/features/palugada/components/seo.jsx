import { useEffect } from "react";
import {
  ADMIN_WHATSAPP_NUMBER,
  CONTACT_EMAIL,
  INSTAGRAM_URL,
  getProductStartingPrice,
} from "../constants";
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_ORIGIN,
  STORE_FAQS,
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

function createProductSchema(product, promos, reviews) {
  const path = `/produk/${slugifyProduct(product.name)}/`;
  const price = getProductStartingPrice(product, promos);
  const aggregateRating = getReviewAggregate(reviews);

  return {
    "@type": "Product",
    "@id": `${absoluteUrl(path)}#product`,
    name: product.name,
    description: product.description || product.tagline || `${product.name} dari ${SITE_NAME}`,
    image: DEFAULT_OG_IMAGE,
    url: absoluteUrl(path),
    category: product.category,
    sku: product.id,
    brand: { "@id": `${SITE_ORIGIN}/#organization` },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(path),
      priceCurrency: "IDR",
      price: String(price),
      availability:
        Number(product.stock) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@id": `${SITE_ORIGIN}/#organization` },
    },
    ...(aggregateRating ? { aggregateRating } : {}),
  };
}

function createBaseGraph() {
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
      areaServed: "ID",
      availableLanguage: ["id"],
    },
    sameAs: [INSTAGRAM_URL],
  };

  const website = {
    "@type": "WebSite",
    "@id": `${SITE_ORIGIN}/#website`,
    url: `${SITE_ORIGIN}/`,
    name: SITE_NAME,
    inLanguage: "id-ID",
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
    priceRange: "Rp5.000-Rp150.000",
    currenciesAccepted: "IDR",
    paymentAccepted: "DANA, OVO, GoPay, ShopeePay, SeaBank, QRIS",
    areaServed: { "@type": "Country", name: "Indonesia" },
    parentOrganization: { "@id": `${SITE_ORIGIN}/#organization` },
    sameAs: [INSTAGRAM_URL],
  };

  return [organization, website, store];
}

function createStructuredData(view, activeProduct, products, promos, reviews, canonicalUrl) {
  const graph = createBaseGraph();
  const breadcrumbItems = [{ "@type": "ListItem", position: 1, name: "Beranda", item: `${SITE_ORIGIN}/` }];

  if (view === "detail" && activeProduct) {
    breadcrumbItems.push(
      { "@type": "ListItem", position: 2, name: "Katalog", item: `${SITE_ORIGIN}/#katalog` },
      { "@type": "ListItem", position: 3, name: activeProduct.name, item: canonicalUrl }
    );
    graph.push(createProductSchema(activeProduct, promos, reviews.filter((review) => review.productId === activeProduct.id)));
  } else if (view === "home") {
    graph.push({
      "@type": "FAQPage",
      "@id": `${SITE_ORIGIN}/#faq-schema`,
      mainEntity: STORE_FAQS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });

    if (products.length) {
      graph.push({
        "@type": "ItemList",
        "@id": `${SITE_ORIGIN}/#product-list`,
        name: "Katalog akun premium Palugada Premium",
        numberOfItems: products.length,
        itemListElement: products.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: absoluteUrl(`/produk/${slugifyProduct(product.name)}/`),
          item: { "@id": `${absoluteUrl(`/produk/${slugifyProduct(product.name)}/`)}#product` },
        })),
      });
      graph.push(
        ...products.map((product) =>
          createProductSchema(product, promos, reviews.filter((review) => review.productId === product.id))
        )
      );
    }
  } else if (view === "reseller-register") {
    breadcrumbItems.push({ "@type": "ListItem", position: 2, name: "Program Reseller", item: canonicalUrl });
  }

  graph.push({
    "@type": "BreadcrumbList",
    "@id": `${canonicalUrl}#breadcrumb`,
    itemListElement: breadcrumbItems,
  });

  return { "@context": "https://schema.org", "@graph": graph };
}

export function SeoHead({ view, activeProduct, products = [], promos = [], reviews = [] }) {
  useEffect(() => {
    const base = VIEW_METADATA[view] || VIEW_METADATA.home;
    const isProduct = view === "detail" && activeProduct;
    const title = isProduct
      ? `${activeProduct.name} Murah & Bergaransi | ${SITE_NAME}`
      : base.title;
    const productDescription = activeProduct?.description || activeProduct?.tagline || "";
    const description = isProduct
      ? truncateMetadataDescription(`Beli ${activeProduct.name} murah dan terpercaya di Palugada Premium. ${productDescription}`)
      : base.description;
    const currentSearch = view === "home" ? new URLSearchParams(window.location.search).get("q") || "" : "";
    const path = getViewPath(view, activeProduct, currentSearch);
    const canonicalUrl = absoluteUrl(path.split("?")[0]);
    const indexable = Boolean(base.indexable || isProduct);
    const robots = indexable
      ? "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      : "noindex, nofollow, noarchive";
    const keywords = [activeProduct?.name, activeProduct?.category, ...DEFAULT_KEYWORDS].filter(Boolean).join(", ");

    document.title = title;
    document.documentElement.lang = "id";

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
      content: "Palugada Premium - akun premium murah dan terpercaya",
    });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: DEFAULT_OG_IMAGE });
    upsertMeta('meta[name="twitter:image:alt"]', {
      name: "twitter:image:alt",
      content: "Palugada Premium - akun premium murah dan terpercaya",
    });

    upsertLink('link[rel="canonical"]', { rel: "canonical", href: canonicalUrl });
    upsertLink('link[rel="alternate"][hreflang="id-ID"]', {
      rel: "alternate",
      hreflang: "id-ID",
      href: canonicalUrl,
    });
    upsertLink('link[rel="alternate"][hreflang="x-default"]', {
      rel: "alternate",
      hreflang: "x-default",
      href: canonicalUrl,
    });

    let structuredData = document.getElementById("palugada-structured-data");
    if (!structuredData) {
      structuredData = document.createElement("script");
      structuredData.id = "palugada-structured-data";
      structuredData.type = "application/ld+json";
      document.head.appendChild(structuredData);
    }
    structuredData.textContent = JSON.stringify(
      createStructuredData(view, activeProduct, products, promos, reviews, canonicalUrl)
    );
  }, [activeProduct, products, promos, reviews, view]);

  return null;
}
