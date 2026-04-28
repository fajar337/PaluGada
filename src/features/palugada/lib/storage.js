import { SEED_PRODUCTS } from "../constants";
import { firestore } from "./firebase";
import { collection, doc, getDoc, getDocs, setDoc, writeBatch } from "firebase/firestore";

const REMOTE_COLLECTIONS = {
  pa_products: { collection: "products", type: "array" },
  pa_promos: { collection: "promos", type: "array" },
  pa_orders: { collection: "orders", type: "array" },
  pa_resellers: { collection: "resellers", type: "array" },
  pa_reviews: { collection: "reviews", type: "array" },
  pa_product_requests: { collection: "productRequests", type: "array" },
  pa_admin: { collection: "appConfig", type: "single", docId: "admin" },
  pa_reseller_tiers: { collection: "appConfig", type: "single", docId: "resellerTiers" },
};

function readLocal(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
  } catch {
    // Ignore malformed localStorage content and fall back.
  }

  return fallback;
}

function writeLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getRemoteConfig(key) {
  return REMOTE_COLLECTIONS[key] || null;
}

function getItemId(item, index) {
  return item?.id || item?.productId || `item-${index}`;
}

function normalizeLegacyProduct(product, seedProduct) {
  if (!product || !seedProduct) {
    return product;
  }

  if (
    product.id === "p_netflix" &&
    (String(product.tagline || "").toLowerCase().includes("grand opening") ||
      String(product.description || "").toLowerCase().includes("grand opening"))
  ) {
    return {
      ...product,
      price: seedProduct.price,
      oldPrice: seedProduct.oldPrice,
      tagline: seedProduct.tagline,
      description: seedProduct.description,
      features: seedProduct.features,
      pricingPlans: seedProduct.pricingPlans,
    };
  }

  return product;
}

async function getRemote(key, fallback) {
  const config = getRemoteConfig(key);
  if (!config) {
    return fallback;
  }

  if (config.type === "single") {
    const snapshot = await getDoc(doc(firestore, config.collection, config.docId));
    return snapshot.exists() ? snapshot.data() : fallback;
  }

  const snapshot = await getDocs(collection(firestore, config.collection));
  if (snapshot.empty && fallback === null) {
    return null;
  }

  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

async function setRemote(key, value) {
  const config = getRemoteConfig(key);
  if (!config) {
    return;
  }

  if (config.type === "single") {
    await setDoc(doc(firestore, config.collection, config.docId), value);
    return;
  }

  const nextItems = Array.isArray(value) ? value : [];
  const collectionRef = collection(firestore, config.collection);
  const currentSnapshot = await getDocs(collectionRef);
  const nextIds = new Set(nextItems.map((item, index) => getItemId(item, index)));
  const batch = writeBatch(firestore);

  nextItems.forEach((item, index) => {
    const id = getItemId(item, index);
    batch.set(doc(firestore, config.collection, id), item);
  });

  currentSnapshot.docs.forEach((item) => {
    if (!nextIds.has(item.id)) {
      batch.delete(doc(firestore, config.collection, item.id));
    }
  });

  await batch.commit();
}

export const storage = {
  async get(key, fallback) {
    const localValue = readLocal(key, fallback);

    try {
      const remoteValue = await getRemote(key, fallback);
      if (remoteValue !== fallback && remoteValue !== null) {
        writeLocal(key, remoteValue);
        return remoteValue;
      }

      if (localValue !== fallback && localValue !== null) {
        await setRemote(key, localValue);
        return localValue;
      }
    } catch (error) {
      console.warn(`Firebase read failed for ${key}; using local fallback.`, error);
    }

    return localValue;
  },
  async set(key, value) {
    writeLocal(key, value);

    try {
      await setRemote(key, value);
    } catch (error) {
      console.warn(`Firebase write failed for ${key}; saved locally only.`, error);
    }
  },
};

export async function addItem(key, item) {
  const config = getRemoteConfig(key);
  writeLocal(key, [item, ...readLocal(key, [])]);

  if (!config || config.type !== "array") {
    return item;
  }

  try {
    await setDoc(doc(firestore, config.collection, getItemId(item, 0)), item);
  } catch (error) {
    console.warn(`Firebase add failed for ${key}; saved locally only.`, error);
  }

  return item;
}

export async function updateItem(key, id, nextItem) {
  const current = readLocal(key, []);
  writeLocal(
    key,
    current.map((item) => (getItemId(item, 0) === id ? nextItem : item))
  );

  const config = getRemoteConfig(key);
  if (!config || config.type !== "array") {
    return nextItem;
  }

  try {
    await setDoc(doc(firestore, config.collection, id), nextItem);
  } catch (error) {
    console.warn(`Firebase update failed for ${key}; saved locally only.`, error);
  }

  return nextItem;
}

export async function getItem(key, id, fallback = null) {
  const config = getRemoteConfig(key);
  const localItem = readLocal(key, []).find((item) => getItemId(item, 0) === id) || fallback;

  if (!config || config.type !== "array") {
    return localItem;
  }

  try {
    const snapshot = await getDoc(doc(firestore, config.collection, id));
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : localItem;
  } catch (error) {
    console.warn(`Firebase item read failed for ${key}; using local fallback.`, error);
    return localItem;
  }
}

export async function loadProducts() {
  const products = await storage.get("pa_products", null);
  if (products) {
    const nextProducts = products.map((product) => {
      if (!["p_netflix", "p_capcut", "p_yt", "p_spotify", "p_chatgpt", "p_canva"].includes(product.id)) {
        return product;
      }

      const seedProduct = SEED_PRODUCTS.find((item) => item.id === product.id);
      const normalizedProduct = normalizeLegacyProduct(product, seedProduct);
      return {
        ...seedProduct,
        ...normalizedProduct,
        stock: normalizedProduct.stock ?? seedProduct.stock,
      };
    });

    await storage.set("pa_products", nextProducts);
    return nextProducts;
  }

  await storage.set("pa_products", SEED_PRODUCTS);
  return SEED_PRODUCTS;
}

export async function loadAdmin() {
  const admin = await storage.get("pa_admin", null);
  if (admin) {
    if (admin.username !== "admin" || admin.password !== "admin123") {
      const nextAdmin = { username: "admin", password: "admin123" };
      await storage.set("pa_admin", nextAdmin);
      return nextAdmin;
    }

    return admin;
  }

  const defaultAdmin = { username: "admin", password: "admin123" };
  await storage.set("pa_admin", defaultAdmin);
  return defaultAdmin;
}
