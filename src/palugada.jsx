import { useEffect, useState } from "react";
import { AdminPanel } from "./features/palugada/components/admin";
import { AdminLogin, ResellerLogin, ResellerRegister } from "./features/palugada/components/auth";
import { FloatingWhatsApp, Footer, Header, StyleBlock } from "./features/palugada/components/layout";
import { ResellerDashboard } from "./features/palugada/components/reseller";
import { CartView, Checkout, Detail, Home, OrderSuccess, TrackOrder } from "./features/palugada/components/storefront";
import { CONTACT_EMAIL, RESELLER_TIERS, getDefaultPlanSelection, getPlanSelection } from "./features/palugada/constants";
import { firebaseAuth } from "./features/palugada/lib/firebase";
import { loadProducts, storage } from "./features/palugada/lib/storage";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";

export default function App() {
  const [view, setView] = useState("home");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [productRequests, setProductRequests] = useState([]);
  const [resellers, setResellers] = useState([]);
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
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setAdminLoggedIn(Boolean(user && user.email === adminEmail));
    });

    (async () => {
      setProducts(await loadProducts());
      setOrders(await storage.get("pa_orders", []));
      setReviews(await storage.get("pa_reviews", []));
      setProductRequests(await storage.get("pa_product_requests", []));
      setResellers(await storage.get("pa_resellers", []));
      setLoaded(true);
    })();

    return unsubscribe;
  }, []);

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
    await storage.set("pa_reviews", nextReviews);
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
    await storage.set("pa_product_requests", nextRequests);
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
    await storage.set("pa_orders", nextOrders);

    if (reseller) {
      const updatedResellers = resellers.map((item) =>
        item.id === reseller.id
          ? { ...item, totalOrders: (item.totalOrders || 0) + 1, totalSpent: (item.totalSpent || 0) + cartTotal }
          : item
      );
      setResellers(updatedResellers);
      await storage.set("pa_resellers", updatedResellers);

      const currentReseller = updatedResellers.find((item) => item.id === reseller.id);
      let newTier = "Bronze";
      if (currentReseller.totalSpent >= RESELLER_TIERS.Gold.min) newTier = "Gold";
      else if (currentReseller.totalSpent >= RESELLER_TIERS.Silver.min) newTier = "Silver";

      if (newTier !== currentReseller.tier) {
        const tieredResellers = updatedResellers.map((item) =>
          item.id === reseller.id ? { ...item, tier: newTier } : item
        );
        setResellers(tieredResellers);
        await storage.set("pa_resellers", tieredResellers);
        setReseller({ ...currentReseller, tier: newTier });
      } else {
        setReseller(currentReseller);
      }
    }

    const nextProducts = products.map((product) => {
      const soldQty = cart.filter((item) => item.id === product.id).reduce((sum, item) => sum + item.qty, 0);
      return soldQty ? { ...product, stock: Math.max(0, product.stock - soldQty) } : product;
    });
    setProducts(nextProducts);
    await storage.set("pa_products", nextProducts);
    setCart([]);

    return order;
  };

  const registerReseller = async ({ name, email, wa, password, googleSub = null, avatar = "" }) => {
    const existing = resellers.find((item) => item.email === email);
    if (existing) {
      if (googleSub && existing.googleSub && existing.googleSub !== googleSub) {
        return { error: "Akun Google ini sudah terhubung ke reseller lain" };
      }

      if (googleSub) {
        const linked = { ...existing, googleSub, avatar: avatar || existing.avatar || "" };
        const nextResellers = resellers.map((item) => (item.id === existing.id ? linked : item));
        setResellers(nextResellers);
        await storage.set("pa_resellers", nextResellers);
        setReseller(linked);
        return { ok: true };
      }

      return { error: "Email sudah terdaftar" };
    }

    const newReseller = {
      id: "RSL-" + Date.now().toString(36).toUpperCase(),
      name,
      email,
      wa,
      password,
      googleSub,
      avatar,
      tier: "Bronze",
      totalOrders: 0,
      totalSpent: 0,
      joinedAt: new Date().toISOString(),
    };
    const nextResellers = [...resellers, newReseller];
    setResellers(nextResellers);
    await storage.set("pa_resellers", nextResellers);
    setReseller(newReseller);
    return { ok: true };
  };

  const loginReseller = async (email, password, googleProfile = null) => {
    if (googleProfile) {
      const existing = resellers.find((item) => item.email === googleProfile.email);
      if (!existing) {
        return registerReseller({
          name: googleProfile.name,
          email: googleProfile.email,
          wa: "",
          password: null,
          googleSub: googleProfile.sub,
          avatar: googleProfile.picture || "",
        });
      }

      if (existing.googleSub && existing.googleSub !== googleProfile.sub) {
        return { error: "Akun Google ini tidak cocok dengan reseller yang tersimpan" };
      }

      const linked = {
        ...existing,
        name: existing.name || googleProfile.name,
        googleSub: googleProfile.sub,
        avatar: googleProfile.picture || existing.avatar || "",
      };
      const nextResellers = resellers.map((item) => (item.id === existing.id ? linked : item));
      setResellers(nextResellers);
      await storage.set("pa_resellers", nextResellers);
      setReseller(linked);
      return { ok: true };
    }

    const foundReseller = resellers.find((item) => item.email === email && item.password === password);
    if (!foundReseller) {
      return { error: "Email atau password salah" };
    }
    setReseller(foundReseller);
    return { ok: true };
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
    await storage.set("pa_orders", nextOrders);
  };

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="mono text-sm tracking-widest" style={{ color: "var(--ink-dim)" }}>LOADING…</div>
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
          <TrackOrder orders={orders} onBack={() => setView("home")} />
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
            onLogin={async (email, password, googleProfile) => {
              const result = await loginReseller(email, password, googleProfile);
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
            onRegister={async (data) => {
              const result = await registerReseller(data);
              if (result.ok) {
                setView("reseller-dashboard");
                showToast("Pendaftaran berhasil!");
              }
              return result;
            }}
            onLogin={() => setView("reseller-login")}
          />
        )}
        {view === "reseller-dashboard" && reseller && (
          <ResellerDashboard
            reseller={reseller}
            orders={orders.filter((order) => order.resellerId === reseller.id)}
            onBack={() => setView("home")}
            onLogout={() => {
              setReseller(null);
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
