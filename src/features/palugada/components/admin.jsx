import { useEffect, useRef, useState } from "react";
import { BadgePercent, Check, ChevronDown, Crown, Edit3, Inbox, LogOut, MessageSquareQuote, Package, Plus, Receipt, Sparkles, Star, Trash2, TrendingUp, Users, X } from "lucide-react";
import { ICONS, RESELLER_TIERS, fmtIDR } from "../constants";
import { Field, ProductIcon } from "./shared";

const ADMIN_TAB_KEY = "pa_admin_tab";

export function AdminPanel({
  products,
  setProducts,
  resellerTiers = RESELLER_TIERS,
  setResellerTiers,
  promos = [],
  setPromos,
  reviews,
  setReviews,
  orders,
  setOrders,
  resellers,
  setResellers,
  onCreateReseller,
  productRequests = [],
  setProductRequests,
  onLogout,
}) {
  const [tab, setTab] = useState(() => {
    if (typeof window === "undefined") {
      return "dashboard";
    }

    return window.localStorage.getItem(ADMIN_TAB_KEY) || "dashboard";
  });
  const [editing, setEditing] = useState(null);
  const [editingPromo, setEditingPromo] = useState(null);
  const [showResellerCreator, setShowResellerCreator] = useState(false);
  const [confirmState, setConfirmState] = useState(null);
  const stats = {
    products: products.length,
    promos: promos.filter((promo) => promo.active).length,
    stock: products.reduce((sum, product) => sum + product.stock, 0),
    orders: orders.length,
    requests: productRequests.length,
    revenue: orders.reduce((sum, order) => sum + order.total, 0),
  };

  const askDelete = (title, description, onConfirm) => {
    setConfirmState({ title, description, onConfirm });
  };

  const closeConfirm = () => setConfirmState(null);

  const confirmDelete = async () => {
    if (!confirmState?.onConfirm) {
      return;
    }

    await confirmState.onConfirm();
    setConfirmState(null);
  };

  const saveProduct = (data) => {
    const payload = {
      ...data,
      price: Math.max(0, Number(data.price) || 0),
      oldPrice: Math.max(0, Number(data.oldPrice) || 0),
      stock: Math.max(0, Number(data.stock) || 0),
    };
    if (data.id && products.find((product) => product.id === data.id)) {
      setProducts(products.map((product) => (product.id === data.id ? payload : product)));
    } else {
      setProducts([...products, { ...payload, id: "p_" + Date.now().toString(36) }]);
    }
    setEditing(null);
  };

  const deleteProduct = (id) =>
    askDelete("Hapus produk?", "Produk ini akan dihapus dari katalog admin.", () =>
      setProducts(products.filter((product) => product.id !== id))
    );

  const updateOrderStatus = (id, status) =>
    setOrders(orders.map((order) => (order.id === id ? { ...order, status } : order)));

  const deleteOrder = (id) =>
    askDelete("Hapus pesanan?", "Pesanan ini akan dihapus permanen dari daftar.", () =>
      setOrders(orders.filter((order) => order.id !== id))
    );

  const deleteReseller = (id) =>
    askDelete("Hapus reseller?", "Akun reseller ini akan dihapus dari daftar reseller.", () =>
      setResellers(resellers.filter((reseller) => reseller.id !== id))
    );

  const updateRequestStatus = (id, status) =>
    setProductRequests(productRequests.map((request) => (request.id === id ? { ...request, status } : request)));

  const savePromo = (data) => {
    const payload = {
      ...data,
      title: data.title.trim(),
      description: data.description.trim(),
      productId: data.productId || "",
      planId: data.planId || "",
      optionId: data.optionId || "",
      promoPrice: Math.max(0, Number(data.promoPrice) || 0),
      compareAtPrice: Math.max(0, Number(data.compareAtPrice) || 0),
    };

    if (payload.id && promos.find((promo) => promo.id === payload.id)) {
      setPromos(promos.map((promo) => (promo.id === payload.id ? payload : promo)));
    } else {
      setPromos([{ ...payload, id: "promo_" + Date.now().toString(36) }, ...promos]);
    }
    setEditingPromo(null);
  };

  const togglePromo = (id) =>
    setPromos(promos.map((promo) => (promo.id === id ? { ...promo, active: !promo.active } : promo)));

  const deletePromo = (id) =>
    askDelete("Hapus promo?", "Promo ini akan dihapus dari panel admin dan ticker depan.", () =>
      setPromos(promos.filter((promo) => promo.id !== id))
    );

  const deleteRequest = (id) =>
    askDelete("Hapus request?", "Request produk ini akan dihapus dari panel admin.", () =>
      setProductRequests(productRequests.filter((request) => request.id !== id))
    );

  const setPersistedTab = (nextTab) => {
    setTab(nextTab);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ADMIN_TAB_KEY, nextTab);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)" }}>
      <aside className="w-64 border-r p-6 hidden md:flex flex-col" style={{ borderColor: "var(--line)", background: "var(--bg-2)" }}>
        <div className="flex items-center gap-3 mb-12">
          <div className="w-11 h-11 rounded-full flex items-center justify-center border-2" style={{ background: "var(--bg)", borderColor: "var(--ink)" }}>
            <span className="serif text-xl leading-none" style={{ color: "var(--ink)", fontWeight: 800 }}>PG</span>
          </div>
          <div>
            <div className="serif text-xl uppercase" style={{ fontWeight: 800 }}>Palugada</div>
            <div className="text-[9px] mono uppercase tracking-widest" style={{ color: "var(--ink-dim)" }}>admin console</div>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          <NavBtn active={tab === "dashboard"} onClick={() => setPersistedTab("dashboard")} icon={Sparkles}>Dashboard</NavBtn>
          <NavBtn active={tab === "products"} onClick={() => setPersistedTab("products")} icon={Package}>Produk</NavBtn>
          <NavBtn active={tab === "promos"} onClick={() => setPersistedTab("promos")} icon={BadgePercent}>Promo</NavBtn>
          <NavBtn active={tab === "orders"} onClick={() => setPersistedTab("orders")} icon={Receipt}>Pesanan</NavBtn>
          <NavBtn active={tab === "reviews"} onClick={() => setPersistedTab("reviews")} icon={Star}>Review</NavBtn>
          <NavBtn active={tab === "requests"} onClick={() => setPersistedTab("requests")} icon={Inbox}>Request</NavBtn>
          <NavBtn active={tab === "resellers"} onClick={() => setPersistedTab("resellers")} icon={Users}>Reseller</NavBtn>
        </nav>

        <button onClick={onLogout} className="flex items-center gap-2 text-sm hover:text-red-500 transition mt-6" style={{ color: "var(--ink-dim)" }}>
          <LogOut className="w-4 h-4" /> Keluar
        </button>
      </aside>

      <div className="flex-1 safe-x py-6 md:p-12 overflow-x-hidden">
        <div className="flex gap-2 md:hidden mb-6 overflow-x-auto ios-scroll pb-1">
          {["dashboard", "products", "promos", "orders", "reviews", "requests", "resellers"].map((item) => (
            <button key={item} onClick={() => setPersistedTab(item)} className="px-4 py-2 rounded-full text-xs capitalize whitespace-nowrap" style={{ background: tab === item ? "var(--ink)" : "var(--bg-2)", color: tab === item ? "var(--bg)" : "var(--ink)", border: "1px solid var(--line)" }}>
              {item === "promos" ? "promo" : item}
            </button>
          ))}
          <button onClick={onLogout} className="ml-auto px-4 py-2 rounded-full text-xs border" style={{ borderColor: "var(--line)" }}>Logout</button>
        </div>

        {tab === "dashboard" && <DashboardTab stats={stats} orders={orders} resellers={resellers} productRequests={productRequests} />}
        {tab === "products" && <ProductsTab products={products} onEdit={setEditing} onDelete={deleteProduct} />}
        {tab === "promos" && <PromosTab promos={promos} products={products} onEdit={setEditingPromo} onDelete={deletePromo} onToggle={togglePromo} />}
        {tab === "orders" && <OrdersTab orders={orders} onChangeStatus={updateOrderStatus} onDelete={deleteOrder} />}
        {tab === "reviews" && <ReviewsTab products={products} reviews={reviews} setReviews={setReviews} onDeleteReview={askDelete} />}
        {tab === "requests" && <RequestsTab productRequests={productRequests} onChangeStatus={updateRequestStatus} onDelete={deleteRequest} />}
        {tab === "resellers" && (
          <ResellersTab
            resellers={resellers}
            resellerTiers={resellerTiers}
            onSaveTiers={setResellerTiers}
            onDelete={deleteReseller}
            onCreate={() => setShowResellerCreator(true)}
          />
        )}
      </div>

      {editing && <ProductEditor product={editing === "new" ? null : editing} onSave={saveProduct} onClose={() => setEditing(null)} />}
      {editingPromo && <PromoEditor promo={editingPromo === "new" ? null : editingPromo} products={products} onSave={savePromo} onClose={() => setEditingPromo(null)} />}
      {showResellerCreator && (
        <ResellerCreator
          resellerTiers={resellerTiers}
          onClose={() => setShowResellerCreator(false)}
          onCreate={async (payload) => {
            const result = await onCreateReseller(payload);
            if (result?.ok) {
              setShowResellerCreator(false);
            }
            return result;
          }}
        />
      )}
      {confirmState && (
        <ConfirmDialog
          title={confirmState.title}
          description={confirmState.description}
          onClose={closeConfirm}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

function DashboardTab({ stats, orders, resellers, productRequests }) {
  return (
    <div>
      <div className="text-xs mono uppercase tracking-widest mb-3" style={{ color: "var(--accent)" }}>Overview</div>
      <h1 className="serif leading-none mb-2" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 500 }}>Dashboard<span className="serif-italic">.</span></h1>
      <p className="text-sm mb-10" style={{ color: "var(--ink-dim)" }}>Ringkasan performa toko</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Produk" value={stats.products} icon={Package} />
        <StatCard label="Promo Aktif" value={stats.promos} icon={BadgePercent} />
        <StatCard label="Stok" value={stats.stock} icon={Sparkles} />
        <StatCard label="Pesanan" value={stats.orders} icon={Receipt} />
        <StatCard label="Request" value={stats.requests} icon={Inbox} />
        <StatCard label="Pendapatan" value={fmtIDR(stats.revenue)} icon={TrendingUp} accent />
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="paper-card p-7">
          <div className="text-xs mono uppercase tracking-widest mb-5" style={{ color: "var(--accent)" }}>Pesanan Terbaru</div>
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex justify-between items-center py-3 border-b last:border-0" style={{ borderColor: "var(--line)" }}>
              <div>
                <div className="mono text-xs" style={{ color: "var(--accent)" }}>{order.id}</div>
                <div className="text-sm font-medium">{order.buyer.name}</div>
              </div>
              <div className="font-bold text-sm">{fmtIDR(order.total)}</div>
            </div>
          ))}
          {orders.length === 0 && <div className="text-sm text-center py-8 serif-italic" style={{ color: "var(--ink-dim)" }}>belum ada pesanan</div>}
        </div>
        <div className="paper-card p-7">
          <div className="text-xs mono uppercase tracking-widest mb-5" style={{ color: "var(--accent)" }}>Request Terbaru ({productRequests.length})</div>
          {productRequests.slice(0, 5).map((request) => (
            <div key={request.id} className="py-3 border-b last:border-0" style={{ borderColor: "var(--line)" }}>
              <div className="flex justify-between gap-3">
                <div className="font-medium text-sm">{request.appName}</div>
                <div className="text-[10px] mono uppercase" style={{ color: "var(--accent)" }}>{request.status}</div>
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--ink-dim)" }}>{request.name} · {request.wa}</div>
            </div>
          ))}
          {productRequests.length === 0 && <div className="text-sm text-center py-8 serif-italic" style={{ color: "var(--ink-dim)" }}>belum ada request</div>}
        </div>
        <div className="paper-card p-7">
          <div className="text-xs mono uppercase tracking-widest mb-5" style={{ color: "var(--accent)" }}>Reseller Aktif ({resellers.length})</div>
          {resellers.slice(0, 5).map((reseller) => (
            <div key={reseller.id} className="flex justify-between items-center py-3 border-b last:border-0" style={{ borderColor: "var(--line)" }}>
              <div className="flex items-center gap-3">
                <Crown className="w-4 h-4" style={{ color: RESELLER_TIERS[reseller.tier]?.color }} />
                <div>
                  <div className="text-sm font-medium">{reseller.name}</div>
                  <div className="text-[10px] mono uppercase" style={{ color: "var(--ink-dim)" }}>{reseller.tier}</div>
                </div>
              </div>
              <div className="text-xs mono" style={{ color: "var(--ink-dim)" }}>{reseller.totalOrders || 0} order</div>
            </div>
          ))}
          {resellers.length === 0 && <div className="text-sm text-center py-8 serif-italic" style={{ color: "var(--ink-dim)" }}>belum ada reseller</div>}
        </div>
      </div>
    </div>
  );
}

