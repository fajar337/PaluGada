import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { fmtCurrency, getProductStartingPrice } from "../src/features/palugada/constants.js";
import { createProductStructuredData } from "../src/features/palugada/lib/product-schema.js";
import { SITE_NAME, SITE_ORIGIN, absoluteUrl, slugifyProduct } from "../src/features/palugada/lib/seo.js";
import { loadPublicProducts } from "./product-source.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const distDirectory = resolve(scriptDirectory, "../dist");
const template = await readFile(resolve(distDirectory, "index.html"), "utf8");

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function truncateDescription(value, maxLength = 158) {
  const normalized = String(value || "").replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  const shortened = normalized.slice(0, maxLength - 3);
  const wordBoundary = shortened.lastIndexOf(" ");
  const safeText = shortened.slice(0, wordBoundary > 100 ? wordBoundary : shortened.length).replace(/[,:;.!?-]+$/g, "");
  return `${safeText}...`;
}

function replaceMeta(html, selector, value) {
  const escapedValue = escapeHtml(value);
  return html.replace(
    new RegExp(`(<meta\\s+${selector}\\s+content=")[^"]*("\\s*/?>)`, "i"),
    `$1${escapedValue}$2`
  );
}

function replaceCanonical(html, value) {
  return html.replace(
    /(<link\s+rel="canonical"\s+href=")[^"]*("\s*\/?>)/i,
    `$1${escapeHtml(value)}$2`
  );
}

function upsertAlternate(html, hreflang, value) {
  const pattern = new RegExp(`(<link\\s+rel="alternate"\\s+hreflang="${hreflang}"\\s+href=")[^"]*("\\s*/?>)`, "i");
  if (pattern.test(html)) {
    return html.replace(pattern, `$1${escapeHtml(value)}$2`);
  }
  return html.replace("</head>", `    <link rel="alternate" hreflang="${hreflang}" href="${escapeHtml(value)}" />\n  </head>`);
}

function replacePublicMetadata(html, { locale, title, description, canonical, idAlternate, jpAlternate, type = "website", schema, noscriptContent }) {
  let output = html.replace(/<html\s+lang="[^"]*"/i, `<html lang="${locale === "jp" ? "ja" : "id"}"`);
  output = output.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  output = replaceMeta(output, 'name="description"', description);
  output = replaceMeta(output, 'name="robots"', "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
  output = replaceMeta(output, 'name="googlebot"', "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
  output = replaceMeta(output, 'property="og:title"', title);
  output = replaceMeta(output, 'property="og:description"', description);
  output = replaceMeta(output, 'property="og:type"', type);
  output = replaceMeta(output, 'property="og:url"', canonical);
  output = replaceMeta(output, 'name="twitter:title"', title);
  output = replaceMeta(output, 'name="twitter:description"', description);
  output = replaceCanonical(output, canonical);
  output = upsertAlternate(output, "id-ID", idAlternate);
  output = upsertAlternate(output, "ja-JP", jpAlternate);
  output = upsertAlternate(output, "x-default", idAlternate);
  output = output.replace(
    /<script id="palugada-structured-data" type="application\/ld\+json">[\s\S]*?<\/script>/i,
    `<script id="palugada-structured-data" type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>`
  );
  if (noscriptContent) {
    output = output.replace(/<noscript>\s*<main>[\s\S]*?<\/main>\s*<\/noscript>/i, `<noscript><main>${noscriptContent}</main></noscript>`);
  }
  return output;
}

function getBaseGraph(schema) {
  return (schema["@graph"] || []).filter((item) => {
    const types = Array.isArray(item["@type"]) ? item["@type"] : [item["@type"]];
    return !types.includes("FAQPage") && !types.includes("BreadcrumbList") && !types.includes("Product");
  });
}

function localizeBaseGraph(graph, locale) {
  const japan = locale === "jp";
  return graph.map((source) => {
    const item = structuredClone(source);
    const types = Array.isArray(item["@type"]) ? item["@type"] : [item["@type"]];
    if (types.includes("WebSite")) item.inLanguage = japan ? "ja-JP" : "id-ID";
    if (types.includes("Organization") && item.contactPoint) {
      item.contactPoint.areaServed = japan ? "JP" : "ID";
      item.contactPoint.availableLanguage = [japan ? "ja" : "id"];
    }
    if (types.includes("OnlineStore")) {
      item.currenciesAccepted = japan ? "JPY" : "IDR";
      item.priceRange = japan ? "¥100-¥2,000" : "Rp5.000-Rp150.000";
      item.areaServed = { "@type": "Country", name: japan ? "Japan" : "Indonesia" };
    }
    return item;
  });
}

const templateSchemaMatch = template.match(/<script id="palugada-structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/i);
const templateSchema = JSON.parse(templateSchemaMatch?.[1] || "{}");
const templateBaseGraph = getBaseGraph(templateSchema);
const products = await loadPublicProducts();
const locales = ["id", "jp"];
let generatedPageCount = 0;

for (const locale of locales) {
  const japan = locale === "jp";
  const baseGraph = localizeBaseGraph(templateBaseGraph, locale);
  const homeCanonical = absoluteUrl(`/${locale}/`);
  const homeHtml = replacePublicMetadata(template, {
    locale,
    title: japan ? `プレミアムアカウントをお手頃価格で | ${SITE_NAME}` : `Akun Premium Murah & Terpercaya | ${SITE_NAME}`,
    description: japan
      ? "Netflix、ChatGPT Plus、Spotify、YouTube Premium、Canva Proなどのプレミアムサービスを保証付きで購入できます。"
      : "Beli akun premium murah dan terpercaya di Palugada Premium. Tersedia Netflix, ChatGPT Plus, Spotify, YouTube Premium, Canva Pro, dan lainnya.",
    canonical: homeCanonical,
    idAlternate: absoluteUrl("/id/"),
    jpAlternate: absoluteUrl("/jp/"),
    schema: { "@context": "https://schema.org", "@graph": baseGraph },
    noscriptContent: japan
      ? "<h1>Palugada Premium</h1><p>保証付きのプレミアムサービスをお手頃価格で購入できます。</p>"
      : "<h1>Palugada Premium</h1><p>Akun premium murah dan bergaransi.</p>",
  });
  const homeDirectory = resolve(distDirectory, locale);
  await mkdir(homeDirectory, { recursive: true });
  await writeFile(resolve(homeDirectory, "index.html"), homeHtml, "utf8");
  generatedPageCount += 1;

  for (const product of products) {
    const slug = slugifyProduct(product.name);
    const canonical = absoluteUrl(`/${locale}/produk/${slug}/`);
    const idAlternate = absoluteUrl(`/id/produk/${slug}/`);
    const jpAlternate = absoluteUrl(`/jp/produk/${slug}/`);
    const title = japan
      ? `${product.name} 保証付き | ${SITE_NAME}`
      : `${product.name} Murah & Bergaransi | ${SITE_NAME}`;
    const description = truncateDescription(japan
      ? `${product.name}をPalugada Premiumで購入できます。用途に合うプランを選べて、保証付きで安心してご利用いただけます。`
      : `Beli ${product.name} murah dan terpercaya di Palugada Premium. ${product.description || product.tagline || "Akun premium bergaransi dengan proses mudah melalui WhatsApp."}`);
    const schemaProduct = japan
      ? { ...product, description: `${product.name}を保証付きで購入できます。` }
      : product;
    const productSchema = createProductStructuredData(schemaProduct, [], null, locale);
    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        ...baseGraph,
        productSchema,
        {
          "@type": "BreadcrumbList",
          "@id": `${canonical}#breadcrumb`,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: japan ? "ホーム" : "Beranda", item: homeCanonical },
            { "@type": "ListItem", position: 2, name: japan ? "カタログ" : "Katalog", item: `${homeCanonical}#katalog` },
            { "@type": "ListItem", position: 3, name: product.name, item: canonical },
          ],
        },
      ],
    };
    const html = replacePublicMetadata(template, {
      locale,
      title,
      description,
      canonical,
      idAlternate,
      jpAlternate,
      type: "product",
      schema,
      noscriptContent: `<h1>${escapeHtml(product.name)}</h1><p>${escapeHtml(description)}</p><p>${japan ? "最低価格" : "Harga mulai"} ${escapeHtml(fmtCurrency(getProductStartingPrice(product, [], locale), locale))}</p>`,
    });
    const directory = resolve(distDirectory, locale, "produk", slug);
    await mkdir(directory, { recursive: true });
    await writeFile(resolve(directory, "index.html"), html, "utf8");
    generatedPageCount += 1;
  }

  const resellerCanonical = absoluteUrl(`/${locale}/reseller/daftar/`);
  const resellerSchema = {
    "@context": "https://schema.org",
    "@graph": [
      ...baseGraph,
      {
        "@type": "BreadcrumbList",
        "@id": `${resellerCanonical}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: japan ? "ホーム" : "Beranda", item: homeCanonical },
          { "@type": "ListItem", position: 2, name: japan ? "リセラープログラム" : "Program Reseller", item: resellerCanonical },
        ],
      },
    ],
  };
  const resellerHtml = replacePublicMetadata(template, {
    locale,
    title: japan ? `リセラープログラム | ${SITE_NAME}` : `Program Reseller Akun Premium | ${SITE_NAME}`,
    description: japan
      ? "Palugada Premiumのリセラープログラムに登録して、再販売向けの特別価格をご利用いただけます。"
      : "Daftar program reseller Palugada Premium dan dapatkan harga khusus untuk menjual kembali akun premium murah.",
    canonical: resellerCanonical,
    idAlternate: absoluteUrl("/id/reseller/daftar/"),
    jpAlternate: absoluteUrl("/jp/reseller/daftar/"),
    schema: resellerSchema,
    noscriptContent: japan
      ? "<h1>Palugada Premium リセラープログラム</h1><p>再販売向けの特別価格をご利用いただけます。</p>"
      : "<h1>Program Reseller Palugada Premium</h1><p>Daftar program reseller akun premium untuk mendapatkan harga khusus dan margin penjualan kembali.</p>",
  });
  const resellerDirectory = resolve(distDirectory, locale, "reseller", "daftar");
  await mkdir(resellerDirectory, { recursive: true });
  await writeFile(resolve(resellerDirectory, "index.html"), resellerHtml, "utf8");
  generatedPageCount += 1;
}

console.log(`Generated ${generatedPageCount} localized public HTML pages.`);
