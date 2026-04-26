import { useEffect, useState } from "react";
import { AdminPanel } from "./features/palugada/components/admin";
import { AdminLogin, ResellerLogin, ResellerRegister } from "./features/palugada/components/auth";
import { FloatingWhatsApp, Footer, Header, StyleBlock } from "./features/palugada/components/layout";
import { ResellerDashboard } from "./features/palugada/components/reseller";
import { CartView, Checkout, Detail, Home, OrderSuccess, TrackOrder } from "./features/palugada/components/storefront";
import { CONTACT_EMAIL, RESELLER_TIERS, getDefaultPlanSelection, getPlanSelection } from "./features/palugada/constants";
import {
  createResellerAuthByAdmin,
  firebaseAuth,
  getResellerOrders,
  getResellerProfileByUid,
  loginResellerAuth,
  saveResellerProfile,
} from "./features/palugada/lib/firebase";
import { addItem, getItem, loadProducts, storage, updateItem } from "./features/palugada/lib/storage";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";

export default function App() {
  const [view, setView] = useState("home");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [productRequests, setProductRequests] = useState([]);
  const [resellers, setResellers] = useState([]);
  const [resellerOrders, setResellerOrders] = useState([]);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [reseller, setReseller] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartPulse, setCartPulse] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [toast, setToast] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const adminEmail = import.meta.env.VITE_FIREBASE_ADMIN_EMAIL || CONTACT_EMAIL;
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      setAdminLoggedIn(Boolean(user && user.email === adminEmail));

      if (!user || user.email === adminEmail) {
        setReseller(null);
        setResellerOrders([]);
        return;
      }

      const profile = await getResellerProfileByUid(user.uid);
      if (profile) {
        setReseller({ ...profile, id: user.uid, email: user.email });
        return;
      }

      const created = await saveResellerProfile(user.uid, {
        id: user.uid,
        name: user.displayName || user.email?.split("@")[0] || "Reseller",
        email: user.email || "",
        wa: "",
        avatar: user.photoURL || "",
        tier: "Bronze",
        totalOrders: 0,
        totalSpent: 0,
        joinedAt: new Date().toISOString(),
      });
      setReseller(
        created || {
          id: user.uid,
          name: user.displayName || user.email?.split("@")[0] || "Reseller",
          email: user.email || "",
          wa: "",
          avatar: user.photoURL || "",
          tier: "Bronze",
          totalOrders: 0,
          totalSpent: 0,
          joinedAt: new Date().toISOString(),
        }
      );
    });

    (async () => {
      setProducts(await loadProducts());
      setReviews(await storage.get("pa_reviews", []));
      setLoaded(true);
    })();

    return unsubscribe;
  }, [adminLoggedIn]);

  useEffect(() => {
    if (!adminLoggedIn) {
      return;
    }

    (async () => {
      setOrders(await storage.get("pa_orders", []));
      setProductRequests(await storage.get("pa_product_requests", []));
      setResellers(await storage.get("pa_resellers", []));
    })();
  }, [adminLoggedIn]);

  useEffect(() => {
    if (!reseller?.id || adminLoggedIn) {
      setResellerOrders([]);
      return;
    }

    (async () => {
      setResellerOrders(await getResellerOrders(reseller.id));
    })();
  }, [adminLoggedIn, reseller?.id]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2400);
  };

  const getPrice = (product, basePrice = product.price) => {
    if (!reseller) {
      return basePrice;
    }
    const tier = RESELLER_TIERS[reseller.tier] || RESELLER_TIERS.Bronze;
    return Math.round(basePrice * (1 - tier.discount));
  };

  const cartItems = cart
    .map((cartItem) => {
      const product = products.find((item) => item.id === cartItem.id);
      if (!product) {
        return null;
      }
      const selectedPlan = getPlanSelection(product, cartItem.planId, cartItem.optionId);
      const basePrice = selectedPlan?.option.price || product.price;
      return {
        ...product,
        cartKey: cartItem.key || cartItem.id,
        qty: cartItem.qty,
        price: basePrice,
        effectivePrice: getPrice(product, basePrice),
        selectedPlanName: selectedPlan?.plan.name || "",
        selectedDuration: selectedPlan?.option.duration || product.duration,
        selectedPlanId: selectedPlan?.plan.id || null,
        selectedOptionId: selectedPlan?.option.id || null,
      };
    })
    .filter(Boolean);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.effectivePrice * item.qty, 0);
  const cartOriginal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const addToCart = (id, qty = 1, selection = null) => {
    const key = selection ? `${id}:${selection.planId}:${selection.optionId}` : id;
    setCart((current) => {
      const existing = current.find((item) => (item.key || item.id) === key);
      if (existing) {
        return current.map((item) => ((item.key || item.id) === key ? { ...item, qty: item.qty + qty } : item));
      }
      return [...current, { key, id, qty, planId: selection?.planId || null, optionId: selection?.optionId || null }];
    });
    setCartPulse(true);
    setTimeout(() => setCartPulse(false), 520);
    showToast("Ditambahkan ke keranjang");
  };

  const updateQty = (key, delta) => {
    setCart((current) =>
      current.map((item) => ((item.key || item.id) === key ? { ...item, qty: Math.max(1, item.qty + delta) } : item))
    );
  };

  const removeFromCart = (key) => {
    setCart((current) => current.filter((item) => (item.key || item.id) !== key));
  };

  const addReview = async (productId, data) => {
    const review = {
      id: "REV-" + Date.now().toString(36).toUpperCase(),
      productId,
      name: data.name.trim(),
      rating: Number(data.rating),
      message: data.message.trim(),
      createdAt: new Date().toISOString(),
    };
    const nextReviews = [review, ...reviews];
    setReviews(nextReviews);
    await addItem("pa_reviews", review);
    showToast("Ulasan berhasil ditambahkan");
  };

  const addProductRequest = async (data) => {
    const request = {
      id: "REQ-" + Date.now().toString(36).toUpperCase(),
      name: data.name.trim(),
      wa: data.wa.trim(),
      appName: data.appName.trim(),
      note: data.note.trim(),
      status: "Baru",
      createdAt: new Date().toISOString(),
    };
    const nextRequests = [request, ...productRequests];
    setProductRequests(nextRequests);
    await addItem("pa_product_requests", request);
    showToast("Request produk berhasil dikirim");
  };

  const placeOrder = async (buyer) => {
    const order = {
      id: "ORD-" + Date.now().toString(36).toUpperCase(),
      buyer,
      items: cartItems.map((item) => ({
        id: item.cartKey,
        productId: item.id,
        name: item.name,
        plan: item.selectedPlanName,
        duration: item.selectedDuration,
        price: item.effectivePrice,
        originalPrice: item.price,
        qty: item.qty,
      })),
      total: cartTotal,
      originalTotal: cartOriginal,
      profit: cartOriginal - cartTotal,
      status: "Menunggu Pembayaran",
      resellerId: reseller?.id || null,
      createdAt: new Date().toISOString(),
    };

    const nextOrders = [order, ...orders];
    setOrders(nextOrders);
    await addItem("pa_orders", order);
    if (reseller) {
      setResellerOrders((current) => [order, ...current]);
    }

    if (reseller) {
      const nextTotalOrders = (reseller.totalOrders || 0) + 1;
      const nextTotalSpent = (reseller.totalSpent || 0) + cartTotal;
      let nextTier = "Bronze";
      if (nextTotalSpent >= RESELLER_TIERS.Gold.min) nextTier = "Gold";
      else if (nextTotalSpent >= RESELLER_TIERS.Silver.min) nextTier = "Silver";

      const savedReseller = await saveResellerProfile(reseller.id, {
        ...reseller,
        totalOrders: nextTotalOrders,
        totalSpent: nextTotalSpent,
        tier: nextTier,
      });
      const nextReseller = savedReseller || {
        ...reseller,
        totalOrders: nextTotalOrders,
        totalSpent: nextTotalSpent,
        tier: nextTier,
      };
      setReseller(nextReseller);
      setResellers((current) => [nextReseller, ...current.filter((item) => item.id !== nextReseller.id)]);
    }

    const nextProducts = products.map((product) => {
      const soldQty = cart.filter((item) => item.id === product.id).reduce((sum, item) => sum + item.qty, 0);
      return soldQty ? { ...product, stock: Math.max(0, product.stock - soldQty) } : product;
    });
    setProducts(nextProducts);
    setCart([]);

    return order;
  };

  const loginReseller = async (email, password) => {
    const user = await loginResellerAuth(email, password);
    const foundReseller = await getResellerProfileByUid(user.uid);
    if (!foundReseller) {
      const created = await saveResellerProfile(user.uid, {
        id: user.uid,
        name: user.displayName || user.email?.split("@")[0] || "Reseller",
        email: user.email || email,
        wa: "",
        avatar: user.photoURL || "",
        tier: "Bronze",
        totalOrders: 0,
        totalSpent: 0,
        joinedAt: new Date().toISOString(),
      });
      setReseller(
        created || {
          id: user.uid,
          name: user.displayName || user.email?.split("@")[0] || "Reseller",
          email: user.email || email,
          wa: "",
          avatar: user.photoURL || "",
          tier: "Bronze",
          totalOrders: 0,
          totalSpent: 0,
          joinedAt: new Date().toISOString(),
        }
      );
      return { ok: true };
    }
    const linked = await saveResellerProfile(user.uid, {
      ...foundReseller,
      id: user.uid,
      email: user.email || foundReseller.email,
    });
    setReseller(linked || foundReseller);
    return { ok: true };
  };

  const createResellerByAdmin = async ({ name, email, wa, password, tier = "Bronze" }) => {
    const user = await createResellerAuthByAdmin({ name, email, password });
    const resellerProfile = {
      id: user.uid,
      authUid: user.uid,
      name: name.trim(),
      email: user.email || email.trim(),
      wa: wa.trim(),
      avatar: "",
      tier,
      totalOrders: 0,
      totalSpent: 0,
      joinedAt: new Date().toISOString(),
    };

    const saved = await saveResellerProfile(user.uid, resellerProfile);
    const nextReseller = saved || resellerProfile;
    setResellers((current) => {
      const nextResellers = [nextReseller, ...current.filter((item) => item.id !== nextReseller.id)];
      storage.set("pa_resellers", nextResellers);
      return nextResellers;
    });
    showToast(`Akun reseller ${nextReseller.name} berhasil diaktifkan`);
    return { ok: true, reseller: nextReseller };
  };

  const markOrderWaitingVerification = async (orderId) => {
    const nextOrders = orders.map((order) =>
      order.id === orderId && order.status === "Menunggu Pembayaran"
        ? { ...order, status: "Menunggu Verifikasi" }
        : order
    );
    const nextActiveOrder =
      activeOrder?.id === orderId && activeOrder.status === "Menunggu Pembayaran"
        ? { ...activeOrder, status: "Menunggu Verifikasi" }
        : activeOrder;

    setOrders(nextOrders);
    setActiveOrder(nextActiveOrder);
    if (nextActiveOrder) {
      await updateItem("pa_orders", orderId, nextActiveOrder);
    } else {
      const nextOrder = nextOrders.find((order) => order.id === orderId);
      if (nextOrder) {
        await updateItem("pa_orders", orderId, nextOrder);
      }
    }
  };

  const findOrder = async (orderId, wa) => {
    const order = await getItem("pa_orders", orderId, null);
    const digits = String(wa || "").replace(/\D/g, "");
    const orderDigits = String(order?.buyer?.wa || "").replace(/\D/g, "");

    if (!order || !digits || !orderDigits.endsWith(digits.slice(-8))) {
      return null;
    }

    return order;
  };

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="mono text-sm tracking-widest" style={{ color: "var(--ink-dim)" }}>LOADING...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--ink)" }}>
      <StyleBlock />
      {!view.startsWith("admin") && (
        <Header
          cartCount={cartCount}
          cartPulse={cartPulse}
          reseller={reseller}
          onCart={() => setView("cart")}
          onHome={() => setView("home")}
          onAdmin={() => setView(adminLoggedIn ? "admin" : "admin-login")}
          onTrackOrder={() => setView("track-order")}
          onResellerLogin={() => setView("reseller-login")}
          onResellerDash={() => setView("reseller-dashboard")}
        />
      )}

      <main>
        {view === "home" && (
          <Home
            products={products}
            reviews={reviews}
            reseller={reseller}
            getPrice={getPrice}
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            onOpen={(product) => {
              setActiveProduct(product);
              setView("detail");
            }}
            onAdd={(product, selection) => addToCart(product.id, 1, selection ?? getDefaultPlanSelection(product))}
            onRequestProduct={addProductRequest}
            onJoinReseller={() => setView("reseller-register")}
          />
        )}
        {view === "detail" && activeProduct && (
          <Detail
            product={products.find((product) => product.id === activeProduct.id) || activeProduct}
            reviews={reviews.filter((review) => review.productId === activeProduct.id)}
            reseller={reseller}
            getPrice={getPrice}
            onBack={() => setView("home")}
            onAdd={(qty, selection) => addToCart(activeProduct.id, qty, selection)}
            onReview={(data) => addReview(activeProduct.id, data)}
            onBuy={(qty, selection) => {
              addToCart(activeProduct.id, qty, selection);
              setView("checkout");
            }}
          />
        )}
        {view === "cart" && (
          <CartView
            items={cartItems}
            total={cartTotal}
            originalTotal={cartOriginal}
            updateQty={updateQty}
            remove={removeFromCart}
            onBack={() => setView("home")}
            onCheckout={() => setView("checkout")}
          />
        )}
        {view === "track-order" && (
          <TrackOrder onFindOrder={findOrder} onBack={() => setView("home")} />
        )}
        {view === "checkout" && (
          <Checkout
            items={cartItems}
            total={cartTotal}
            reseller={reseller}
            onBack={() => setView("cart")}
            onPlace={async (buyer) => {
              const order = await placeOrder(buyer);
              setActiveOrder(order);
              setView("order-success");
              showToast("Booking " + order.id + " berhasil dibuat!");
            }}
          />
        )}
        {view === "order-success" && (
          <OrderSuccess
            order={activeOrder}
            onHome={() => setView("home")}
            onAdmin={() => setView(adminLoggedIn ? "admin" : "admin-login")}
            onConfirmPayment={() => activeOrder && markOrderWaitingVerification(activeOrder.id)}
          />
        )}
        {view === "reseller-login" && (
          <ResellerLogin
            onBack={() => setView("home")}
            onLogin={async (email, password) => {
              const result = await loginReseller(email, password);
              if (result.ok) {
                setView("reseller-dashboard");
                showToast("Selamat datang kembali!");
              }
              return result;
            }}
            onRegister={() => setView("reseller-register")}
          />
        )}
        {view === "reseller-register" && (
          <ResellerRegister
            onBack={() => setView("home")}
            onLogin={() => setView("reseller-login")}
          />
        )}
        {view === "reseller-dashboard" && reseller && (
          <ResellerDashboard
            reseller={reseller}
            orders={resellerOrders}
            onBack={() => setView("home")}
            onLogout={async () => {
              await signOut(firebaseAuth);
              setReseller(null);
              setResellerOrders([]);
              setView("home");
            }}
          />
        )}
        {view === "admin-login" && (
          <AdminLogin
            onBack={() => setView("home")}
            onLogin={async (email, password) => {
              const adminEmail = import.meta.env.VITE_FIREBASE_ADMIN_EMAIL || CONTACT_EMAIL;
              const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
              if (credential.user.email !== adminEmail) {
                await signOut(firebaseAuth);
                return { error: "Email ini tidak terdaftar sebagai admin" };
              }

              setView("admin");
              return { ok: true };
            }}
          />
        )}
        {view === "admin" && adminLoggedIn && (
          <AdminPanel
            products={products}
            setProducts={async (nextProducts) => {
              setProducts(nextProducts);
              await storage.set("pa_products", nextProducts);
            }}
            reviews={reviews}
            setReviews={async (nextReviews) => {
              setReviews(nextReviews);
              await storage.set("pa_reviews", nextReviews);
            }}
            orders={orders}
            setOrders={async (nextOrders) => {
              setOrders(nextOrders);
              await storage.set("pa_orders", nextOrders);
            }}
            resellers={resellers}
            setResellers={async (nextResellers) => {
              setResellers(nextResellers);
              await storage.set("pa_resellers", nextResellers);
            }}
            onCreateReseller={createResellerByAdmin}
            productRequests={productRequests}
            setProductRequests={async (nextRequests) => {
              setProductRequests(nextRequests);
              await storage.set("pa_product_requests", nextRequests);
            }}
            onLogout={async () => {
              await signOut(firebaseAuth);
              setAdminLoggedIn(false);
              setView("home");
            }}
          />
        )}
      </main>

      {!view.startsWith("admin") && view !== "reseller-login" && view !== "reseller-register" && <Footer />}
      {!view.startsWith("admin") && view !== "reseller-login" && view !== "reseller-register" && <FloatingWhatsApp />}
      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full text-sm font-medium shadow-2xl toast-pop" style={{ background: "var(--ink)", color: "var(--bg)" }}>{toast}</div>}
    </div>
  );
}
