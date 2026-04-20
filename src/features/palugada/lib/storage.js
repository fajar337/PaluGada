import { SEED_PRODUCTS } from "../constants";

export const storage = {
  async get(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      if (value) {
        return JSON.parse(value);
      }
    } catch {
      // Ignore malformed localStorage content and fall back.
    }

    return fallback;
  },
  async set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
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
    return admin;
  }

  const defaultAdmin = { username: "admin", password: "admin123" };
  await storage.set("pa_admin", defaultAdmin);
  return defaultAdmin;
}
