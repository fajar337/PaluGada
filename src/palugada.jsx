import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { AdminLogin, ResellerLogin, ResellerRegister } from "./features/palugada/components/auth";
import { FloatingWhatsApp, Footer, Header, StyleBlock } from "./features/palugada/components/layout";
import { ResellerDashboard } from "./features/palugada/components/reseller";
import { SeoHead } from "./features/palugada/components/seo";
import { CartView, Checkout, Detail, Home, OrderSuccess, TrackOrder } from "./features/palugada/components/storefront";
import { CONTACT_EMAIL, RESELLER_TIERS, SEED_PRODUCTS, fmtIDR, getDefaultPlanSelection, getPlanSelection, getPricingForSelection } from "./features/palugada/constants";
import { getRouteState, getViewPath, slugifyProduct } from "./features/palugada/lib/seo";

const AdminPanel = lazy(() =>
  import("./features/palugada/components/admin").then((module) => ({ default: module.AdminPanel }))
);

let firebaseModulePromise;
let storageModulePromise;

function loadFirebaseModule() {
  firebaseModulePromise ||= import("./features/palugada/lib/firebase");
  return firebaseModulePromise;
}

function loadStorageModule() {
  storageModulePromise ||= import("./features/palugada/lib/storage");
  return storageModulePromise;
}

const storage = {
  async get(...args) {
    return (await loadStorageModule()).storage.get(...args);
  },
  async set(...args) {
    return (await loadStorageModule()).storage.set(...args);
  },
};

async function addItem(...args) {
  return (await loadStorageModule()).addItem(...args);
}

async function getItem(...args) {
  return (await loadStorageModule()).getItem(...args);
}

async function loadProducts(...args) {
  return (await loadStorageModule()).loadProducts(...args);
}

async function updateItem(...args) {
  return (await loadStorageModule()).updateItem(...args);
}

async function createResellerAuthByAdmin(...args) {
  return (await loadFirebaseModule()).createResellerAuthByAdmin(...args);
}

async function getResellerOrders(...args) {
  return (await loadFirebaseModule()).getResellerOrders(...args);
}

async function getResellerProfileByUid(...args) {
  return (await loadFirebaseModule()).getResellerProfileByUid(...args);
}

async function loginResellerAuth(...args) {
  return (await loadFirebaseModule()).loginResellerAuth(...args);
}

async function saveResellerProfile(...args) {
  return (await loadFirebaseModule()).saveResellerProfile(...args);
}

async function changeCurrentUserPassword(...args) {
  return (await loadFirebaseModule()).changeCurrentUserPassword(...args);
}

async function logoutCurrentUser() {
  return (await loadFirebaseModule()).logoutCurrentUser();
}

const UI_STATE_KEY = "pa_ui_state";
const DEFAULT_STORE_STATUS = {
  isOpen: true,
  closedReason: "",
  updatedAt: null,
};

function loadUiState() {
  if (typeof window === "undefined") {
    return {};
  }

  let savedState = {};
  try {
    savedState = JSON.parse(window.localStorage.getItem(UI_STATE_KEY) || "{}");
  } catch {
    savedState = {};
  }

  const routeState = getRouteState(window.location.pathname);
  const querySearch = new URLSearchParams(window.location.search).get("q");

  return {
    ...savedState,
    ...routeState,
    activeProductId:
      routeState.view === "detail" && !routeState.activeProductSlug ? savedState.activeProductId : null,
    activeProductSlug: routeState.activeProductSlug || null,
    search: querySearch ?? savedState.search ?? "",
  };
}

