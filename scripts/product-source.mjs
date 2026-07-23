import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import process from "node:process";
import { loadEnv } from "vite";
import { AUTO_SYNC_SEED_PRODUCT_IDS, SEED_PRODUCTS } from "../src/features/palugada/constants.js";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, "..");

function decodeFirestoreValue(value = {}) {
  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return Number(value.doubleValue);
  if ("booleanValue" in value) return value.booleanValue;
  if ("timestampValue" in value) return value.timestampValue;
  if ("nullValue" in value) return null;
  if ("arrayValue" in value) return (value.arrayValue.values || []).map(decodeFirestoreValue);
  if ("mapValue" in value) return decodeFirestoreFields(value.mapValue.fields || {});
  return undefined;
}

function decodeFirestoreFields(fields = {}) {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, decodeFirestoreValue(value)])
  );
}

export async function loadPublicProducts() {
  const env = loadEnv(process.env.NODE_ENV || "production", projectRoot, "");
  if (!env.VITE_FIREBASE_PROJECT_ID || !env.VITE_FIREBASE_API_KEY) {
    return SEED_PRODUCTS;
  }

  try {
    const endpoint = new URL(
      `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(env.VITE_FIREBASE_PROJECT_ID)}/databases/(default)/documents/products`
    );
    endpoint.searchParams.set("key", env.VITE_FIREBASE_API_KEY);
    endpoint.searchParams.set("pageSize", "100");
    const response = await fetch(endpoint, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) {
      throw new Error(`firestore-http-${response.status}`);
    }

    const payload = await response.json();
    const remoteProducts = (payload.documents || [])
      .map((document) => ({
        id: document.name?.split("/").pop(),
        ...decodeFirestoreFields(document.fields),
      }))
      .filter((product) => product.name);

    if (!remoteProducts.length) {
      return SEED_PRODUCTS;
    }

    const remoteProductIds = new Set(remoteProducts.map((product) => product.id));
    const missingSeedProducts = SEED_PRODUCTS.filter(
      (product) => AUTO_SYNC_SEED_PRODUCT_IDS.includes(product.id) && !remoteProductIds.has(product.id)
    );
    return [...remoteProducts, ...missingSeedProducts];
  } catch (error) {
    console.warn(
      `Remote build products unavailable; using ${SEED_PRODUCTS.length} seed products.`,
      error?.message || "unknown-error"
    );
    return SEED_PRODUCTS;
  }
}
