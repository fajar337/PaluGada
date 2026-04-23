import { SEED_PRODUCTS } from "../constants";
import { firestore } from "./firebase";
import { collection, doc, getDoc, getDocs, setDoc, writeBatch } from "firebase/firestore";

const REMOTE_COLLECTIONS = {
  pa_products: { collection: "products", type: "array" },
  pa_orders: { collection: "orders", type: "array" },
  pa_resellers: { collection: "resellers", type: "array" },
  pa_reviews: { collection: "reviews", type: "array" },
  pa_product_requests: { collection: "productRequests", type: "array" },
  pa_admin: { collection: "appConfig", type: "single", docId: "admin" },
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

export async function loadProducts() {
  const products = await storage.get("pa_products", null);
  if (products) {
    const nextProducts = products.map((product) => {
      if (!["p_netflix", "p_capcut", "p_yt", "p_spotify", "p_chatgpt", "p_canva"].includes(product.id)) {
        return product;
      }

      const seedProduct = SEED_PRODUCTS.find((item) => item.id === product.id);
      return { ...product, ...seedProduct, stock: product.stock ?? seedProduct.stock };
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
