import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { getProductStartingPrice } from "../src/features/palugada/constants.js";
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

function replaceLink(html, relation, value) {
  const escapedValue = escapeHtml(value);
  return html.replace(
    new RegExp(`(<link\\s+rel="${relation}"(?:\\s+hreflang="[^"]+")?\\s+href=")[^"]*("\\s*/?>)`, "gi"),
    `$1${escapedValue}$2`
  );
}

function replacePublicMetadata(html, { title, description, canonical, type = "website", schema, noscriptContent }) {
  let output = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  output = replaceMeta(output, 'name="description"', description);
  output = replaceMeta(output, 'name="robots"', "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
  output = replaceMeta(output, 'name="googlebot"', "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
  output = replaceMeta(output, 'property="og:title"', title);
  output = replaceMeta(output, 'property="og:description"', description);
  output = replaceMeta(output, 'property="og:type"', type);
  output = replaceMeta(output, 'property="og:url"', canonical);
  output = replaceMeta(output, 'name="twitter:title"', title);
  output = replaceMeta(output, 'name="twitter:description"', description);
  output = replaceLink(output, "canonical", canonical);
  output = replaceLink(output, "alternate", canonical);
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

const templateSchemaMatch = template.match(/<script id="palugada-structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/i);
const templateSchema = JSON.parse(templateSchemaMatch?.[1] || "{}");
const baseGraph = getBaseGraph(templateSchema);
const products = await loadPublicProducts();

for (const product of products) {
  const slug = slugifyProduct(product.name);
  const canonical = absoluteUrl(`/produk/${slug}/`);
  const title = `${product.name} Murah & Bergaransi | ${SITE_NAME}`;
  const description = truncateDescription(
    `Beli ${product.name} murah dan terpercaya di Palugada Premium. ${product.description || product.tagline || "Akun premium bergaransi dengan proses mudah melalui WhatsApp."}`
  );
  const productSchema = createProductStructuredData(product);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      ...baseGraph,
      productSchema,
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Beranda", item: `${SITE_ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: "Katalog", item: `${SITE_ORIGIN}/#katalog` },
          { "@type": "ListItem", position: 3, name: product.name, item: canonical },
        ],
      },
    ],
  };
  const html = replacePublicMetadata(template, {
    title,
    description,
    canonical,
    type: "product",
    schema,
    noscriptContent: `<h1>${escapeHtml(product.name)}</h1><p>${escapeHtml(description)}</p><p>Harga mulai ${escapeHtml(new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(getProductStartingPrice(product, [])))}</p>`,
  });
  const directory = resolve(distDirectory, "produk", slug);
  await mkdir(directory, { recursive: true });
  await writeFile(resolve(directory, "index.html"), html, "utf8");
}

const resellerCanonical = absoluteUrl("/reseller/daftar/");
const resellerSchema = {
  "@context": "https://schema.org",
  "@graph": [
    ...baseGraph,
    {
      "@type": "BreadcrumbList",
      "@id": `${resellerCanonical}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Beranda", item: `${SITE_ORIGIN}/` },
        { "@type": "ListItem", position: 2, name: "Program Reseller", item: resellerCanonical },
      ],
    },
  ],
};
const resellerHtml = replacePublicMetadata(template, {
  title: `Program Reseller Akun Premium | ${SITE_NAME}`,
  description: "Daftar program reseller Palugada Premium dan dapatkan harga khusus untuk menjual kembali akun premium murah.",
  canonical: resellerCanonical,
  schema: resellerSchema,
  noscriptContent: "<h1>Program Reseller Palugada Premium</h1><p>Daftar program reseller akun premium untuk mendapatkan harga khusus dan margin penjualan kembali.</p>",
});
const resellerDirectory = resolve(distDirectory, "reseller", "daftar");
await mkdir(resellerDirectory, { recursive: true });
await writeFile(resolve(resellerDirectory, "index.html"), resellerHtml, "utf8");

console.log(`Generated ${products.length} product HTML pages and 1 reseller landing page.`);