function readCachedValue(key, fallback) {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function scrollToPageTop() {
  if (typeof window === "undefined") {
    return;
  }

  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export default function App() {
  const initialUiState = loadUiState();
  const [view, setView] = useState(initialUiState.view || "home");
  const [products, setProducts] = useState(() => readCachedValue("pa_products", SEED_PRODUCTS));
  const [resellerTiers, setResellerTiers] = useState(() => readCachedValue("pa_reseller_tiers", RESELLER_TIERS));
  const [promos, setPromos] = useState(() => readCachedValue("pa_promos", []));
  const [coupons, setCoupons] = useState(() => readCachedValue("pa_coupons", []));
  const [storeStatus, setStoreStatus] = useState(() => readCachedValue("pa_store_status", DEFAULT_STORE_STATUS));
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState(() => readCachedValue("pa_reviews", []));
  const [productRequests, setProductRequests] = useState([]);
  const [notifications, setNotifications] = useState(() => readCachedValue("pa_notifications", []));
  const [activityLogs, setActivityLogs] = useState(() => readCachedValue("pa_activity_logs", []));
  const [notificationPermission, setNotificationPermission] = useState("default");
  const [resellers, setResellers] = useState([]);
  const [resellerOrders, setResellerOrders] = useState([]);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [authResolved, setAuthResolved] = useState(false);
  const [reseller, setReseller] = useState(null);
  const [cart, setCart] = useState(initialUiState.cart || []);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [cartPulse, setCartPulse] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);
  const [search, setSearch] = useState(initialUiState.search || "");
  const [category, setCategory] = useState(initialUiState.category || "Semua");
  const [toast, setToast] = useState(null);
  const [storeClosedNoticeVisible, setStoreClosedNoticeVisible] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const historyReadyRef = useRef(false);
  const historyKeyRef = useRef("");
  const restoringHistoryRef = useRef(false);
  const initialViewRef = useRef(view);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe = () => {};

    const loadingFrame = window.requestAnimationFrame(() => {
      if (!cancelled) {
        setLoaded(true);
      }
    });

    const hydrateBackend = async () => {
      try {
        const firebaseModule = await loadFirebaseModule();
        if (cancelled) {
          return;
        }

        const adminEmail = import.meta.env.VITE_FIREBASE_ADMIN_EMAIL || CONTACT_EMAIL;
        unsubscribe = firebaseModule.subscribeToAuthState(async (user) => {
          if (cancelled) {
            return;
          }

          const isAdmin = Boolean(user && user.email === adminEmail);
          setAdminLoggedIn(isAdmin);

          if (!user || user.email === adminEmail) {
            setReseller(null);
            setResellerOrders([]);
            setAuthResolved(true);
            return;
          }

          const profile = await getResellerProfileByUid(user.uid);
          if (cancelled) {
            return;
          }
          if (profile) {
            setReseller({ ...profile, id: user.uid, email: user.email });
            setAuthResolved(true);
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
          if (cancelled) {
            return;
          }
          setReseller(created || {
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
          setAuthResolved(true);
        });

        const [nextProducts, savedTiers, nextPromos, nextCoupons, nextStoreStatus, nextReviews, nextNotifications, nextActivityLogs] =
          await Promise.all([
            loadProducts(),
            storage.get("pa_reseller_tiers", RESELLER_TIERS),
            storage.get("pa_promos", []),
            storage.get("pa_coupons", []),
            storage.get("pa_store_status", DEFAULT_STORE_STATUS),
            storage.get("pa_reviews", []),
            storage.get("pa_notifications", []),
            storage.get("pa_activity_logs", []),
          ]);

        if (cancelled) {
          return;
        }

        setProducts(nextProducts);
        Object.assign(RESELLER_TIERS, savedTiers);
        setResellerTiers(savedTiers);
        setPromos(nextPromos);
        setCoupons(nextCoupons);
        setStoreStatus(nextStoreStatus);
        setReviews(nextReviews);
        setNotifications(nextNotifications);
        setActivityLogs(nextActivityLogs);
        if ("Notification" in window) {
          setNotificationPermission(window.Notification.permission);
        }
      } catch (error) {
        console.warn("Backend hydration failed; using local storefront data.", error);
        if (!cancelled) {
          setAuthResolved(true);
        }
      }
    };

    let hydrationStarted = false;
    const startHydration = () => {
      if (hydrationStarted || cancelled) {
        return;
      }

      hydrationStarted = true;
      window.clearTimeout(backendDelay);
      window.removeEventListener("pointerdown", startHydration);
      window.removeEventListener("keydown", startHydration);
      window.removeEventListener("wheel", startHydration);
      void hydrateBackend();
    };
    const backendDelay = window.setTimeout(startHydration, 12000);
    window.addEventListener("pointerdown", startHydration, { once: true, passive: true });
    window.addEventListener("keydown", startHydration, { once: true });
    window.addEventListener("wheel", startHydration, { once: true, passive: true });

    if (initialViewRef.current.startsWith("admin") || initialViewRef.current.startsWith("reseller")) {
      window.setTimeout(startHydration, 0);
    }

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(loadingFrame);
      window.clearTimeout(backendDelay);
      window.removeEventListener("pointerdown", startHydration);
      window.removeEventListener("keydown", startHydration);
      window.removeEventListener("wheel", startHydration);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!loaded || !authResolved) {
      return;
    }

    if (view === "admin" && !adminLoggedIn) {
      setView("admin-login");
    }

    if (view === "reseller-dashboard" && !reseller) {
      setView("reseller-login");
    }
  }, [adminLoggedIn, authResolved, loaded, reseller, view]);

  useEffect(() => {
    if (storeStatus?.isOpen === false) {
      setStoreClosedNoticeVisible(true);
    }
  }, [storeStatus?.closedReason, storeStatus?.isOpen]);

  useEffect(() => {
    if (!products.length || (!initialUiState.activeProductId && !initialUiState.activeProductSlug)) {
      return;
    }

    const restoredProduct = initialUiState.activeProductSlug
      ? products.find((product) => slugifyProduct(product.name) === initialUiState.activeProductSlug)
      : products.find((product) => product.id === initialUiState.activeProductId);
    if (restoredProduct) {
      setActiveProduct(restoredProduct);
      return;
    }

    if (initialUiState.activeProductSlug) {
      setView("home");
    }
  }, [initialUiState.activeProductId, initialUiState.activeProductSlug, products]);

  useEffect(() => {
    if (!initialUiState.activeOrderId) {
      return;
    }

    let cancelled = false;

    (async () => {
      const restoredOrder =
        orders.find((order) => order.id === initialUiState.activeOrderId) ||
        (await getItem("pa_orders", initialUiState.activeOrderId, null));

      if (!cancelled && restoredOrder) {
        setActiveOrder(restoredOrder);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [initialUiState.activeOrderId, orders]);

  useEffect(() => {
    if (!loaded || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      UI_STATE_KEY,
      JSON.stringify({
        view,
        activeProductId: activeProduct?.id || null,
        activeOrderId: activeOrder?.id || null,
        search,
        category,
        cart,
      })
    );
  }, [activeOrder?.id, activeProduct?.id, cart, category, loaded, search, view]);

  useEffect(() => {
    if (!loaded || typeof window === "undefined") {
      return;
    }

    if (view === "detail" && !activeProduct) {
      return;
    }

    const nextState = {
      palugada: true,
      view,
      activeProductId: activeProduct?.id || null,
      activeOrderId: activeOrder?.id || null,
    };
    const nextKey = JSON.stringify(nextState);
    const currentSearch = view === "home" ? new URLSearchParams(window.location.search).get("q") || "" : "";
    const nextPath = getViewPath(view, activeProduct, currentSearch);

    if (restoringHistoryRef.current) {
      window.history.replaceState(nextState, "", nextPath);
      historyKeyRef.current = nextKey;
      restoringHistoryRef.current = false;
      historyReadyRef.current = true;
      return;
    }

    if (!historyReadyRef.current) {
      window.history.replaceState(nextState, "", nextPath);
      historyKeyRef.current = nextKey;
      historyReadyRef.current = true;
      return;
    }

    if (historyKeyRef.current !== nextKey) {
      window.history.pushState(nextState, "", nextPath);
      historyKeyRef.current = nextKey;
    }
  }, [activeOrder?.id, activeProduct, loaded, view]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const restoreHistoryState = async (state) => {
      const nextView = state?.view || "home";
      restoringHistoryRef.current = true;
      setView(nextView);

      if (state?.activeProductId || state?.activeProductSlug) {
        const restoredProduct =
          products.find((product) => product.id === state.activeProductId) ||
          products.find((product) => slugifyProduct(product.name) === state.activeProductSlug) ||
          (await getItem("pa_products", state.activeProductId, null));
        setActiveProduct(restoredProduct || null);
      } else {
        setActiveProduct(null);
      }

      if (state?.activeOrderId) {
        const restoredOrder =
          orders.find((order) => order.id === state.activeOrderId) ||
          (await getItem("pa_orders", state.activeOrderId, null));
        setActiveOrder(restoredOrder || null);
      } else {
        setActiveOrder(null);
      }
    };

    const onPopState = (event) => {
      const state = event.state?.palugada
        ? event.state
        : { palugada: true, ...getRouteState(window.location.pathname) };

      void restoreHistoryState(state);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [orders, products]);

  useEffect(() => {
    if (view !== "detail" || !activeProduct) {
      return;
    }

    requestAnimationFrame(scrollToPageTop);
  }, [activeProduct, view]);

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

  const pushAdminNotification = (payload) => {
    const notification = {
      id: payload.id || "NTF-" + Date.now().toString(36).toUpperCase(),
      type: payload.type || "info",
      title: payload.title,
      body: payload.body || "",
      target: payload.target || "dashboard",
      read: false,
      createdAt: new Date().toISOString(),
    };

    setNotifications((current) => {
      const nextNotifications = [notification, ...current.filter((item) => item.id !== notification.id)].slice(0, 80);
      return nextNotifications;
    });
    void addItem("pa_notifications", notification);

    if (typeof window !== "undefined" && "Notification" in window && window.Notification.permission === "granted") {
      new window.Notification(notification.title, { body: notification.body || "Palugada admin" });
    }

    return notification;
  };

  const requestNotificationPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setNotificationPermission("unsupported");
      return "unsupported";
    }

    const permission = await window.Notification.requestPermission();
    setNotificationPermission(permission);
    if (permission === "granted") {
      pushAdminNotification({
        type: "system",
        title: "Notifikasi browser aktif",
        body: "Order, request, dan pembayaran baru akan muncul di browser ini.",
        target: "dashboard",
      });
      showToast("Notifikasi browser aktif");
    }
    return permission;
  };

  const getPrice = (product, basePrice = product.price) => {
    if (!reseller) {
      return basePrice;
    }
    const tier = resellerTiers[reseller.tier] || resellerTiers.Bronze || RESELLER_TIERS.Bronze;
    return Math.round(basePrice * (1 - tier.discount));
  };

  const cartItems = cart
    .map((cartItem) => {
      const product = products.find((item) => item.id === cartItem.id);
      if (!product) {
        return null;
      }
      const selectedPlan = getPlanSelection(product, cartItem.planId, cartItem.optionId);
      const pricing = getPricingForSelection(product, promos, selectedPlan || { planId: cartItem.planId, optionId: cartItem.optionId });
      return {
        ...product,
        cartKey: cartItem.key || cartItem.id,
        qty: cartItem.qty,
        price: pricing.displayPrice,
        compareAtPrice: pricing.compareAt,
        effectivePrice: getPrice(product, pricing.displayPrice),
        selectedPlanName: selectedPlan?.plan.name || "",
        selectedDuration: selectedPlan?.option.duration || product.duration,
        selectedPlanId: selectedPlan?.plan.id || null,
        selectedOptionId: selectedPlan?.option.id || null,
      };
    })
    .filter(Boolean);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.effectivePrice * item.qty, 0);
  const cartOriginal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const couponDiscount = getCouponDiscount(appliedCoupon, cartTotal);
  const cartPayableTotal = Math.max(0, cartTotal - couponDiscount);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const isStoreOpen = storeStatus?.isOpen !== false;
  const closedReason = storeStatus?.closedReason?.trim() || "Toko sedang tutup sementara. Silakan cek lagi nanti.";

  useEffect(() => {
    if (appliedCoupon && (!appliedCoupon.active || Number(appliedCoupon.minTotal || 0) > cartTotal || cartTotal <= 0)) {
      setAppliedCoupon(null);
    }
  }, [appliedCoupon, cartTotal]);

  const addToCart = (id, qty = 1, selection = null) => {
    if (!isStoreOpen) {
      showToast("Toko sedang tutup: " + closedReason);
      return false;
    }

    const product = products.find((item) => item.id === id);
    const selectedPlan = getPlanSelection(product, selection?.planId, selection?.optionId);
    const optionStock = selectedPlan?.option?.stock;
    if (optionStock !== undefined && optionStock !== null && Number(optionStock) < qty) {
      showToast("Stok pilihan ini habis");
      return false;
    }

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
    return true;
  };

  const updateQty = (key, delta) => {
    setCart((current) =>
      current.map((item) => ((item.key || item.id) === key ? { ...item, qty: Math.max(1, item.qty + delta) } : item))
    );
  };

  const removeFromCart = (key) => {
    setCart((current) => current.filter((item) => (item.key || item.id) !== key));
  };

  const applyCoupon = (code) => {
    const normalizedCode = normalizeCouponCode(code);
    const coupon = coupons.find((item) => item.active && normalizeCouponCode(item.code) === normalizedCode);

    if (!normalizedCode || !coupon) {
      setAppliedCoupon(null);
      showToast("Kode kupon tidak ditemukan atau nonaktif");
      return { ok: false };
    }

    if (Number(coupon.minTotal || 0) > cartTotal) {
      setAppliedCoupon(null);
      showToast(`Minimal belanja ${fmtIDR(coupon.minTotal)} untuk kupon ini`);
      return { ok: false };
    }

    const discount = getCouponDiscount(coupon, cartTotal);
    if (discount <= 0) {
      setAppliedCoupon(null);
      showToast("Kupon belum punya nilai diskon");
      return { ok: false };
    }

    setAppliedCoupon(coupon);
    showToast(`Kupon ${coupon.code} berhasil dipakai`);
    return { ok: true, coupon, discount };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast("Kupon dihapus");
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
    pushAdminNotification({
      type: "request",
      title: "Request produk baru",
      body: `${request.name} mencari ${request.appName}.`,
      target: "requests",
    });
    showToast("Request produk berhasil dikirim");
  };

  const placeOrder = async (buyer) => {
    if (!isStoreOpen) {
      showToast("Toko sedang tutup: " + closedReason);
      return null;
    }

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
      total: cartPayableTotal,
      originalTotal: cartOriginal,
      subtotal: cartTotal,
      discount: couponDiscount,
      coupon: appliedCoupon
        ? {
            id: appliedCoupon.id,
            code: appliedCoupon.code,
            title: appliedCoupon.title,
            type: appliedCoupon.type,
            value: appliedCoupon.value,
          }
        : null,
      profit: cartOriginal - cartPayableTotal,
      status: "Menunggu Pembayaran",
      resellerId: reseller?.id || null,
      createdAt: new Date().toISOString(),
    };

    const nextOrders = [order, ...orders];
    setOrders(nextOrders);
    await addItem("pa_orders", order);
    pushAdminNotification({
      type: "order",
      title: "Order baru masuk",
      body: `${order.buyer.name} membuat order ${order.id} senilai ${fmtIDR(order.total)}.`,
      target: "orders",
    });
    if (reseller) {
      setResellerOrders((current) => [order, ...current]);
    }

    if (reseller) {
      const nextTotalOrders = (reseller.totalOrders || 0) + 1;
      const nextTotalSpent = (reseller.totalSpent || 0) + cartPayableTotal;
      let nextTier = "Bronze";
      if (nextTotalSpent >= (resellerTiers.Gold?.min ?? RESELLER_TIERS.Gold.min)) nextTier = "Gold";
      else if (nextTotalSpent >= (resellerTiers.Silver?.min ?? RESELLER_TIERS.Silver.min)) nextTier = "Silver";

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
      if (!soldQty) {
        return product;
      }

      const pricingPlans = (product.pricingPlans || []).map((plan) => ({
        ...plan,
        options: (plan.options || []).map((option) => {
          const optionSoldQty = cart
            .filter((item) => item.id === product.id && item.planId === plan.id && item.optionId === option.id)
            .reduce((sum, item) => sum + item.qty, 0);
          const hasOptionStock = option.stock !== undefined && option.stock !== null;
          return hasOptionStock && optionSoldQty
            ? { ...option, stock: Math.max(0, Number(option.stock || 0) - optionSoldQty) }
            : option;
        }),
      }));

      return {
        ...product,
        stock: Math.max(0, product.stock - soldQty),
        pricingPlans,
      };
    });
    setProducts(nextProducts);
    nextProducts
      .filter((product) => product.stock <= 5 && cart.some((item) => item.id === product.id))
      .forEach((product) => {
        pushAdminNotification({
          id: `NTF-STOCK-${product.id}-${product.stock}`,
          type: "stock",
          title: "Stok produk menipis",
          body: `${product.name} tersisa ${product.stock} stok.`,
          target: "products",
        });
      });
    setCart([]);
    setAppliedCoupon(null);

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
    pushAdminNotification({
      type: "payment",
      title: "Pembayaran perlu diverifikasi",
      body: `${activeOrder?.buyer?.name || "Pembeli"} sudah klik konfirmasi untuk ${orderId}.`,
      target: "orders",
    });
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
    const letters = "LOADING...".split("");
    return (
      <>
        <StyleBlock />
        <div className="min-h-screen flex items-center justify-center overflow-hidden grain" style={{ background: "var(--bg)" }}>
          <div className="loading-fade flex flex-col items-center gap-5">
            <div className="loading-mark">
              <span className="serif">PG</span>
            </div>
            <div className="mono text-sm tracking-widest loading-text" style={{ color: "var(--ink-dim)" }}>
            {letters.map((ch, i) => (
              <span key={`${ch}-${i}`} className="loading-letter" style={{ animationDelay: `${i * 0.09}s` }}>{ch}</span>
            ))}
          </div>
        </div>
      </div>
    </>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--ink)" }}>
      <StyleBlock />
      <SeoHead view={view} activeProduct={activeProduct} products={products} promos={promos} reviews={reviews} />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:px-5 focus:py-3 focus:text-sm focus:font-semibold"
        style={{ background: "var(--ink)", color: "var(--bg)" }}
      >
        Langsung ke konten utama
      </a>
      {!view.startsWith("admin") && (
        <Header
          promos={promos}
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

      <main id="main-content" tabIndex="-1">
        {view === "home" && (
          <Home
            products={products}
            resellerTiers={resellerTiers}
            promos={promos}
            reviews={reviews}
            storeStatus={storeStatus}
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
            resellerTiers={resellerTiers}
            promos={promos}
            reviews={reviews.filter((review) => review.productId === activeProduct.id)}
            storeStatus={storeStatus}
            reseller={reseller}
            getPrice={getPrice}
            onBack={() => setView("home")}
            onAdd={(qty, selection) => addToCart(activeProduct.id, qty, selection)}
            onReview={(data) => addReview(activeProduct.id, data)}
            onBuy={(qty, selection) => {
              if (addToCart(activeProduct.id, qty, selection)) {
                setView("checkout");
              }
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
            storeStatus={storeStatus}
            onCheckout={() => {
              if (!isStoreOpen) {
                showToast("Toko sedang tutup: " + closedReason);
                return;
              }
              setView("checkout");
            }}
          />
        )}
        {view === "track-order" && (
          <TrackOrder onFindOrder={findOrder} onBack={() => setView("home")} />
        )}
        {view === "checkout" && (
          <Checkout
            items={cartItems}
            subtotal={cartTotal}
            total={cartPayableTotal}
            couponDiscount={couponDiscount}
            appliedCoupon={appliedCoupon}
            reseller={reseller}
            storeStatus={storeStatus}
            onBack={() => setView("cart")}
            onApplyCoupon={applyCoupon}
            onRemoveCoupon={removeCoupon}
            onPlace={async (buyer) => {
              const order = await placeOrder(buyer);
              if (!order) {
                return;
              }
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
            resellerTiers={resellerTiers}
            orders={resellerOrders}
            onBack={() => setView("home")}
            onLogout={async () => {
              await logoutCurrentUser();
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
              const credential = await (await loadFirebaseModule()).loginAdminAuth(email, password);
              if (credential.user.email !== adminEmail) {
                await logoutCurrentUser();
                return { error: "Email ini tidak terdaftar sebagai admin" };
              }

              setView("admin");
              return { ok: true };
            }}
          />
        )}
        {view === "admin" && adminLoggedIn && (
          <Suspense fallback={null}>
            <AdminPanel
            products={products}
            setProducts={async (nextProducts) => {
              setProducts(nextProducts);
              await storage.set("pa_products", nextProducts);
            }}
            resellerTiers={resellerTiers}
            setResellerTiers={async (nextTiers) => {
              setResellerTiers(nextTiers);
              await storage.set("pa_reseller_tiers", nextTiers);
            }}
            promos={promos}
            coupons={coupons}
            storeStatus={storeStatus}
            setStoreStatus={async (nextStoreStatus) => {
              setStoreStatus(nextStoreStatus);
              await storage.set("pa_store_status", nextStoreStatus);
            }}
            setPromos={async (nextPromos) => {
              setPromos(nextPromos);
              await storage.set("pa_promos", nextPromos);
            }}
            setCoupons={async (nextCoupons) => {
              setCoupons(nextCoupons);
              await storage.set("pa_coupons", nextCoupons);
            }}
            reviews={reviews}
            setReviews={async (nextReviews) => {
              setReviews(nextReviews);
              await storage.set("pa_reviews", nextReviews);
            }}
            notifications={notifications}
            setNotifications={async (nextNotifications) => {
              setNotifications(nextNotifications);
              await storage.set("pa_notifications", nextNotifications);
            }}
            activityLogs={activityLogs}
            setActivityLogs={async (nextActivityLogs) => {
              setActivityLogs(nextActivityLogs);
              await storage.set("pa_activity_logs", nextActivityLogs);
            }}
            notificationPermission={notificationPermission}
            onRequestNotifications={requestNotificationPermission}
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
            onChangeAdminPassword={async ({ currentPassword, nextPassword }) => {
              await changeCurrentUserPassword(currentPassword, nextPassword);
              showToast("Password admin berhasil diganti");
              return { ok: true };
            }}
            productRequests={productRequests}
            setProductRequests={async (nextRequests) => {
              setProductRequests(nextRequests);
              await storage.set("pa_product_requests", nextRequests);
            }}
            onLogout={async () => {
              await logoutCurrentUser();
              setAdminLoggedIn(false);
              setView("home");
            }}
            />
          </Suspense>
        )}
      </main>

      {!view.startsWith("admin") && view !== "reseller-login" && view !== "reseller-register" && <Footer />}
      {!view.startsWith("admin") && view !== "reseller-login" && view !== "reseller-register" && <FloatingWhatsApp />}
      {!view.startsWith("admin") && !isStoreOpen && storeClosedNoticeVisible && (
        <StoreClosedPopup reason={closedReason} onClose={() => setStoreClosedNoticeVisible(false)} />
      )}
      {toast && <div role="status" aria-live="polite" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full text-sm font-medium shadow-2xl toast-pop" style={{ background: "var(--ink)", color: "var(--bg)" }}>{toast}</div>}
    </div>
  );
}

function normalizeCouponCode(code = "") {
  return String(code).trim().toUpperCase().replace(/\s+/g, "");
}

function getCouponDiscount(coupon, subtotal) {
  if (!coupon?.active || subtotal <= 0 || Number(coupon.minTotal || 0) > subtotal) {
    return 0;
  }

  const value = Math.max(0, Number(coupon.value) || 0);
  const rawDiscount = coupon.type === "percent" ? Math.round(subtotal * Math.min(value, 100) / 100) : value;
  const maxDiscount = Math.max(0, Number(coupon.maxDiscount) || 0);
  const cappedDiscount = maxDiscount > 0 ? Math.min(rawDiscount, maxDiscount) : rawDiscount;
  return Math.min(subtotal, cappedDiscount);
}

function StoreClosedPopup({ reason, onClose }) {
  useEffect(() => {
    const delay = Math.min(14000, Math.max(4500, 2500 + String(reason || "").length * 75));
    const timer = setTimeout(onClose, delay);
    return () => clearTimeout(timer);
  }, [onClose, reason]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center safe-x safe-y px-4 backdrop-blur-md" style={{ background: "rgba(20,21,31,0.45)" }} role="dialog" aria-modal="true" aria-labelledby="store-closed-title" aria-describedby="store-closed-description">
      <div className="relative w-full max-w-lg rounded-[2rem] border p-6 sm:p-7 shadow-2xl zoomin" style={{ borderColor: "var(--accent)", background: "var(--bg-2)" }}>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full border transition hover:bg-white"
          style={{ borderColor: "var(--line)", color: "var(--ink)" }}
          aria-label="Tutup notifikasi"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="pr-10">
          <div className="text-[10px] mono uppercase tracking-widest mb-3" style={{ color: "var(--accent)" }}>Toko Sedang Tutup</div>
          <h2 id="store-closed-title" className="serif text-4xl leading-none mb-4" style={{ fontWeight: 600 }}>Order belum bisa dibuat.</h2>
          <p id="store-closed-description" className="serif text-2xl leading-tight" style={{ color: "var(--ink)" }}>{reason}</p>
        </div>
      </div>
    </div>
  );
}