function ProductsTab({ products, onEdit, onDelete }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <div className="text-xs mono uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>Inventory</div>
          <h1 className="serif leading-none" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 500 }}>Produk<span className="serif-italic">.</span></h1>
          <p className="text-sm mt-2" style={{ color: "var(--ink-dim)" }}>{products.length} produk total</p>
        </div>
        <button onClick={() => onEdit("new")} className="px-5 py-3 rounded-full font-semibold text-sm flex items-center gap-2" style={{ background: "var(--accent)", color: "white" }}>
          <Plus className="w-4 h-4" /> Tambah Produk
        </button>
      </div>

      <div className="paper-card overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-4 text-[10px] mono uppercase tracking-widest border-b" style={{ color: "var(--ink-dim)", borderColor: "var(--line)" }}>
          <div className="col-span-5">Produk</div>
          <div className="col-span-2">Kategori</div>
          <div className="col-span-2">Harga</div>
          <div className="col-span-1">Stok</div>
          <div className="col-span-2 text-right">Aksi</div>
        </div>
        {products.map((product) => (
          <div key={product.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-5 py-4 items-center border-b last:border-0 hover:bg-stone-50" style={{ borderColor: "var(--line)" }}>
            <div className="md:col-span-5 flex items-center gap-3 min-w-0">
              <ProductIcon icon={product.icon} color={product.color} size={42} />
              <div className="min-w-0">
                <div className="serif text-lg" style={{ fontWeight: 500 }}>{product.name}</div>
                <div className="text-xs" style={{ color: "var(--ink-dim)" }}>{product.duration}</div>
              </div>
            </div>
            <div className="md:col-span-2 text-xs"><span className="md:hidden mono uppercase tracking-widest opacity-50 mr-2">Kategori</span>{product.category}</div>
            <div className="md:col-span-2 text-sm font-bold" style={{ color: "var(--accent)" }}><span className="md:hidden mono uppercase tracking-widest opacity-50 mr-2">Harga</span>{fmtIDR(product.price)}</div>
            <div className="md:col-span-1 mono text-xs"><span className="md:hidden uppercase tracking-widest opacity-50 mr-2">Stok</span>{product.stock}</div>
            <div className="md:col-span-2 flex justify-start md:justify-end gap-1">
              <button onClick={() => onEdit(product)} className="p-2 rounded-lg hover:bg-stone-100"><Edit3 className="w-4 h-4" /></button>
              <button onClick={() => onDelete(product.id)} className="p-2 rounded-lg hover:bg-stone-100" style={{ color: "var(--accent)" }}><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PromosTab({ promos, products, onEdit, onDelete, onToggle }) {
  const activeCount = promos.filter((promo) => promo.active).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <div className="text-xs mono uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>Promo</div>
          <h1 className="serif leading-none" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 500 }}>Promo<span className="serif-italic">.</span></h1>
          <p className="text-sm mt-2" style={{ color: "var(--ink-dim)" }}>{activeCount} promo aktif dari {promos.length} total promo</p>
        </div>
        <button onClick={() => onEdit("new")} className="px-5 py-3 rounded-full font-semibold text-sm flex items-center gap-2" style={{ background: "var(--accent)", color: "white" }}>
          <Plus className="w-4 h-4" /> Tambah Promo
        </button>
      </div>

      {promos.length === 0 ? (
        <div className="paper-card text-center py-20 serif text-2xl serif-italic" style={{ color: "var(--ink-dim)" }}>belum ada promo dibuat</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {promos.map((promo) => (
            <article key={promo.id} className="paper-card p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] mono uppercase tracking-widest px-2 py-1 rounded-full" style={{ background: promo.active ? "var(--ink)" : "var(--bg-3)", color: promo.active ? "var(--bg)" : "var(--ink-dim)" }}>
                      {promo.active ? "Aktif" : "Nonaktif"}
                    </span>
                    {promo.highlight && (
                      <span className="text-[10px] mono uppercase tracking-widest px-2 py-1 rounded-full" style={{ background: "var(--bg-3)", color: "var(--accent)" }}>
                        Highlight
                      </span>
                    )}
                  </div>
	                  <h3 className="serif text-2xl leading-none mb-2" style={{ fontWeight: 600 }}>{promo.title}</h3>
                    <div className="text-[10px] mono uppercase tracking-widest mb-2" style={{ color: "var(--ink-dim)" }}>
                      {getPromoTargetLabel(promo, products)}
                    </div>
                    {promo.promoPrice > 0 && (
                      <div className="text-sm font-semibold mb-2" style={{ color: "var(--accent)" }}>
                        {fmtIDR(promo.promoPrice)}
                        {promo.compareAtPrice > promo.promoPrice && (
                          <span className="text-xs line-through ml-2" style={{ color: "var(--ink-dim)" }}>{fmtIDR(promo.compareAtPrice)}</span>
                        )}
                      </div>
                    )}
	                  {promo.description && <p className="text-sm leading-relaxed" style={{ color: "var(--ink-dim)" }}>{promo.description}</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => onEdit(promo)} className="p-2 rounded-lg hover:bg-stone-100"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => onDelete(promo.id)} className="p-2 rounded-lg hover:bg-stone-100" style={{ color: "var(--accent)" }}><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs mono uppercase tracking-widest" style={{ color: "var(--ink-dim)" }}>
                <button
                  onClick={() => onToggle(promo.id)}
                  className="px-3 py-2 rounded-full border bg-white hover:bg-stone-50 transition"
                  style={{ borderColor: promo.active ? "var(--ink)" : "var(--line)" }}
                >
                  {promo.active ? "Nonaktifkan" : "Aktifkan"}
                </button>
                <span>ID: {promo.id}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function OrdersTab({ orders, onChangeStatus, onDelete }) {
  const statusOptions = ["Menunggu Pembayaran", "Menunggu Verifikasi", "Diproses", "Selesai", "Dibatalkan"];

  return (
    <div>
      <div className="text-xs mono uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>Sales</div>
      <h1 className="serif leading-none mb-2" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 500 }}>Pesanan<span className="serif-italic">.</span></h1>
      <p className="text-sm mb-10" style={{ color: "var(--ink-dim)" }}>{orders.length} pesanan total</p>
      <div className="space-y-4">
        {orders.map((order) => {
          const running = getOrderRunningInfo(order);
          return (
          <div key={order.id} className="paper-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="mono text-xs" style={{ color: "var(--accent)" }}>{order.id}</div>
                  {order.resellerId && <span className="text-[10px] mono uppercase px-2 py-0.5 rounded-full" style={{ background: "var(--gold)", color: "white" }}>RESELLER</span>}
                  {running && (
                    <span className="text-[10px] mono uppercase px-2 py-0.5 rounded-full" style={{ background: running.expired ? "#fee2e2" : "var(--bg-3)", color: running.expired ? "#991b1b" : "var(--accent)" }}>
                      {running.label}
                    </span>
                  )}
                </div>
                <div className="serif text-xl" style={{ fontWeight: 500 }}>{order.buyer.name}</div>
                <div className="text-xs" style={{ color: "var(--ink-dim)" }}>{order.buyer.email} · {order.buyer.wa}</div>
                <div className="text-[10px] mono mt-1" style={{ color: "var(--ink-dim)" }}>{new Date(order.createdAt).toLocaleString("id-ID")}</div>
              </div>
              <div className="text-right">
                <div className="serif text-3xl" style={{ color: "var(--accent)", fontWeight: 600 }}>{fmtIDR(order.total)}</div>
                <div className="mt-2 flex justify-end gap-2">
                  <StatusDropdown value={order.status} options={statusOptions} onChange={(value) => onChangeStatus(order.id, value)} />
                  <button onClick={() => onDelete(order.id)} className="px-3 py-1 rounded-full text-xs border bg-white hover:bg-red-50 transition" style={{ borderColor: "var(--line)", color: "#991b1b" }}>
                    Hapus
                  </button>
                </div>
              </div>
            </div>
            {running && (
              <div className="mb-4 rounded-2xl border px-4 py-3 text-xs flex flex-wrap gap-3 justify-between" style={{ borderColor: "var(--line)", background: "var(--bg-3)", color: "var(--ink-dim)" }}>
                <span>Invoice: {new Date(order.createdAt).toLocaleDateString("id-ID")}</span>
                <span>Durasi: {running.durationDays} hari</span>
                <span>Berakhir: {running.endDate.toLocaleDateString("id-ID")}</span>
              </div>
            )}
            <div className="border-t pt-3 space-y-1" style={{ borderColor: "var(--line)" }}>
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.qty}× {item.name}{item.plan ? ` - ${item.plan} (${item.duration})` : ""}</span>
                  <span className="mono" style={{ color: "var(--ink-dim)" }}>{fmtIDR(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
          </div>
          );
        })}
        {orders.length === 0 && <div className="paper-card text-center py-20 serif text-2xl serif-italic" style={{ color: "var(--ink-dim)" }}>belum ada pesanan masuk</div>}
      </div>
    </div>
  );
}

function RequestsTab({ productRequests, onChangeStatus, onDelete }) {
  const statusOptions = ["Baru", "Dicek", "Tersedia", "Tidak Tersedia", "Selesai"];

  return (
    <div>
      <div className="text-xs mono uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>Product Requests</div>
      <h1 className="serif leading-none mb-2" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 500 }}>Request<span className="serif-italic">.</span></h1>
      <p className="text-sm mb-10" style={{ color: "var(--ink-dim)" }}>{productRequests.length} request produk/apps premium</p>

      {productRequests.length === 0 ? (
        <div className="paper-card text-center py-20 serif text-2xl serif-italic" style={{ color: "var(--ink-dim)" }}>belum ada request masuk</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {productRequests.map((request) => (
            <div key={request.id} className="paper-card p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="mono text-xs mb-1" style={{ color: "var(--accent)" }}>{request.id}</div>
                  <div className="serif text-2xl leading-none" style={{ fontWeight: 500 }}>{request.appName}</div>
                  <div className="text-xs mt-2" style={{ color: "var(--ink-dim)" }}>
                    {request.name} · {request.wa}
                  </div>
                  <div className="text-[10px] mono mt-1" style={{ color: "var(--ink-dim)" }}>
                    {new Date(request.createdAt).toLocaleString("id-ID")}
                  </div>
                </div>
                <button onClick={() => onDelete(request.id)} className="p-2 rounded-lg hover:bg-stone-100" style={{ color: "var(--accent)" }}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {request.note && (
                <div className="rounded-2xl border p-4 text-sm leading-relaxed mb-4" style={{ borderColor: "var(--line)", background: "var(--bg-3)", color: "var(--ink-dim)" }}>
                  {request.note}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <StatusDropdown value={request.status} options={statusOptions} onChange={(value) => onChangeStatus(request.id, value)} />
                <a
                  href={`https://wa.me/${normalizeWhatsapp(request.wa)}?text=${encodeURIComponent(`Halo ${request.name}, request ${request.appName} di Palugada mau kami follow up.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 rounded-full text-xs border bg-white hover:bg-stone-50"
                  style={{ borderColor: "var(--line)" }}
                >
                  Chat WA
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewsTab({ products, reviews, setReviews, onDeleteReview }) {
  const [activeProductId, setActiveProductId] = useState(products[0]?.id || "");
  const [replyDrafts, setReplyDrafts] = useState({});
  const activeProduct = products.find((product) => product.id === activeProductId) || products[0];
  const productReviews = reviews.filter((review) => review.productId === activeProduct?.id);

  const deleteReview = (reviewId) =>
    onDeleteReview("Hapus review?", "Review ini akan dihapus dan tidak bisa dikembalikan.", () =>
      setReviews(reviews.filter((review) => review.id !== reviewId))
    );

  const saveReply = (review) => {
    const replyMessage = (replyDrafts[review.id] || "").trim();
    if (!replyMessage) {
      return;
    }

    setReviews(
      reviews.map((item) =>
        item.id === review.id
          ? {
              ...item,
              adminReply: {
                message: replyMessage,
                createdAt: new Date().toISOString(),
              },
            }
          : item
      )
    );
    setReplyDrafts((current) => ({ ...current, [review.id]: "" }));
  };

  return (
    <div>
      <div className="text-xs mono uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>Customer Reviews</div>
      <h1 className="serif leading-none mb-2" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 500 }}>Review<span className="serif-italic">.</span></h1>
      <p className="text-sm mb-10" style={{ color: "var(--ink-dim)" }}>Pilih produk dulu, lalu kelola review dan balasan admin</p>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-3">
          {products.map((product) => {
            const count = reviews.filter((review) => review.productId === product.id).length;
            const active = product.id === activeProduct?.id;
            return (
              <button
                key={product.id}
                onClick={() => setActiveProductId(product.id)}
                className="w-full paper-card p-4 text-left transition"
                style={{
                  borderColor: active ? "var(--ink)" : "var(--line)",
                  background: active ? "var(--bg-3)" : "var(--bg-2)",
                }}
              >
                <div className="flex items-center gap-3">
                  <ProductIcon icon={product.icon} color={product.color} size={42} />
                  <div className="min-w-0">
                    <div className="serif text-xl leading-none" style={{ fontWeight: 600 }}>{product.name}</div>
                    <div className="text-[10px] mono uppercase tracking-widest mt-1" style={{ color: "var(--ink-dim)" }}>
                      {count} review
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-8">
          {!activeProduct ? (
            <div className="paper-card text-center py-20 serif text-2xl serif-italic" style={{ color: "var(--ink-dim)" }}>
              belum ada produk
            </div>
          ) : productReviews.length === 0 ? (
            <div className="paper-card p-8">
              <div className="text-xs mono uppercase tracking-widest mb-3" style={{ color: "var(--accent)" }}>{activeProduct.name}</div>
              <div className="serif text-3xl serif-italic" style={{ color: "var(--ink-dim)" }}>belum ada review untuk produk ini</div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="paper-card p-6">
                <div className="text-xs mono uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>{activeProduct.category}</div>
                <div className="serif text-3xl" style={{ fontWeight: 600 }}>{activeProduct.name}</div>
                <div className="text-sm mt-1" style={{ color: "var(--ink-dim)" }}>{productReviews.length} review masuk</div>
              </div>
              {productReviews.map((review) => (
                <article key={review.id} className="paper-card p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="serif text-2xl leading-none" style={{ fontWeight: 500 }}>{review.name}</div>
                      <div className="text-[10px] mono uppercase tracking-widest mt-2" style={{ color: "var(--ink-dim)" }}>
                        {new Date(review.createdAt).toLocaleString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end mb-2" style={{ color: "var(--accent)" }}>
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star key={index} className={`w-4 h-4 ${index < Number(review.rating) ? "fill-current" : ""}`} />
                        ))}
                      </div>
                      <button onClick={() => deleteReview(review.id)} className="text-xs mono uppercase tracking-widest" style={{ color: "var(--accent)" }}>
                        Hapus
                      </button>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--ink-dim)" }}>{review.message}</p>

                  {review.adminReply && (
                    <div className="rounded-2xl border p-4 mb-4" style={{ borderColor: "var(--line)", background: "var(--bg-3)" }}>
                      <div className="flex items-center gap-2 text-[10px] mono uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>
                        <MessageSquareQuote className="w-4 h-4" /> Balasan Admin
                      </div>
                      <p className="text-sm leading-relaxed mb-2" style={{ color: "var(--ink-dim)" }}>{review.adminReply.message}</p>
                      <div className="text-[10px] mono uppercase tracking-widest" style={{ color: "var(--ink-dim)" }}>
                        {new Date(review.adminReply.createdAt).toLocaleString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <label className="text-[10px] mono uppercase tracking-widest block" style={{ color: "var(--accent)" }}>
                      {review.adminReply ? "Ubah Balasan Admin" : "Balas Review"}
                    </label>
                    <textarea
                      value={replyDrafts[review.id] ?? review.adminReply?.message ?? ""}
                      onChange={(event) => setReplyDrafts((current) => ({ ...current, [review.id]: event.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 rounded-2xl border bg-white text-sm focus:outline-none resize-y"
                      style={{ borderColor: "var(--line)" }}
                      placeholder="Tulis balasan admin..."
                    />
                    <button
                      onClick={() => saveReply(review)}
                      className="px-4 py-2 rounded-full text-xs font-semibold"
                      style={{ background: "var(--ink)", color: "var(--bg)" }}
                    >
                      Simpan Balasan
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusDropdown({ value, options, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((current) => !current)}
        className="min-w-[220px] px-4 py-2.5 rounded-full text-sm border flex items-center justify-between gap-3 transition"
        style={{ borderColor: "var(--line)", background: "var(--bg-2)", color: "var(--ink)" }}
      >
        <span>{value}</span>
        <ChevronDown className={`w-4 h-4 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          className="absolute right-0 mt-2 min-w-full overflow-hidden rounded-[1.25rem] border shadow-2xl z-20"
          style={{ borderColor: "var(--line)", background: "var(--bg-2)" }}
        >
          {options.map((option) => {
            const active = option === value;
            return (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-sm flex items-center justify-between gap-3 border-b last:border-b-0 transition"
                style={{
                  borderColor: "var(--line)",
                  background: active ? "var(--ink)" : "transparent",
                  color: active ? "var(--bg)" : "var(--ink)",
                  fontWeight: active ? 600 : 500,
                }}
              >
                <span>{option}</span>
                {active && <Check className="w-4 h-4" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AdminSelect({ label, value, onChange, options, disabled = false, placeholder = "Pilih opsi" }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, []);

  return (
    <div ref={rootRef}>
      {label && (
        <label className="text-[10px] mono uppercase tracking-widest block mb-1.5" style={{ color: "var(--ink-dim)" }}>
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setOpen((current) => !current)}
          disabled={disabled}
          className="w-full px-4 py-3 rounded-xl border bg-white text-left flex items-center justify-between gap-3 transition disabled:opacity-50"
          style={{ borderColor: "var(--line)" }}
        >
          <span className="truncate" style={{ color: selected ? "var(--ink)" : "var(--ink-dim)" }}>
            {selected?.label || placeholder}
          </span>
          <ChevronDown className={`w-4 h-4 shrink-0 transition ${open ? "rotate-180" : ""}`} />
        </button>
        {open && !disabled && (
          <div
            className="relative mt-2 overflow-hidden rounded-[1.25rem] border shadow-2xl z-30 sm:absolute sm:left-0 sm:right-0"
            style={{ borderColor: "var(--line)", background: "var(--bg-2)" }}
          >
            {options.map((option) => {
              const active = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm flex items-center justify-between gap-3 border-b last:border-b-0 transition"
                  style={{
                    borderColor: "var(--line)",
                    background: active ? "var(--ink)" : "transparent",
                    color: active ? "var(--bg)" : "var(--ink)",
                    fontWeight: active ? 600 : 500,
                  }}
                >
                  <span>{option.label}</span>
                  {active && <Check className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ConfirmDialog({ title, description, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center safe-x safe-y backdrop-blur-sm" style={{ background: "rgba(20,21,31,0.5)" }}>
      <div className="w-full max-w-md rounded-[2rem] border overflow-hidden" style={{ borderColor: "var(--line)", background: "var(--bg-2)" }}>
        <div className="flex items-start justify-between gap-4 p-6 border-b" style={{ borderColor: "var(--line)" }}>
          <div>
            <div className="text-[10px] mono uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>Konfirmasi Aksi</div>
            <h3 className="serif text-3xl leading-none" style={{ fontWeight: 500 }}>{title}</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-stone-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-sm leading-relaxed" style={{ color: "var(--ink-dim)" }}>{description}</p>
        </div>
        <div className="flex gap-3 p-6 border-t" style={{ borderColor: "var(--line)", background: "rgba(255,255,255,0.95)" }}>
          <button onClick={onClose} className="flex-1 py-3 rounded-full border font-semibold text-sm" style={{ borderColor: "var(--line-2)" }}>
            Batal
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-full font-semibold text-sm" style={{ background: "var(--accent)", color: "white" }}>
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

function normalizeWhatsapp(value = "") {
  const digits = String(value).replace(/\D/g, "");
  if (digits.startsWith("0")) {
    return `62${digits.slice(1)}`;
  }
  return digits;
}

function getOrderRunningInfo(order) {
  const durationDays = Math.max(...order.items.map((item) => parseDurationDays(item.duration)));
  if (!Number.isFinite(durationDays) || durationDays <= 0 || !order.createdAt) {
    return null;
  }

  const startDate = new Date(order.createdAt);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + durationDays);

  const today = new Date();
  const remainingDays = Math.ceil((endDate.getTime() - today.getTime()) / 86400000);
  const expired = remainingDays <= 0;

  return {
    durationDays,
    endDate,
    expired,
    remainingDays: Math.max(0, remainingDays),
    label: expired ? "Berakhir" : `Sisa ${remainingDays} hari`,
  };
}

function parseDurationDays(duration = "") {
  const monthMatch = String(duration).match(/(\d+)\s*Bulan/i);
  if (monthMatch) {
    return Number(monthMatch[1]) * 30;
  }

  const dayMatch = String(duration).match(/(\d+)\s*Hari/i);
  if (dayMatch) {
    return Number(dayMatch[1]);
  }

  return 0;
}

function getPromoTargetLabel(promo, products) {
  const product = products.find((item) => item.id === promo.productId);
  if (!product) {
    return "Target belum dipilih";
  }

  const plan = product.pricingPlans?.find((item) => item.id === promo.planId);
  const option = plan?.options?.find((item) => item.id === promo.optionId);

  if (plan && option) {
    return `${product.name} - ${plan.name} - ${option.duration}`;
  }

  if (plan) {
    return `${product.name} - ${plan.name}`;
  }

  return product.name;
}

function ResellersTab({ resellers, resellerTiers = RESELLER_TIERS, onSaveTiers, onDelete, onCreate }) {
  const [tierDrafts, setTierDrafts] = useState(() =>
    Object.fromEntries(
      Object.entries(resellerTiers).map(([name, config]) => [
        name,
        {
          discount: Math.round((config.discount || 0) * 100),
          min: config.min || 0,
          color: config.color || RESELLER_TIERS[name]?.color || "#8b5e34",
        },
      ])
    )
  );

  const saveTierSettings = () => {
    const nextTiers = Object.fromEntries(
      Object.entries(tierDrafts).map(([name, config]) => [
        name,
        {
          ...resellerTiers[name],
          min: Number(config.min) || 0,
          discount: Math.max(0, Number(config.discount) || 0) / 100,
          color: config.color || resellerTiers[name]?.color || RESELLER_TIERS[name]?.color,
        },
      ])
    );
    Object.assign(RESELLER_TIERS, nextTiers);
    onSaveTiers?.(nextTiers);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div>
          <div className="text-xs mono uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>Partners</div>
          <h1 className="serif leading-none mb-2" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 500 }}>Reseller<span className="serif-italic">.</span></h1>
          <p className="text-sm" style={{ color: "var(--ink-dim)" }}>{resellers.length} reseller terdaftar</p>
        </div>
        <button onClick={onCreate} className="px-5 py-3 rounded-full font-semibold text-sm flex items-center gap-2" style={{ background: "var(--accent)", color: "white" }}>
          <Plus className="w-4 h-4" /> Aktifkan Reseller
        </button>
      </div>

      <div className="paper-card p-6 mb-6">
        <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
          <div>
            <div className="text-xs mono uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>Diskon Tier</div>
            <div className="serif text-3xl leading-none" style={{ fontWeight: 500 }}>Atur diskon reseller</div>
            <div className="text-sm mt-2" style={{ color: "var(--ink-dim)" }}>Ubah persen diskon dan minimum total belanja untuk naik tier.</div>
          </div>
          <button onClick={saveTierSettings} className="px-5 py-3 rounded-full font-semibold text-sm" style={{ background: "var(--ink)", color: "var(--bg)" }}>
            Simpan Diskon
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(tierDrafts).map(([name, config]) => (
            <div key={name} className="rounded-[1.75rem] border p-5" style={{ borderColor: "var(--line)", background: "var(--bg-2)" }}>
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-4 h-4" style={{ color: config.color }} />
                <div className="text-sm font-semibold">{name}</div>
              </div>
              <div className="space-y-3">
                <Field
                  label="Diskon (%)"
                  value={config.discount}
                  onChange={(value) =>
                    setTierDrafts((current) => ({
                      ...current,
                      [name]: { ...current[name], discount: Math.max(0, Number(value) || 0) },
                    }))
                  }
                  type="number"
                />
                <Field
                  label="Naik Tier Min"
                  value={config.min}
                  onChange={(value) =>
                    setTierDrafts((current) => ({
                      ...current,
                      [name]: { ...current[name], min: Math.max(0, Number(value) || 0) },
                    }))
                  }
                  type="number"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {resellers.length === 0 ? (
        <div className="paper-card text-center py-20 serif text-2xl serif-italic" style={{ color: "var(--ink-dim)" }}>belum ada reseller terdaftar</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resellers.map((reseller) => (
            <div key={reseller.id} className="paper-card p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Crown className="w-4 h-4" style={{ color: resellerTiers[reseller.tier]?.color || RESELLER_TIERS[reseller.tier]?.color }} />
                    <span className="text-[10px] mono uppercase tracking-widest" style={{ color: resellerTiers[reseller.tier]?.color || RESELLER_TIERS[reseller.tier]?.color }}>{reseller.tier}</span>
                  </div>
                  <div className="serif text-2xl" style={{ fontWeight: 500 }}>{reseller.name}</div>
                  <div className="text-xs" style={{ color: "var(--ink-dim)" }}>{reseller.email}</div>
                </div>
                <button onClick={() => onDelete(reseller.id)} className="p-2 rounded-lg hover:bg-stone-100" style={{ color: "var(--accent)" }}><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-4 border-t" style={{ borderColor: "var(--line)" }}>
                <div>
                  <div className="text-[10px] mono uppercase" style={{ color: "var(--ink-dim)" }}>Pesanan</div>
                  <div className="font-bold">{reseller.totalOrders || 0}</div>
                </div>
                <div>
                  <div className="text-[10px] mono uppercase" style={{ color: "var(--ink-dim)" }}>Total</div>
                  <div className="font-bold text-sm" style={{ color: "var(--accent)" }}>{fmtIDR(reseller.totalSpent || 0)}</div>
                </div>
              </div>
              <div className="mt-3 text-[10px] mono" style={{ color: "var(--ink-dim)" }}>ID: {reseller.id} · WA: {reseller.wa}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ResellerCreator({ resellerTiers = RESELLER_TIERS, onClose, onCreate }) {
  const [data, setData] = useState({
    name: "",
    email: "",
    wa: "",
    password: "",
    tier: "Bronze",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key, value) => setData((current) => ({ ...current, [key]: value }));

  const submit = async () => {
    if (!data.name || !data.email || !data.wa || !data.password) {
      setError("Nama, email, WhatsApp, dan password wajib diisi");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await onCreate({
        name: data.name.trim(),
        email: data.email.trim(),
        wa: data.wa.trim(),
        password: data.password,
        tier: data.tier,
      });
      if (result?.error) {
        setError(result.error);
      }
    } catch (createError) {
      setError(createError.message || "Aktivasi reseller gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center safe-x safe-y backdrop-blur-sm" style={{ background: "rgba(20,21,31,0.5)" }}>
      <div className="w-full max-w-xl rounded-3xl border bg-white overflow-hidden" style={{ borderColor: "var(--line)" }}>
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "var(--line)" }}>
          <div>
            <div className="text-[10px] mono uppercase tracking-widest" style={{ color: "var(--accent)" }}>Reseller</div>
            <h2 className="serif text-3xl" style={{ fontWeight: 500 }}>Aktifkan Akun</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-stone-100"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          <div className="rounded-2xl border p-4 text-sm leading-relaxed" style={{ borderColor: "var(--line)", background: "var(--bg-3)", color: "var(--ink-dim)" }}>
            Pakai form ini setelah reseller membayar biaya pendaftaran. Sistem akan membuat akun login Firebase dan profil reseller sekaligus.
          </div>
          <Field label="Nama Lengkap" value={data.name} onChange={(value) => set("name", value)} placeholder="Nama reseller" />
          <Field label="Email Login" value={data.email} onChange={(value) => set("email", value)} type="email" placeholder="reseller@email.com" />
          <Field label="WhatsApp" value={data.wa} onChange={(value) => set("wa", value)} placeholder="08xxxxxxxxxx" />
          <Field label="Password Awal" value={data.password} onChange={(value) => set("password", value)} type="password" placeholder="Password reseller" />
          <AdminSelect
            label="Tier Awal"
            value={data.tier}
            onChange={(value) => set("tier", value)}
            options={Object.keys(resellerTiers).map((tier) => ({ value: tier, label: tier }))}
          />
          {error && <div className="text-xs" style={{ color: "var(--accent)" }}>{error}</div>}
        </div>

        <div className="flex gap-3 p-6 border-t" style={{ borderColor: "var(--line)", background: "rgba(255,255,255,0.95)" }}>
          <button onClick={onClose} className="flex-1 py-3 rounded-full border font-semibold text-sm" style={{ borderColor: "var(--line-2)" }}>Batal</button>
          <button
            onClick={submit}
            disabled={loading}
            className="flex-1 py-3 rounded-full font-semibold text-sm disabled:opacity-50"
            style={{ background: "var(--accent)", color: "white" }}
          >
            {loading ? "Mengaktifkan..." : "Aktifkan Reseller"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PromoEditor({ promo, products, onSave, onClose }) {
  const defaultProduct = products[0];
  const defaultPlan = defaultProduct?.pricingPlans?.[0];
  const defaultOption = defaultPlan?.options?.[0];
  const blank = {
    id: null,
    title: "",
    description: "",
    active: true,
    highlight: false,
    productId: defaultProduct?.id || "",
    planId: defaultPlan?.id || "",
    optionId: defaultOption?.id || "",
    promoPrice: defaultOption?.price || defaultProduct?.price || 0,
    compareAtPrice: defaultProduct?.oldPrice || defaultOption?.price || defaultProduct?.price || 0,
  };
  const [data, setData] = useState(promo || blank);

  const set = (key, value) => setData((current) => ({ ...current, [key]: value }));
  const selectedProduct = products.find((product) => product.id === data.productId) || defaultProduct;
  const selectedPlan = selectedProduct?.pricingPlans?.find((plan) => plan.id === data.planId) || selectedProduct?.pricingPlans?.[0] || null;

  const updateProduct = (productId) => {
    const nextProduct = products.find((product) => product.id === productId);
    const nextPlan = nextProduct?.pricingPlans?.[0] || null;
    const nextOption = nextPlan?.options?.[0] || null;
    setData((current) => ({
      ...current,
      productId,
      planId: nextPlan?.id || "",
      optionId: nextOption?.id || "",
      compareAtPrice: nextProduct?.oldPrice || nextOption?.price || nextProduct?.price || 0,
      promoPrice: nextOption?.price || nextProduct?.price || 0,
    }));
  };

  const updatePlan = (planId) => {
    const nextPlan = selectedProduct?.pricingPlans?.find((plan) => plan.id === planId) || null;
    const nextOption = nextPlan?.options?.[0] || null;
    setData((current) => ({
      ...current,
      planId,
      optionId: nextOption?.id || "",
      promoPrice: nextOption?.price || selectedProduct?.price || 0,
      compareAtPrice: selectedProduct?.oldPrice || nextOption?.price || selectedProduct?.price || 0,
    }));
  };

  const updateOption = (optionId) => {
    const nextOption = selectedPlan?.options?.find((option) => option.id === optionId) || null;
    setData((current) => ({
      ...current,
      optionId,
      promoPrice: nextOption?.price || selectedProduct?.price || 0,
      compareAtPrice: selectedProduct?.oldPrice || nextOption?.price || selectedProduct?.price || 0,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center safe-x safe-y overflow-y-auto backdrop-blur-sm" style={{ background: "rgba(20,21,31,0.5)" }}>
      <div className="flex w-full max-w-xl my-4 sm:my-0 max-h-[calc(100dvh-2rem)] flex-col overflow-hidden rounded-[2rem] sm:rounded-3xl border bg-white" style={{ borderColor: "var(--line)" }}>
        <div className="relative flex items-center justify-between p-6 border-b backdrop-blur-xl" style={{ borderColor: "var(--line)", background: "rgba(255,255,255,0.95)" }}>
          <div>
            <div className="text-[10px] mono uppercase tracking-widest" style={{ color: "var(--accent)" }}>Promo</div>
            <h2 className="serif text-3xl" style={{ fontWeight: 500 }}>{promo ? "Edit" : "Tambah"} Promo</h2>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-stone-100"><X className="w-5 h-5" /></button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-6 space-y-4 scrollbar ios-scroll">
          <div className="rounded-2xl border p-4 text-sm leading-relaxed" style={{ borderColor: "var(--line)", background: "var(--bg-3)", color: "var(--ink-dim)" }}>
            Teks promo aktif otomatis akan ikut tampil di ticker depan toko. Pakai judul singkat supaya enak dibaca saat berjalan.
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <AdminSelect
              label="Produk"
              value={data.productId}
              onChange={updateProduct}
              options={products.map((product) => ({ value: product.id, label: product.name }))}
            />
            <AdminSelect
              label="Plan"
              value={data.planId}
              onChange={updatePlan}
              options={
                selectedProduct?.pricingPlans?.length
                  ? selectedProduct.pricingPlans.map((plan) => ({ value: plan.id, label: plan.name }))
                  : [{ value: "", label: "Harga utama produk" }]
              }
              disabled={!selectedProduct?.pricingPlans?.length}
              placeholder="Harga utama produk"
            />
          </div>
          {selectedPlan?.options?.length > 0 && (
            <AdminSelect
              label="Durasi / Opsi"
              value={data.optionId}
              onChange={updateOption}
              options={selectedPlan.options.map((option) => ({ value: option.id, label: option.duration }))}
            />
          )}
          <Field label="Judul Promo" value={data.title} onChange={(value) => set("title", value)} placeholder="Netflix 1P1U 1 bulan jadi 20K hari ini" />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Harga Promo" value={data.promoPrice} onChange={(value) => set("promoPrice", Number(value) || 0)} type="number" />
            <Field label="Harga Coret" value={data.compareAtPrice} onChange={(value) => set("compareAtPrice", Number(value) || 0)} type="number" />
          </div>
          <div>
            <label className="text-[10px] mono uppercase tracking-widest block mb-1.5" style={{ color: "var(--ink-dim)" }}>Deskripsi Promo</label>
            <textarea
              value={data.description}
              onChange={(event) => set("description", event.target.value)}
              rows={4}
              placeholder="Tulis detail promo, syarat, atau durasi promonya..."
              className="w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:border-zinc-800 resize-y"
              style={{ borderColor: "var(--line)" }}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-3 rounded-2xl border p-4 cursor-pointer" style={{ borderColor: "var(--line)" }}>
              <input type="checkbox" checked={data.active} onChange={(event) => set("active", event.target.checked)} />
              <div>
                <div className="text-sm font-semibold">Aktifkan promo</div>
                <div className="text-xs" style={{ color: "var(--ink-dim)" }}>Promo aktif akan muncul di ticker depan</div>
              </div>
            </label>
            <label className="flex items-center gap-3 rounded-2xl border p-4 cursor-pointer" style={{ borderColor: "var(--line)" }}>
              <input type="checkbox" checked={data.highlight} onChange={(event) => set("highlight", event.target.checked)} />
              <div>
                <div className="text-sm font-semibold">Tandai highlight</div>
                <div className="text-xs" style={{ color: "var(--ink-dim)" }}>Buat mudah dikenali di panel admin</div>
              </div>
            </label>
          </div>
        </div>

        <div className="relative flex gap-3 p-6 border-t backdrop-blur-xl" style={{ borderColor: "var(--line)", background: "rgba(255,255,255,0.95)" }}>
          <button type="button" onClick={onClose} className="flex-1 py-3 rounded-full border font-semibold text-sm" style={{ borderColor: "var(--line-2)" }}>Batal</button>
          <button
            type="button"
            onClick={() => onSave(data)}
            disabled={!data.title.trim()}
            className="flex-1 py-3 rounded-full font-semibold text-sm disabled:opacity-40"
            style={{ background: "var(--accent)", color: "white" }}
          >
            Simpan Promo
          </button>
        </div>
      </div>
    </div>
  );
}

function NavBtn({ active, onClick, icon, children }) {
  const Icon = icon;
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition" style={{ background: active ? "var(--ink)" : "transparent", color: active ? "var(--bg)" : "var(--ink)", fontWeight: active ? 600 : 500 }}>
      <Icon className="w-4 h-4" /> {children}
    </button>
  );
}

function StatCard({ label, value, icon, accent }) {
  const Icon = icon;
  return (
    <div className="paper-card p-6 relative overflow-hidden" style={{ background: accent ? "var(--accent)" : undefined, color: accent ? "white" : undefined, borderColor: accent ? "var(--accent)" : undefined }}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-[10px] mono uppercase tracking-widest" style={{ color: accent ? "rgba(255,255,255,0.7)" : "var(--ink-dim)" }}>{label}</div>
        <Icon className="w-4 h-4" />
      </div>
      <div className="serif text-3xl" style={{ fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function ProductEditor({ product, onSave, onClose }) {
  const blank = { id: null, name: "", category: "Streaming", icon: "tv", color: "#8b5e34", price: 0, oldPrice: 0, stock: 0, duration: "1 Bulan", tagline: "", description: "", features: [] };
  const [data, setData] = useState(product || blank);
  const [featInput, setFeatInput] = useState("");
  const set = (key, value) => setData((current) => ({ ...current, [key]: value }));

  const addFeature = () => {
    const nextFeature = featInput.trim();
    if (!nextFeature) {
      return;
    }

    setData((current) => ({
      ...current,
      features: [...current.features, nextFeature],
    }));
    setFeatInput("");
  };

  const removeFeature = (indexToRemove) => {
    setData((current) => ({
      ...current,
      features: current.features.filter((_, itemIndex) => itemIndex !== indexToRemove),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center safe-x safe-y backdrop-blur-sm overflow-y-auto" style={{ background: "rgba(20,21,31,0.5)" }}>
      <div className="w-full max-w-2xl mt-4 sm:mt-0 max-h-[calc(100dvh-1rem)] overflow-y-auto rounded-[2rem] sm:rounded-3xl border scrollbar ios-scroll" style={{ borderColor: "var(--line)", background: "var(--bg-2)" }}>
        <div className="relative flex items-center justify-between gap-4 p-4 sm:p-6 border-b backdrop-blur-xl" style={{ borderColor: "var(--line)", background: "rgba(255,255,255,0.95)" }}>
          <div>
            <div className="text-[10px] mono uppercase tracking-widest" style={{ color: "var(--accent)" }}>Editor</div>
            <h2 className="serif text-[2rem] sm:text-3xl leading-none" style={{ fontWeight: 500 }}>{product ? "Edit" : "Tambah"} Produk</h2>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-stone-100 shrink-0"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          <Field label="Nama Produk" value={data.name} onChange={(value) => set("name", value)} placeholder="Netflix Premium" />
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Kategori" value={data.category} onChange={(value) => set("category", value)} placeholder="Streaming" />
            <Field label="Durasi" value={data.duration} onChange={(value) => set("duration", value)} placeholder="1 Bulan" />
          </div>
          <Field label="Tagline" value={data.tagline} onChange={(value) => set("tagline", value)} placeholder="4K Ultra HD • 4 Layar" />

          <div>
            <label className="text-[10px] mono uppercase tracking-widest block mb-1.5" style={{ color: "var(--ink-dim)" }}>Deskripsi</label>
            <textarea value={data.description} onChange={(event) => set("description", event.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:border-zinc-800" style={{ borderColor: "var(--line)" }} />
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <Field label="Harga" value={data.price} onChange={(value) => set("price", Number(value) || 0)} type="number" />
            <Field label="Harga Lama" value={data.oldPrice} onChange={(value) => set("oldPrice", Number(value) || 0)} type="number" />
            <Field label="Stok" value={data.stock} onChange={(value) => set("stock", Number(value) || 0)} type="number" />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <AdminSelect
              label="Ikon"
              value={data.icon}
              onChange={(value) => set("icon", value)}
              options={Object.keys(ICONS).map((key) => ({ value: key, label: key }))}
            />
            <div>
              <label className="text-[10px] mono uppercase tracking-widest block mb-1.5" style={{ color: "var(--ink-dim)" }}>Warna</label>
              <div className="flex gap-2">
                <input type="color" value={data.color} onChange={(event) => set("color", event.target.value)} className="h-12 w-16 rounded-xl border bg-white cursor-pointer" style={{ borderColor: "var(--line)" }} />
                <input value={data.color} onChange={(event) => set("color", event.target.value)} className="flex-1 px-4 rounded-xl border bg-white mono text-sm focus:outline-none" style={{ borderColor: "var(--line)" }} />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] mono uppercase tracking-widest block mb-1.5" style={{ color: "var(--ink-dim)" }}>Fitur</label>
            <div className="flex gap-2 mb-2">
              <input
                value={featInput}
                onChange={(event) => setFeatInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addFeature();
                  }
                }}
                placeholder="Tekan Enter untuk menambah"
                className="flex-1 px-4 py-2 rounded-xl border bg-white text-sm focus:outline-none"
                style={{ borderColor: "var(--line)" }}
              />
              <button type="button" onClick={addFeature} className="px-4 rounded-xl text-sm font-semibold shrink-0" style={{ background: "var(--ink)", color: "var(--bg)" }}>+</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.features.map((feature, index) => (
                <span key={index} className="px-3 py-1 rounded-full text-xs flex items-center gap-2 border" style={{ borderColor: "var(--line)" }}>
                  {feature}
                  <button type="button" onClick={() => removeFeature(index)}><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative flex gap-3 p-4 sm:p-6 border-t backdrop-blur-xl" style={{ borderColor: "var(--line)", background: "rgba(255,255,255,0.95)" }}>
          <button type="button" onClick={onClose} className="flex-1 py-3 rounded-full border font-semibold text-sm" style={{ borderColor: "var(--line-2)" }}>Batal</button>
          <button type="button" onClick={() => onSave(data)} disabled={!data.name} className="flex-1 py-3 rounded-full font-semibold text-sm disabled:opacity-40" style={{ background: "var(--accent)", color: "white" }}>Simpan Produk</button>
        </div>
      </div>
    </div>
  );
}
