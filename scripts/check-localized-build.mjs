import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { SITE_ORIGIN, slugifyProduct } from "../src/features/palugada/lib/seo.js";
import { loadPublicProducts } from "./product-source.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const distDirectory = resolve(scriptDirectory, "../dist");
const publicDirectory = resolve(scriptDirectory, "../public");
const products = await loadPublicProducts();
const sitemap = await readFile(resolve(publicDirectory, "sitemap.xml"), "utf8");

for (const locale of ["id", "jp"]) {
  const language = locale === "jp" ? "ja" : "id";
  const currency = locale === "jp" ? "JPY" : "IDR";
  const home = await readFile(resolve(distDirectory, locale, "index.html"), "utf8");
  assert.match(home, new RegExp(`<html lang="${language}"`));
  assert.match(home, new RegExp(`rel="canonical" href="${SITE_ORIGIN}/${locale}/"`));
  assert.match(home, /hreflang="id-ID"/);
  assert.match(home, /hreflang="ja-JP"/);

  for (const product of products) {
    const slug = slugifyProduct(product.name);
    const canonical = `${SITE_ORIGIN}/${locale}/produk/${slug}/`;
    const html = await readFile(resolve(distDirectory, locale, "produk", slug, "index.html"), "utf8");
    assert.match(html, new RegExp(`<html lang="${language}"`));
    assert.ok(html.includes(`rel="canonical" href="${canonical}"`));
    assert.ok(html.includes(`"priceCurrency":"${currency}"`));
    assert.ok(sitemap.includes(`<loc>${canonical}</loc>`));
  }
}

assert.equal((sitemap.match(/<url>/g) || []).length, products.length * 2 + 4);
console.log(`Localized build checks passed for ${products.length * 2 + 4} URLs.`);
