import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { SITE_ORIGIN, slugifyProduct } from "../src/features/palugada/lib/seo.js";
import { loadPublicProducts } from "./product-source.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(scriptDirectory, "../public/sitemap.xml");
const lastModified = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Jakarta",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
const sitemapProducts = await loadPublicProducts();

const entries = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/reseller/daftar/", changefreq: "monthly", priority: "0.6" },
  ...sitemapProducts.map((product) => ({
    path: `/produk/${slugifyProduct(product.name)}/`,
    changefreq: "weekly",
    priority: "0.8",
  })),
];

const urls = entries
  .map(
    ({ path, changefreq, priority }) => `  <url>
    <loc>${new URL(path, `${SITE_ORIGIN}/`).toString()}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

await writeFile(outputPath, sitemap, "utf8");
console.log(`Generated ${entries.length} sitemap URLs at ${outputPath}`);
