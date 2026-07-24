import { getPricingForSelection } from "../constants.js";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_ORIGIN, absoluteUrl, slugifyProduct } from "./seo.js";

const NO_WARRANTY_PATTERN = /\b(?:no[\s_-]*gar(?:ansi)?r*|nogar(?:ansi)?r*)\b/i;
const WARRANTY_PATTERN = /\b(?:full[\s_-]*gar(?:ansi)?r*|garansi)\b/i;
const RETURN_POLICY_URL = absoluteUrl("/#garansi");
const REMOTE_RETURN_METHOD = "https://schema.org/ReturnByMail";
const FREE_RETURN_FEES = "https://schema.org/FreeReturn";

function parseDurationDays(value = "") {
  const normalized = String(value).toLowerCase().replace(/,/g, ".");
  const durationPatterns = [
    { pattern: /(\d+(?:\.\d+)?)\s*(?:tahun|year|years)\b/i, multiplier: 365 },
    { pattern: /(\d+(?:\.\d+)?)\s*(?:bulan|bln|month|months)\b/i, multiplier: 30 },
    { pattern: /(\d+(?:\.\d+)?)\s*(?:minggu|week|weeks)\b/i, multiplier: 7 },
    { pattern: /(\d+(?:\.\d+)?)\s*(?:hari|day|days)\b/i, multiplier: 1 },
  ];

  for (const { pattern, multiplier } of durationPatterns) {
    const match = normalized.match(pattern);
    if (match) {
      return Math.max(1, Math.round(Number(match[1]) * multiplier));
    }
  }

  return 0;
}

function getVariantText(plan, option) {
  return [plan?.id, plan?.name, option?.id, option?.duration].filter(Boolean).join(" ");
}

function getProductWarrantyText(product) {
  return [product?.tagline, product?.description, ...(Array.isArray(product?.features) ? product.features : [])]
    .filter(Boolean)
    .join(" ");
}

export function getWarrantyDays(product, plan = null, option = null) {
  const variantText = getVariantText(plan, option);
  if (NO_WARRANTY_PATTERN.test(variantText)) {
    return 0;
  }

  const productWarrantyText = getProductWarrantyText(product);
  const hasWarranty = WARRANTY_PATTERN.test(variantText) || WARRANTY_PATTERN.test(productWarrantyText);
  if (!hasWarranty) {
    return 0;
  }

  let purchasedDays = parseDurationDays(option?.duration || product?.duration || variantText);

  if (!purchasedDays && /lifetime/i.test(variantText)) {
    const lifetimePolicy = (Array.isArray(product?.features) ? product.features : []).find(
      (feature) => /lifetime/i.test(feature) && WARRANTY_PATTERN.test(feature)
    );
    purchasedDays = parseDurationDays(lifetimePolicy);
  }

  if (!purchasedDays) {
    return 0;
  }

  return Math.max(1, Math.floor((purchasedDays * 2) / 3));
}

function createMerchantReturnPolicy(warrantyDays) {
  if (!warrantyDays) {
    return {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "ID",
      returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
      merchantReturnLink: RETURN_POLICY_URL,
    };
  }

  return {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "ID",
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: warrantyDays,
    merchantReturnLink: RETURN_POLICY_URL,
    // Google belum menyediakan metode khusus klaim produk digital.
    // ReturnByMail adalah metode jarak jauh yang didukung untuk merchant listing.
    returnMethod: REMOTE_RETURN_METHOD,
    returnFees: FREE_RETURN_FEES,
    restockingFee: 0.5,
  };
}

function createDigitalDeliveryDetails() {
  return {
    "@type": "OfferShippingDetails",
    shippingRate: {
      "@type": "MonetaryAmount",
      value: 0,
      currency: "IDR",
    },
    shippingDestination: {
      "@type": "DefinedRegion",
      addressCountry: "ID",
    },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: {
        "@type": "QuantitativeValue",
        minValue: 0,
        maxValue: 1,
        unitCode: "DAY",
      },
      transitTime: {
        "@type": "QuantitativeValue",
        minValue: 0,
        maxValue: 0,
        unitCode: "DAY",
      },
    },
  };
}

function getProductBrandName(product) {
  const configuredBrand = typeof product?.brand === "string" ? product.brand : product?.brand?.name;
  if (configuredBrand) {
    return configuredBrand;
  }

  return String(product?.name || SITE_NAME)
    .replace(/\s+(?:premium|pro|plus)\s*$/i, "")
    .trim();
}

function createOffer(product, promos, path, plan = null, option = null) {
  const selection = plan && option ? { plan, option } : null;
  const pricing = getPricingForSelection(product, promos, selection);
  const stock = option?.stock ?? product?.stock;
  const variantSlug = slugifyProduct([plan?.id, option?.id].filter(Boolean).join("-") || "default");
  const variantName = [product?.name, plan?.name, option?.duration].filter(Boolean).join(" - ");

  return {
    "@type": "Offer",
    "@id": `${absoluteUrl(path)}#offer-${variantSlug}`,
    name: variantName || product?.name,
    sku: [product?.id, plan?.id, option?.id].filter(Boolean).join("-") || product?.id,
    url: absoluteUrl(path),
    priceCurrency: "IDR",
    price: String(pricing.displayPrice),
    availability: Number(stock) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    seller: { "@id": `${SITE_ORIGIN}/#organization` },
    shippingDetails: createDigitalDeliveryDetails(),
    hasMerchantReturnPolicy: createMerchantReturnPolicy(getWarrantyDays(product, plan, option)),
  };
}

function createProductOffers(product, promos, path) {
  const offers = (product?.pricingPlans || []).flatMap((plan) =>
    (plan?.options || []).map((option) => createOffer(product, promos, path, plan, option))
  );

  return offers.length ? offers : [createOffer(product, promos, path)];
}

export function createProductStructuredData(product, promos = [], aggregateRating = null) {
  const path = `/produk/${slugifyProduct(product.name)}/`;
  const offers = createProductOffers(product, promos, path);

  return {
    "@type": "Product",
    "@id": `${absoluteUrl(path)}#product`,
    name: product.name,
    description: product.description || product.tagline || `${product.name} dari ${SITE_NAME}`,
    image: DEFAULT_OG_IMAGE,
    url: absoluteUrl(path),
    category: product.category || "Layanan digital premium",
    sku: product.id || slugifyProduct(product.name),
    brand: {
      "@type": "Brand",
      name: getProductBrandName(product),
    },
    offers: offers.length === 1 ? offers[0] : offers,
    ...(aggregateRating ? { aggregateRating } : {}),
  };
}
