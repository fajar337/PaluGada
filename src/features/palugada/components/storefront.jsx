import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  Crown,
  Download,
  Minus,
  Plus,
  Search,
  Shield,
  ShoppingCart,
  Sparkles,
  Star,
  Trash2,
  UserPlus,
  X,
  Zap,
} from "lucide-react";
import {
  ICONS,
  PAYMENT_METHODS,
  RESELLER_TIERS,
  fmtIDR,
  getDefaultPlanSelection,
  getPaymentDetail,
  getPlanSelection,
  getProductStartingPrice,
  getWhatsAppConfirmationUrl,
} from "../constants";
import { Field, ProductIcon } from "./shared";

export function Home({
  products,
  reviews = [],
  reseller,
  getPrice,
  search,
  setSearch,
  category,
  setCategory,
  onOpen,
  onAdd,
  onRequestProduct,
  onJoinReseller,
}) {
  const [quickProduct, setQuickProduct] = useState(null);
  const [sortBy, setSortBy] = useState("featured");
  const [guaranteeOnly, setGuaranteeOnly] = useState(false);
  const categories = ["Semua", ...Array.from(new Set(products.map((product) => product.category)))];
  const filtered = products
    .filter((product) =>
      (category === "Semua" || product.category === category) &&
      product.name.toLowerCase().includes(search.toLowerCase()) &&
      (!guaranteeOnly || productHasGuarantee(product))
    )
    .sort((first, second) => {
      if (sortBy === "price-low") {
        return getPrice(first, getProductStartingPrice(first)) - getPrice(second, getProductStartingPrice(second));
      }
      if (sortBy === "price-high") {
        return getPrice(second, getProductStartingPrice(second)) - getPrice(first, getProductStartingPrice(first));
      }
      if (sortBy === "stock") {
        return second.stock - first.stock;
      }
      return 0;
    });

  return (
    <div>
      <section className="relative grain overflow-hidden border-b" style={{ borderColor: "var(--line)" }}>
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-20 relative">
          <div className="flex items-center justify-between mb-12 mono text-[10px] uppercase tracking-[0.25em]" style={{ color: "var(--ink-dim)" }}>
            <div>EST. 2024 — Indonesia</div>
            <div className="hidden sm:block">Toko Serba Ada</div>
            <div>№ 0001</div>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <div className="text-xs mono uppercase tracking-widest mb-6 flex items-center gap-3" style={{ color: "var(--accent)" }}>
                <span className="w-8 h-px" style={{ background: "var(--accent)" }}></span>
                Selamat datang di PaluGada
              </div>
              <h1 className="serif leading-[0.85] tracking-tight mb-8 uppercase" style={{ fontSize: "clamp(3.5rem, 9vw, 8.5rem)", fontWeight: 800 }}>
                Apa <span style={{ color: "var(--accent)" }}>lu mau</span>,
                <br />
                <span className="serif-italic normal-case" style={{ fontWeight: 500 }}>gua</span> ada.
              </h1>
              <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
                <p className="text-base leading-relaxed" style={{ color: "var(--ink-dim)" }}>
                  Toko serba ada untuk aplikasi premium. Dari Netflix sampai ChatGPT, dari Spotify sampai CapCut Pro — semua ada, semua murah, semua bergaransi.
                </p>
                <div className="space-y-3">
                  <a href="#katalog" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm hover-lift" style={{ background: "var(--ink)", color: "var(--bg)" }}>
                    Lihat Semua Barang <ArrowRight className="w-4 h-4" />
                  </a>
                  {!reseller && (
                    <button onClick={onJoinReseller} className="block underline-link text-sm font-medium">
                      Atau bergabung sebagai reseller →
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 hidden lg:block">
              <div className="hover-lift relative" style={{ "--r": "2deg", transform: "rotate(2deg)", background: "var(--bg-2)", border: "1.5px solid var(--ink)" }}>
                <div className="flex items-center justify-between px-5 py-2.5 border-b mono text-[10px] uppercase tracking-[0.15em]" style={{ borderColor: "var(--ink)", background: "var(--bg-3)" }}>
                  <span style={{ fontWeight: 600 }}>BEST SELLER</span>
                  <span style={{ color: "var(--accent)" }}>★ 4.9</span>
                </div>
                <div className="p-6 relative">
                  <div className="absolute top-5 right-5">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: products[0]?.color, boxShadow: `0 8px 24px -8px ${products[0]?.color}80` }}>
                      {(() => {
                        const Icon = ICONS[products[0]?.icon] || Sparkles;
                        return <Icon className="w-7 h-7" style={{ color: "white" }} strokeWidth={2.2} />;
                      })()}
                    </div>
                  </div>
                  <div className="text-[10px] mono uppercase tracking-widest mb-2" style={{ color: "var(--ink-dim)" }}>{products[0]?.category}</div>
                  <h3 className="serif text-3xl uppercase pr-16 mb-2" style={{ fontWeight: 700 }}>{products[0]?.name}</h3>
                  <p className="text-xs mb-4" style={{ color: "var(--ink-dim)" }}>{products[0]?.tagline}</p>
                </div>
                <div className="px-5 py-4 flex items-end justify-between" style={{ background: "var(--ink)", color: "var(--bg)" }}>
                  <div>
                    {products[0]?.oldPrice > getProductStartingPrice(products[0] || {}) && (
                      <div className="text-[10px] line-through opacity-50">{fmtIDR(products[0]?.oldPrice)}</div>
                    )}
                    <div className="serif" style={{ color: "var(--accent)", fontSize: "1.7rem", fontWeight: 800, lineHeight: 1 }}>
                      {fmtIDR(getPrice(products[0] || {}, getProductStartingPrice(products[0] || {})))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {!reseller && (
        <section className="border-b" style={{ borderColor: "var(--line)", background: "var(--bg-3)" }}>
          <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "var(--ink)" }}>
                <Crown className="w-6 h-6" style={{ color: "var(--accent)" }} />
              </div>
              <div>
                <div className="serif text-2xl sm:text-3xl" style={{ fontWeight: 500 }}>
                  Jadi <span className="serif-italic" style={{ color: "var(--accent)" }}>reseller</span> & dapatkan diskon hingga 22%
                </div>
                <div className="text-sm mt-1" style={{ color: "var(--ink-dim)" }}>
                  Tier Bronze • Silver • Gold — semakin sering belanja, semakin besar margin
                </div>
              </div>
            </div>
            <button onClick={onJoinReseller} className="px-6 py-3 rounded-full font-semibold text-sm flex items-center gap-2 whitespace-nowrap" style={{ background: "var(--accent)", color: "white" }}>
              <UserPlus className="w-4 h-4" /> Daftar Sekarang
            </button>
          </div>
        </section>
      )}

      {reseller && (
        <section className="border-b" style={{ borderColor: "var(--line)", background: "var(--bg-3)" }}>
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm">
              <Crown className="w-5 h-5" style={{ color: RESELLER_TIERS[reseller.tier]?.color }} />
              <span>
                Mode reseller aktif <strong>({reseller.tier})</strong> — semua harga sudah termasuk diskon {Math.round(RESELLER_TIERS[reseller.tier].discount * 100)}%
              </span>
            </div>
          </div>
        </section>
      )}

      <section id="katalog" className="max-w-7xl mx-auto px-6 pt-20">
        <div className="grid lg:grid-cols-12 gap-8 mb-12 items-end">
          <div className="lg:col-span-6">
            <div className="text-xs mono uppercase tracking-widest mb-3 flex items-center gap-3" style={{ color: "var(--accent)" }}>
              <span className="w-8 h-px" style={{ background: "var(--accent)" }}></span>
              Section II — The Catalog
            </div>
            <h2 className="serif leading-none tracking-tight" style={{ fontSize: "clamp(3rem, 6vw, 5rem)", fontWeight: 500 }}>
              Daftar <span className="serif-italic">isi.</span>
            </h2>
          </div>
          <div className="lg:col-span-6 lg:text-right">
            <div className="relative max-w-md lg:ml-auto">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--ink-dim)" }} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari aplikasi…" className="w-full pl-11 pr-4 py-3 rounded-full text-sm border bg-white focus:outline-none focus:border-zinc-800" style={{ borderColor: "var(--line)" }} />
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar mb-4 ios-scroll">
          {categories.map((item) => (
            <button key={item} onClick={() => setCategory(item)} className="px-4 py-2 rounded-full text-sm whitespace-nowrap border transition" style={{ borderColor: category === item ? "var(--ink)" : "var(--line)", background: category === item ? "var(--ink)" : "transparent", color: category === item ? "var(--bg)" : "var(--ink)", fontWeight: category === item ? 600 : 500 }}>
              {item}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-10">
          <button
            onClick={() => setGuaranteeOnly((current) => !current)}
            className="px-4 py-2 rounded-full text-sm border transition w-fit"
            style={{ borderColor: guaranteeOnly ? "var(--ink)" : "var(--line)", background: guaranteeOnly ? "var(--ink)" : "transparent", color: guaranteeOnly ? "var(--bg)" : "var(--ink)" }}
          >
            Full Garansi
          </button>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="px-4 py-2 rounded-full border bg-white text-sm focus:outline-none" style={{ borderColor: "var(--line)" }}>
            <option value="featured">Urutan rekomendasi</option>
            <option value="price-low">Harga termurah</option>
            <option value="price-high">Harga termahal</option>
            <option value="stock">Stok terbanyak</option>
          </select>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20 filter-fade">
          {filtered.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              reviews={reviews.filter((review) => review.productId === product.id)}
              reseller={reseller}
              effectivePrice={getPrice(product, getProductStartingPrice(product))}
              onOpen={() => onOpen(product)}
              onPickPlan={() => setQuickProduct(product)}
              onAdd={() => onAdd(product)}
              delay={index * 0.05}
              index={index}
            />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-20 serif text-2xl serif-italic" style={{ color: "var(--ink-dim)" }}>
              Tidak ada hasil yang ditemukan…
            </div>
          )}
        </div>
      </section>

      {quickProduct && (
        <QuickPlanModal
          key={quickProduct.id}
          product={quickProduct}
          getPrice={getPrice}
          onClose={() => setQuickProduct(null)}
          onAdd={(selection) => {
            onAdd(quickProduct, selection);
            setQuickProduct(null);
          }}
        />
      )}

      <section className="max-w-7xl mx-auto px-6 pb-8">
        <FAQAccordion />
      </section>

      <ProductRequestSection onRequestProduct={onRequestProduct} />
    </div>
  );
}

function ProductRequestSection({ onRequestProduct }) {
  const [name, setName] = useState("");
  const [wa, setWa] = useState("");
  const [appName, setAppName] = useState("");
  const [note, setNote] = useState("");

  const submit = (event) => {
    event.preventDefault();
    if (!name.trim() || !wa.trim() || !appName.trim()) {
      return;
    }

    onRequestProduct({ name, wa, appName, note });
    setName("");
    setWa("");
    setAppName("");
    setNote("");
  };

  return (
    <section id="request-produk" className="max-w-7xl mx-auto px-6 pb-20">
      <div className="paper-card overflow-hidden grid lg:grid-cols-12">
        <div className="lg:col-span-5 p-8 lg:p-10" style={{ background: "var(--ink)", color: "var(--bg)" }}>
          <div className="text-[10px] mono uppercase tracking-widest mb-4 opacity-70">Request Produk</div>
          <h2 className="serif leading-none mb-5" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 500 }}>
            App yang dicari <span className="serif-italic">belum ada?</span>
          </h2>
          <p className="text-sm leading-relaxed opacity-75">
            Isi request di sini. Admin bakal cek ketersediaan, harga, dan kabarin kamu lewat WhatsApp kalau produknya bisa disediakan.
          </p>
        </div>

        <form onSubmit={submit} className="lg:col-span-7 p-8 lg:p-10 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Nama" value={name} onChange={setName} placeholder="Nama kamu" />
            <Field label="WhatsApp" value={wa} onChange={setWa} placeholder="08xxxxxxxxxx" />
          </div>
          <Field label="Nama Apps Premium" value={appName} onChange={setAppName} placeholder="Contoh: Disney+, Vidio, WPS, dll" />
          <div>
            <label className="block text-[10px] mono uppercase tracking-widest mb-2" style={{ color: "var(--ink-dim)" }}>Catatan</label>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Tulis durasi, jenis akun, budget, atau request khusus..."
              className="w-full min-h-28 px-4 py-3 rounded-2xl border bg-white text-sm focus:outline-none resize-y"
              style={{ borderColor: "var(--line)" }}
            />
          </div>
          <button type="submit" disabled={!name.trim() || !wa.trim() || !appName.trim()} className="px-6 py-3 rounded-full font-semibold text-sm disabled:opacity-40" style={{ background: "var(--accent)", color: "white" }}>
            Kirim Request
          </button>
        </form>
      </div>
    </section>
  );
}

function FAQAccordion() {
  const [open, setOpen] = useState("faq");
  const items = [
    {
      id: "faq",
      eyebrow: "Bantuan",
      title: "FAQ",
      body: "Pilih produk, buat booking, bayar sesuai metode pilihan, lalu konfirmasi lewat WhatsApp. Admin akan proses setelah pembayaran valid.",
    },
    {
      id: "garansi",
      eyebrow: "Garansi",
      title: "Gimana Cara Garansi",
      body: "Kalau akun bermasalah selama masa garansi, kirim Order ID dan kendalanya via WhatsApp. Admin akan bantu cek, replace, atau pandu ulang aksesnya.",
    },
    {
      id: "cara-order",
      eyebrow: "Cara Order",
      title: "Gimana Cara Order",
      body: "Masukkan produk ke cart, checkout, isi data WhatsApp aktif, pilih metode pembayaran, lalu kirim bukti transfer dari halaman booking.",
    },
  ];

  return (
    <div className="paper-card divide-y" style={{ borderColor: "var(--line)" }}>
      {items.map((item) => {
        const active = open === item.id;

        return (
          <div key={item.id} id={item.id} className="scroll-mt-28" style={{ borderColor: "var(--line)" }}>
            <button onClick={() => setOpen(active ? "" : item.id)} className="w-full p-6 text-left flex items-center justify-between gap-4">
              <div>
                <div className="text-[10px] mono uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>{item.eyebrow}</div>
                <h3 className="serif text-2xl leading-none" style={{ fontWeight: 500 }}>{item.title}</h3>
              </div>
              <Plus className={`w-5 h-5 transition ${active ? "rotate-45" : ""}`} />
            </button>
            {active && (
              <p className="px-6 pb-6 text-sm leading-relaxed filter-fade" style={{ color: "var(--ink-dim)" }}>{item.body}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function ProductCard({ product, reviews = [], reseller, effectivePrice, onOpen, onPickPlan, onAdd, delay = 0, index = 0 }) {
  const Icon = ICONS[product.icon] || Sparkles;
  const num = String(index + 1).padStart(3, "0");
  const reviewSummary = getReviewSummary(reviews);
  const badge = getProductBadge(product, index);

  return (
    <article className="group relative cursor-pointer slidein hover-lift overflow-hidden flex flex-col" style={{ animationDelay: `${delay}s`, background: "var(--bg-2)", border: "1.5px solid var(--ink)" }} onClick={onOpen}>
      <div className="flex items-center justify-between px-5 py-2.5 border-b mono text-[10px] uppercase tracking-[0.15em]" style={{ borderColor: "var(--ink)", background: "var(--bg-3)" }}>
        <span style={{ color: "var(--ink)", fontWeight: 600 }}>SKU/{num}</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: product.stock > 5 ? "#16a34a" : "var(--accent)" }}></span>
          <span style={{ color: "var(--ink-dim)" }}>{product.stock > 0 ? "READY" : "HABIS"}</span>
        </span>
      </div>

      <div className="p-6 pb-5 relative flex-1">
        <div className="absolute top-5 right-5">
          <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg" style={{ background: product.color, boxShadow: `0 8px 24px -8px ${product.color}80` }}>
            <Icon className="w-7 h-7" style={{ color: "white" }} strokeWidth={2.2} />
          </div>
        </div>

        <div className="text-[10px] mono uppercase tracking-widest mb-2" style={{ color: "var(--ink-dim)" }}>{product.category}</div>
        {badge && (
          <div className="inline-flex mb-3 px-2.5 py-1 rounded-full text-[9px] mono uppercase tracking-widest font-bold" style={{ background: "var(--ink)", color: "var(--bg)" }}>
            {badge}
          </div>
        )}
        <h3 className="serif text-3xl leading-[0.95] pr-16 mb-2 uppercase" style={{ fontWeight: 700 }}>{product.name}</h3>
        <p className="text-sm leading-snug" style={{ color: "var(--ink-dim)" }}>{product.tagline}</p>

        <div className="grid grid-cols-3 gap-1 mt-5 py-3 border-y-2 border-dashed" style={{ borderColor: "var(--line)" }}>
          <div>
            <div className="text-[9px] mono uppercase tracking-widest mb-0.5" style={{ color: "var(--ink-dim)" }}>Durasi</div>
            <div className="text-xs font-bold">{product.duration}</div>
          </div>
          <div className="text-center border-x border-dashed px-1" style={{ borderColor: "var(--line)" }}>
            <div className="text-[9px] mono uppercase tracking-widest mb-0.5" style={{ color: "var(--ink-dim)" }}>Stok</div>
            <div className="text-xs font-bold">{product.stock > 0 ? product.stock : "—"}</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] mono uppercase tracking-widest mb-0.5" style={{ color: "var(--ink-dim)" }}>Rating</div>
            <div className="text-xs font-bold">{reviewSummary.count ? `★ ${reviewSummary.average}` : "Baru"}</div>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 flex items-center justify-between gap-3" style={{ background: "var(--ink)", color: "var(--bg)" }}>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
            {product.pricingPlans?.length && <span className="text-[10px] opacity-60">Mulai dari</span>}
            {reseller && <span className="text-[9px] mono px-1.5 py-0.5 font-bold" style={{ background: "var(--gold)", color: "white" }}>RSL</span>}
          </div>
          <div className="serif leading-none truncate" style={{ color: "var(--accent)", fontSize: "1.7rem", fontWeight: 800 }}>
            {fmtIDR(effectivePrice)}
          </div>
        </div>
        <button onClick={(event) => { event.stopPropagation(); product.pricingPlans?.length ? onPickPlan() : onAdd(); }} disabled={product.stock === 0} className="w-12 h-12 rounded-full flex items-center justify-center transition disabled:opacity-30 hover:scale-110 active:scale-95 shrink-0" style={{ background: "var(--accent)", color: "white" }}>
          <Plus className="w-5 h-5" strokeWidth={3.5} />
        </button>
      </div>
    </article>
  );
}

function QuickPlanModal({ product, getPrice, onClose, onAdd }) {
  const [selection, setSelection] = useState(getDefaultPlanSelection(product));
  const selectedPlan = getPlanSelection(product, selection?.planId, selection?.optionId);
  const effectivePrice = getPrice(product, selectedPlan?.option.price || product.price);
  const discount = product.oldPrice > effectivePrice ? Math.round((1 - effectivePrice / product.oldPrice) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center safe-x safe-y" role="dialog" aria-modal="true">
      <button className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} aria-label="Tutup pilihan plan" />
      <div className="relative w-full max-w-2xl paper-card p-5 sm:p-7 zoomin max-h-[calc(100dvh-2rem)] overflow-y-auto scrollbar ios-scroll">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="text-[10px] mono uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>
              Pilih dulu sebelum masuk keranjang
            </div>
            <h2 className="serif text-4xl leading-none uppercase" style={{ fontWeight: 600 }}>{product.name}</h2>
            <p className="text-sm mt-2" style={{ color: "var(--ink-dim)" }}>{product.tagline}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full border flex items-center justify-center shrink-0" style={{ borderColor: "var(--line-2)" }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {product.pricingPlans.map((plan) => (
            <div key={plan.id}>
              <div className="text-[10px] mono uppercase tracking-widest mb-2" style={{ color: "var(--ink-dim)" }}>{plan.name}</div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {plan.options.map((option) => {
                  const active = selection?.planId === plan.id && selection?.optionId === option.id;

                  return (
                    <button
                      key={option.id}
                      onClick={() => setSelection({ planId: plan.id, optionId: option.id })}
                      className="text-left rounded-2xl border px-4 py-3 transition hover:-translate-y-0.5"
                      style={{
                        borderColor: active ? "var(--ink)" : "var(--line)",
                        background: active ? "var(--ink)" : "var(--bg-2)",
                        color: active ? "var(--bg)" : "var(--ink)",
                      }}
                    >
                      <div className="text-sm font-semibold">{option.duration}</div>
                      <div className="serif text-2xl leading-none mt-1" style={{ color: active ? "var(--accent)" : "var(--accent)" }}>
                        {fmtIDR(getPrice(product, option.price))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-[1.5rem] p-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4" style={{ background: "var(--ink)", color: "var(--bg)" }}>
          <div>
            <div className="text-[10px] mono uppercase tracking-widest opacity-60 mb-2">Pilihan kamu</div>
            <div className="font-semibold">{selectedPlan?.plan.name} - {selectedPlan?.option.duration}</div>
            <div className="flex items-center gap-2 mt-2">
              {product.oldPrice > effectivePrice && <span className="text-xs line-through opacity-50">{fmtIDR(product.oldPrice)}</span>}
              {discount > 0 && <span className="text-[9px] mono px-1.5 py-0.5 font-bold" style={{ background: "var(--accent)", color: "white" }}>-{discount}%</span>}
            </div>
            <div className="serif mt-1" style={{ color: "var(--accent)", fontSize: "2.25rem", fontWeight: 800, lineHeight: 1 }}>{fmtIDR(effectivePrice)}</div>
          </div>
          <button onClick={() => onAdd(selection)} className="px-6 py-4 rounded-full font-semibold text-sm whitespace-nowrap transition hover:scale-[1.02]" style={{ background: "var(--accent)", color: "white" }}>
            Tambah ke Keranjang
          </button>
        </div>
      </div>
    </div>
  );
}

function getReviewSummary(reviews = []) {
  if (!reviews.length) {
    return { average: "0.0", count: 0 };
  }

  const total = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
  return {
    average: (total / reviews.length).toFixed(1),
    count: reviews.length,
  };
}

function productHasGuarantee(product) {
  const text = [
    product.tagline,
    product.description,
    ...(product.features || []),
    ...(product.pricingPlans || []).flatMap((plan) => [plan.name, ...plan.options.map((option) => option.duration)]),
  ]
    .join(" ")
    .toLowerCase();

  return text.includes("garansi") || text.includes("fullgar") || text.includes("fullgarr");
}

function getProductBadge(product, index) {
  if (index === 0) {
    return "Best Seller";
  }
  if (productHasGuarantee(product)) {
    return "Full Garansi";
  }
  if (getProductStartingPrice(product) <= 10000) {
    return "Termurah";
  }
  return "";
}

function ReviewStars({ rating, onChange, size = "md" }) {
  const sizeClass = size === "sm" ? "w-4 h-4" : "w-6 h-6";

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => {
        const active = value <= rating;
        const Icon = (
          <Star
            className={`${sizeClass} ${active ? "fill-current star-pop" : ""}`}
            style={{ color: active ? "var(--accent)" : "var(--line-2)" }}
          />
        );

        if (!onChange) {
          return <span key={value}>{Icon}</span>;
        }

        return (
          <button key={value} type="button" onClick={() => onChange(value)} className="transition hover:scale-110">
            {Icon}
          </button>
        );
      })}
    </div>
  );
}

export function Detail({ product, reviews = [], reseller, getPrice, onBack, onAdd, onReview, onBuy }) {
  const [qty, setQty] = useState(1);
  const [selection, setSelection] = useState(getDefaultPlanSelection(product));
  const selectedPlan = getPlanSelection(product, selection?.planId, selection?.optionId);
  const basePrice = selectedPlan?.option.price || product.price;
  const effectivePrice = getPrice(product, basePrice);
  const discount = product.oldPrice > effectivePrice ? Math.round((1 - effectivePrice / product.oldPrice) * 100) : 0;
  const selectedCartOption = selectedPlan
    ? {
        planId: selectedPlan.plan.id,
        optionId: selectedPlan.option.id,
      }
    : null;
  const reviewSummary = getReviewSummary(reviews);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <button onClick={onBack} className="flex items-center gap-2 text-sm mb-10 hover:opacity-60 transition" style={{ color: "var(--ink-dim)" }}>
        <ArrowLeft className="w-4 h-4" /> Kembali
      </button>

      <div className="text-xs mono uppercase tracking-widest mb-4 flex items-center gap-3" style={{ color: "var(--accent)" }}>
        <span className="w-8 h-px" style={{ background: "var(--accent)" }}></span>
        {product.category} — Edisi April
      </div>

      <div className="grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5">
          <div className="paper-card p-12 lg:p-16 flex items-center justify-center relative overflow-hidden grain" style={{ background: `linear-gradient(135deg, ${product.color}10, ${product.color}02)`, border: `1px solid ${product.color}30` }}>
            <ProductIcon icon={product.icon} color={product.color} size={220} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="paper-card p-3"><Shield className="w-4 h-4 mx-auto mb-1" style={{ color: "var(--accent)" }} /><div className="text-[10px] mono uppercase tracking-wider">Garansi</div></div>
            <div className="paper-card p-3"><Zap className="w-4 h-4 mx-auto mb-1" style={{ color: "var(--accent)" }} /><div className="text-[10px] mono uppercase tracking-wider">Instan</div></div>
            <div className="paper-card p-3"><Award className="w-4 h-4 mx-auto mb-1" style={{ color: "var(--accent)" }} /><div className="text-[10px] mono uppercase tracking-wider">Original</div></div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <h1 className="serif tracking-tight mb-3 leading-none" style={{ fontSize: "clamp(3rem, 6vw, 5.5rem)", fontWeight: 500 }}>
            {product.name.split(" ")[0]} <span className="serif-italic">{product.name.split(" ").slice(1).join(" ")}</span>.
          </h1>
          <div className="text-lg serif-italic mb-6" style={{ color: "var(--ink-dim)" }}>"{product.tagline}"</div>
          {product.pricingPlans?.length && (
            <div className="paper-card p-5 mb-8">
              <div className="text-xs mono uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>Pilih Plan & Durasi</div>
              <div className="space-y-4">
                {product.pricingPlans.map((plan) => (
                  <div key={plan.id}>
                    <div className="text-[10px] mono uppercase tracking-widest mb-2" style={{ color: "var(--ink-dim)" }}>{plan.name}</div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {plan.options.map((option) => {
                        const active = selection?.planId === plan.id && selection?.optionId === option.id;
                        return (
                          <button
                            key={option.id}
                            onClick={() => setSelection({ planId: plan.id, optionId: option.id })}
                            className="rounded-2xl border px-4 py-3 text-left transition hover:scale-[1.01]"
                            style={{
                              borderColor: active ? "var(--ink)" : "var(--line)",
                              background: active ? "var(--ink)" : "white",
                              color: active ? "var(--bg)" : "var(--ink)",
                            }}
                          >
                            <div className="text-sm font-semibold">{option.duration}</div>
                            <div className="serif text-2xl leading-none mt-1" style={{ color: active ? "var(--gold)" : "var(--accent)", fontWeight: 600 }}>{fmtIDR(option.price)}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 mb-8">
            <ReviewStars rating={Math.round(Number(reviewSummary.average) || 0)} size="sm" />
            <span className="text-sm ml-2" style={{ color: "var(--ink-dim)" }}>
              {reviewSummary.count ? `${reviewSummary.average} - ${reviewSummary.count} ulasan` : "Belum ada ulasan"}
            </span>
          </div>
          <div className="flex items-baseline gap-4 mb-8 pb-8 border-b" style={{ borderColor: "var(--line)" }}>
            <div className="serif leading-none" style={{ color: "var(--accent)", fontSize: "clamp(3rem, 5vw, 4.5rem)", fontWeight: 600 }}>{fmtIDR(effectivePrice)}</div>
            {product.oldPrice > effectivePrice && (
              <div>
                <div className="text-xl line-through" style={{ color: "var(--ink-dim)" }}>{fmtIDR(product.oldPrice)}</div>
                <div className="text-xs mono mt-1" style={{ color: "var(--accent)" }}>HEMAT {discount}%</div>
              </div>
            )}
            {reseller && (
              <div className="ml-auto text-right">
                <div className="text-[10px] mono uppercase tracking-widest" style={{ color: "var(--ink-dim)" }}>Reseller {reseller.tier}</div>
                <div className="text-xs font-semibold" style={{ color: "var(--gold)" }}>−{Math.round(RESELLER_TIERS[reseller.tier].discount * 100)}% applied</div>
              </div>
            )}
          </div>
          {selectedPlan && (
            <div className="rounded-2xl border px-4 py-3 mb-8 text-sm" style={{ borderColor: "var(--line)", background: "var(--bg-3)" }}>
              Pilihan: <strong>{selectedPlan.plan.name}</strong> - {selectedPlan.option.duration}
            </div>
          )}
          <p className="leading-relaxed mb-8 text-base" style={{ color: "var(--ink-dim)" }}>{product.description}</p>
          <div className="mb-10">
            <div className="text-xs mono uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>Yang Termasuk</div>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
              {product.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3 text-sm border-b pb-3" style={{ borderColor: "var(--line)" }}>
                  <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--accent)" }} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border rounded-full" style={{ borderColor: "var(--line-2)" }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3"><Minus className="w-4 h-4" /></button>
              <span className="px-5 mono font-bold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-3"><Plus className="w-4 h-4" /></button>
            </div>
            <div className="text-sm mono" style={{ color: "var(--ink-dim)" }}>STOK {product.stock}</div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => onAdd(qty, selectedCartOption)} disabled={product.stock === 0} className="flex-1 py-4 rounded-full border font-semibold text-sm hover:bg-white transition disabled:opacity-40" style={{ borderColor: "var(--line-2)" }}>+ Keranjang</button>
            <button onClick={() => onBuy(qty, selectedCartOption)} disabled={product.stock === 0} className="flex-1 py-4 rounded-full font-semibold text-sm transition disabled:opacity-90 hover:scale-[1.02]" style={{ background: "var(--accent)", color: "white" }}>Beli Sekarang →</button>
          </div>
        </div>
      </div>

      <ReviewsSection reviews={reviews} onReview={onReview} />
    </div>
  );
}

function ReviewsSection({ reviews, onReview }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const reviewSummary = getReviewSummary(reviews);

  const submit = (event) => {
    event.preventDefault();
    if (!name.trim() || !message.trim()) {
      return;
    }

    onReview({ name, message, rating });
    setName("");
    setMessage("");
    setRating(5);
  };

  return (
    <section className="mt-16 grid lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4">
        <div className="paper-card p-7 sticky top-28">
          <div className="text-xs mono uppercase tracking-widest mb-3" style={{ color: "var(--accent)" }}>Reviews</div>
          <h2 className="serif text-4xl leading-none mb-4" style={{ fontWeight: 500 }}>
            Bintang & <span className="serif-italic">ulasan.</span>
          </h2>
          <div className="flex items-center gap-3 mb-3">
            <ReviewStars rating={Math.round(Number(reviewSummary.average) || 0)} />
            <span className="serif text-3xl" style={{ color: "var(--accent)", fontWeight: 700 }}>
              {reviewSummary.count ? reviewSummary.average : "-"}
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--ink-dim)" }}>
            {reviewSummary.count ? `${reviewSummary.count} ulasan dari pembeli.` : "Belum ada ulasan. Jadilah yang pertama kasih testimoni."}
          </p>
        </div>
      </div>

      <div className="lg:col-span-8 space-y-5">
        <form onSubmit={submit} className="paper-card p-7">
          <div className="text-xs mono uppercase tracking-widest mb-5" style={{ color: "var(--accent)" }}>Tulis Ulasan</div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <Field label="Nama" value={name} onChange={setName} placeholder="Nama kamu" />
            <div>
              <label className="block text-[10px] mono uppercase tracking-widest mb-2" style={{ color: "var(--ink-dim)" }}>Rating</label>
              <div className="h-[46px] flex items-center">
                <ReviewStars rating={rating} onChange={setRating} />
              </div>
            </div>
          </div>
          <label className="block text-[10px] mono uppercase tracking-widest mb-2" style={{ color: "var(--ink-dim)" }}>Ulasan</label>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Ceritain pengalaman order kamu..."
            className="w-full min-h-32 px-4 py-3 rounded-2xl border bg-white text-sm focus:outline-none resize-y"
            style={{ borderColor: "var(--line)" }}
          />
          <button type="submit" disabled={!name.trim() || !message.trim()} className="mt-4 px-6 py-3 rounded-full font-semibold text-sm disabled:opacity-40" style={{ background: "var(--accent)", color: "white" }}>
            Kirim Ulasan
          </button>
        </form>

        {reviews.length === 0 ? (
          <div className="paper-card p-7 text-sm" style={{ color: "var(--ink-dim)" }}>
            Belum ada ulasan untuk produk ini.
          </div>
        ) : (
          reviews.map((review) => (
            <article key={review.id} className="paper-card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <div className="serif text-2xl leading-none" style={{ fontWeight: 500 }}>{review.name}</div>
                  <div className="text-[10px] mono uppercase tracking-widest mt-1" style={{ color: "var(--ink-dim)" }}>
                    {new Date(review.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                  </div>
                </div>
                <ReviewStars rating={Number(review.rating)} size="sm" />
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--ink-dim)" }}>{review.message}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export function TrackOrder({ onFindOrder, onBack }) {
  const [orderId, setOrderId] = useState("");
  const [wa, setWa] = useState("");
  const [searched, setSearched] = useState(false);
  const [foundOrder, setFoundOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setSearched(true);
    setFoundOrder(await onFindOrder(orderId.trim(), wa));
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <button onClick={onBack} className="flex items-center gap-2 text-sm mb-8" style={{ color: "var(--ink-dim)" }}>
        <ArrowLeft className="w-4 h-4" /> Kembali ke toko
      </button>
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 paper-card p-7">
          <div className="text-xs mono uppercase tracking-widest mb-3" style={{ color: "var(--accent)" }}>Cek Pesanan</div>
          <h1 className="serif leading-none mb-4" style={{ fontSize: "clamp(3rem, 6vw, 5rem)", fontWeight: 500 }}>
            Lacak <span className="serif-italic">order.</span>
          </h1>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--ink-dim)" }}>
            Masukkan Order ID dan nomor WhatsApp yang dipakai checkout untuk melihat status pesanan.
          </p>
          <form onSubmit={submit} className="space-y-4">
            <Field label="Order ID" value={orderId} onChange={setOrderId} placeholder="ORD-XXXX" />
            <Field label="Nomor WhatsApp" value={wa} onChange={setWa} placeholder="08xxxxxxxxxx" />
            <button type="submit" disabled={loading || !orderId.trim() || !wa.trim()} className="w-full py-4 rounded-full font-semibold text-sm disabled:opacity-40" style={{ background: "var(--accent)", color: "white" }}>
              {loading ? "Mengecek..." : "Cek Status"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-7">
          {loading ? (
            <div className="paper-card p-10 text-center serif text-2xl serif-italic" style={{ color: "var(--ink-dim)" }}>
              mencari pesanan...
            </div>
          ) : !searched ? (
            <div className="paper-card p-10 text-center serif text-2xl serif-italic" style={{ color: "var(--ink-dim)" }}>
              Status pesanan akan tampil di sini.
            </div>
          ) : foundOrder ? (
            <OrderTrackingCard order={foundOrder} />
          ) : (
            <div className="paper-card p-10 text-center">
              <div className="serif text-3xl serif-italic mb-3" style={{ color: "var(--ink-dim)" }}>pesanan tidak ditemukan</div>
              <p className="text-sm" style={{ color: "var(--ink-dim)" }}>Cek lagi Order ID dan nomor WhatsApp kamu.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OrderTrackingCard({ order }) {
  const steps = ["Menunggu Pembayaran", "Menunggu Verifikasi", "Diproses", "Selesai"];
  const activeIndex = Math.max(0, steps.indexOf(order.status));
  const payment = getPaymentDetail(order.buyer.method);

  return (
    <div className="paper-card p-7 receipt-rise">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <div className="mono text-xs mb-2" style={{ color: "var(--accent)" }}>{order.id}</div>
          <h2 className="serif text-4xl leading-none" style={{ fontWeight: 500 }}>{order.buyer.name}</h2>
          <p className="text-sm mt-2" style={{ color: "var(--ink-dim)" }}>{new Date(order.createdAt).toLocaleString("id-ID")}</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs mono uppercase w-fit" style={{ background: "var(--ink)", color: "var(--bg)" }}>{order.status}</span>
      </div>

      <div className="grid sm:grid-cols-4 gap-2 mb-7">
        {steps.map((step, index) => {
          const active = index <= activeIndex && order.status !== "Dibatalkan";
          return (
            <div key={step} className="rounded-2xl border p-3 text-xs" style={{ borderColor: active ? "var(--ink)" : "var(--line)", background: active ? "var(--bg-3)" : "transparent" }}>
              <div className="mono text-[9px] uppercase tracking-widest mb-1" style={{ color: active ? "var(--accent)" : "var(--ink-dim)" }}>Step {index + 1}</div>
              <div className="font-semibold">{step}</div>
            </div>
          );
        })}
      </div>

      <div className="space-y-2 border-t pt-5 mb-5" style={{ borderColor: "var(--line)" }}>
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between gap-4 text-sm">
            <span>{item.qty}x {item.name}{item.plan ? ` - ${item.plan} (${item.duration})` : ""}</span>
            <span className="mono" style={{ color: "var(--ink-dim)" }}>{fmtIDR(item.price * item.qty)}</span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-4 text-sm" style={{ background: "var(--bg-3)" }}>
        <div className="flex justify-between gap-4 mb-2"><span style={{ color: "var(--ink-dim)" }}>Metode</span><strong>{payment.label}</strong></div>
        <div className="flex justify-between gap-4 mb-2"><span style={{ color: "var(--ink-dim)" }}>Tujuan</span><span className="mono text-right">{payment.accountNumber}</span></div>
        <div className="flex justify-between gap-4"><span style={{ color: "var(--ink-dim)" }}>Total</span><strong style={{ color: "var(--accent)" }}>{fmtIDR(order.total)}</strong></div>
      </div>
    </div>
  );
}

export function CartView({ items, total, originalTotal, updateQty, remove, onBack, onCheckout }) {
  const savings = originalTotal - total;
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <button onClick={onBack} className="flex items-center gap-2 text-sm mb-8" style={{ color: "var(--ink-dim)" }}>
        <ArrowLeft className="w-4 h-4" /> Lanjut belanja
      </button>
      <div className="text-xs mono uppercase tracking-widest mb-3" style={{ color: "var(--accent)" }}>Section III — Cart</div>
      <h1 className="serif leading-none mb-3" style={{ fontSize: "clamp(3rem, 6vw, 5.5rem)", fontWeight: 500 }}>
        Keranjang<span className="serif-italic">.</span>
      </h1>
      <div className="text-sm mb-12" style={{ color: "var(--ink-dim)" }}>{items.length} produk</div>

      {items.length === 0 ? (
        <div className="paper-card text-center py-24">
          <ShoppingCart className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--ink-dim)" }} />
          <div className="serif text-3xl serif-italic mb-6" style={{ color: "var(--ink-dim)" }}>masih kosong…</div>
          <button onClick={onBack} className="px-6 py-3 rounded-full font-semibold text-sm" style={{ background: "var(--ink)", color: "var(--bg)" }}>Mulai Belanja</button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div key={item.cartKey} className="paper-card flex items-center gap-4 p-5">
                <ProductIcon icon={item.icon} color={item.color} size={56} />
                <div className="flex-1">
                  <div className="serif text-xl" style={{ fontWeight: 500 }}>{item.name}</div>
                  <div className="text-xs serif-italic" style={{ color: "var(--ink-dim)" }}>
                    {item.selectedPlanName ? `${item.selectedPlanName} - ${item.selectedDuration}` : `${item.duration} · ${item.tagline}`}
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-bold" style={{ color: "var(--accent)" }}>{fmtIDR(item.effectivePrice)}</span>
                    {item.effectivePrice !== item.price && <span className="text-xs line-through" style={{ color: "var(--ink-dim)" }}>{fmtIDR(item.price)}</span>}
                  </div>
                </div>
                <div className="flex items-center border rounded-full" style={{ borderColor: "var(--line-2)" }}>
                  <button onClick={() => updateQty(item.cartKey, -1)} className="p-2"><Minus className="w-3 h-3" /></button>
                  <span className="px-3 mono text-sm">{item.qty}</span>
                  <button onClick={() => updateQty(item.cartKey, 1)} className="p-2"><Plus className="w-3 h-3" /></button>
                </div>
                <button onClick={() => remove(item.cartKey)} className="p-2 hover:text-red-500" style={{ color: "var(--ink-dim)" }}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="paper-card p-7 h-fit sticky top-32">
            <div className="text-xs mono uppercase tracking-widest mb-5" style={{ color: "var(--accent)" }}>Ringkasan</div>
            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between"><span style={{ color: "var(--ink-dim)" }}>Subtotal</span><span>{fmtIDR(originalTotal)}</span></div>
              {savings > 0 && <div className="flex justify-between"><span style={{ color: "var(--ink-dim)" }}>Diskon Reseller</span><span style={{ color: "var(--accent)" }}>−{fmtIDR(savings)}</span></div>}
              <div className="flex justify-between"><span style={{ color: "var(--ink-dim)" }}>Biaya admin</span><span>Gratis</span></div>
            </div>
            <div className="border-t pt-5 mb-6" style={{ borderColor: "var(--line)" }}>
              <div className="text-xs mono uppercase mb-1" style={{ color: "var(--ink-dim)" }}>Total</div>
              <div className="serif" style={{ color: "var(--accent)", fontSize: "2.5rem", fontWeight: 600, lineHeight: 1 }}>{fmtIDR(total)}</div>
            </div>
            <button onClick={onCheckout} className="w-full py-4 rounded-full font-semibold text-sm transition hover:scale-[1.02] flex items-center justify-center gap-2" style={{ background: "var(--accent)", color: "white" }}>
              Lanjut ke Checkout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function Checkout({ items, total, reseller, onBack, onPlace }) {
  const [name, setName] = useState(reseller?.name || "");
  const [email, setEmail] = useState(reseller?.email || "");
  const [wa, setWa] = useState(reseller?.wa || "");
  const [method, setMethod] = useState("DANA");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!name || !email || !wa) {
      return;
    }
    setSubmitting(true);
    await onPlace({ name, email, wa, method });
    setSubmitting(false);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="serif text-3xl serif-italic mb-4" style={{ color: "var(--ink-dim)" }}>keranjang kosong…</div>
        <button onClick={onBack} className="px-6 py-3 rounded-full" style={{ background: "var(--ink)", color: "var(--bg)" }}>Kembali</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <button onClick={onBack} className="flex items-center gap-2 text-sm mb-8" style={{ color: "var(--ink-dim)" }}>
        <ArrowLeft className="w-4 h-4" /> Kembali ke keranjang
      </button>
      <div className="text-xs mono uppercase tracking-widest mb-3" style={{ color: "var(--accent)" }}>Section IV — Checkout</div>
      <h1 className="serif leading-none mb-12" style={{ fontSize: "clamp(3rem, 6vw, 5.5rem)", fontWeight: 500 }}>
        Selesaikan<span className="serif-italic"> pesanan.</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-5">
          <div className="paper-card p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center serif text-sm" style={{ background: "var(--ink)", color: "var(--bg)" }}>1</div>
              <div className="text-xs mono uppercase tracking-widest" style={{ color: "var(--accent)" }}>Data Pembeli</div>
            </div>
            <div className="space-y-4">
              <Field label="Nama Lengkap" value={name} onChange={setName} placeholder="John Doe" />
              <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="kamu@email.com" />
              <Field label="Nomor WhatsApp" value={wa} onChange={setWa} placeholder="08xxxxxxxxxx" />
            </div>
          </div>

          <div className="paper-card p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center serif text-sm" style={{ background: "var(--ink)", color: "var(--bg)" }}>2</div>
              <div className="text-xs mono uppercase tracking-widest" style={{ color: "var(--accent)" }}>Metode Pembayaran</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PAYMENT_METHODS.map((item) => (
                <button key={item} onClick={() => setMethod(item)} className="py-4 rounded-xl border text-sm font-semibold transition" style={{ borderColor: method === item ? "var(--ink)" : "var(--line)", background: method === item ? "var(--ink)" : "transparent", color: method === item ? "var(--bg)" : "var(--ink)" }}>
                  {item}
                </button>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border p-4 text-sm leading-relaxed" style={{ borderColor: "var(--line)", background: "var(--bg-3)", color: "var(--ink-dim)" }}>
              Setelah order dibuat, lakukan pembayaran sesuai metode yang dipilih lalu konfirmasi via WhatsApp. Akun akan dikirim admin setelah pembayaran diverifikasi.
            </div>
          </div>
        </div>

        <div className="paper-card p-7 h-fit">
          <div className="text-xs mono uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>Pesananmu</div>
          <div className="space-y-3 mb-5 max-h-60 overflow-y-auto scrollbar">
            {items.map((item) => (
              <div key={item.cartKey} className="flex items-center gap-3 text-sm pb-3 border-b" style={{ borderColor: "var(--line)" }}>
                <ProductIcon icon={item.icon} color={item.color} size={36} />
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium">{item.name}</div>
                  <div className="text-xs" style={{ color: "var(--ink-dim)" }}>
                    {item.selectedPlanName ? `${item.selectedPlanName} - ${item.selectedDuration}` : item.duration}
                  </div>
                  <div className="text-xs" style={{ color: "var(--ink-dim)" }}>{item.qty}× {fmtIDR(item.effectivePrice)}</div>
                </div>
                <div className="font-bold text-sm">{fmtIDR(item.effectivePrice * item.qty)}</div>
              </div>
            ))}
          </div>
          <div className="border-t pt-5 mb-6" style={{ borderColor: "var(--line)" }}>
            <div className="text-xs mono uppercase mb-1" style={{ color: "var(--ink-dim)" }}>Total</div>
            <div className="serif" style={{ color: "var(--accent)", fontSize: "2.5rem", fontWeight: 600, lineHeight: 1 }}>{fmtIDR(total)}</div>
          </div>
          <button onClick={submit} disabled={submitting || !name || !email || !wa} className="w-full py-4 rounded-full font-semibold text-sm disabled:opacity-40 transition hover:scale-[1.02]" style={{ background: "var(--accent)", color: "white" }}>
            {submitting ? "Membuat booking..." : "Buat Booking Pesanan"}
          </button>
          <p className="text-[10px] mono uppercase mt-4 text-center" style={{ color: "var(--ink-dim)" }}>Pengiriman akun via WhatsApp setelah valid</p>
        </div>
      </div>
    </div>
  );
}

export function OrderSuccess({ order, onHome, onAdmin, onConfirmPayment }) {
  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="serif text-3xl serif-italic mb-4" style={{ color: "var(--ink-dim)" }}>order tidak ditemukan...</div>
        <button onClick={onHome} className="px-6 py-3 rounded-full font-semibold text-sm" style={{ background: "var(--ink)", color: "var(--bg)" }}>Kembali ke beranda</button>
      </div>
    );
  }

  const whatsappUrl = getWhatsAppConfirmationUrl(order);
  const payment = getPaymentDetail(order.buyer.method);
  const invoiceText = createInvoiceText(order, payment);
  const invoiceHref = createTextDownloadHref(invoiceText);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="paper-card p-8 lg:p-10 relative overflow-hidden grain receipt-rise">
        <div className="text-xs mono uppercase tracking-widest mb-3 flex items-center gap-3" style={{ color: "var(--accent)" }}>
          <span className="w-8 h-px" style={{ background: "var(--accent)" }}></span>
          Booking berhasil dibuat
        </div>
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <h1 className="serif leading-none mb-4" style={{ fontSize: "clamp(3rem, 6vw, 5rem)", fontWeight: 500 }}>
              Pesanan <span className="serif-italic">menunggu pembayaran.</span>
            </h1>
            <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--ink-dim)" }}>
              Silakan lakukan pembayaran sesuai metode yang kamu pilih, lalu klik tombol WhatsApp untuk kirim bukti transfer. Admin akan cek pembayaran dan mengirim akun ke WhatsApp pembeli.
            </p>

            <div className="grid sm:grid-cols-3 gap-3 mb-8">
              <StepCard number="1" title="Bayar" body={`Transfer via ${order.buyer.method}`} />
              <StepCard number="2" title="Konfirmasi" body="Kirim bukti ke WhatsApp admin" />
              <StepCard number="3" title="Dikirim" body="Akun dikirim setelah valid" />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a href={whatsappUrl} target="_blank" rel="noreferrer" onClick={onConfirmPayment} className="flex-1 py-4 rounded-full font-semibold text-sm text-center transition hover:scale-[1.02]" style={{ background: "var(--accent)", color: "white" }}>
                Konfirmasi Pembayaran via WhatsApp
              </a>
              <button onClick={onHome} className="flex-1 py-4 rounded-full border font-semibold text-sm" style={{ borderColor: "var(--line-2)" }}>
                Kembali Belanja
              </button>
            </div>
            <a
              href={invoiceHref}
              download={`invoice-${order.id}.txt`}
              className="mt-3 w-full py-4 rounded-full border font-semibold text-sm flex items-center justify-center gap-2"
              style={{ borderColor: "var(--line-2)" }}
            >
              <Download className="w-4 h-4" /> Download Invoice
            </a>
            <WhatsAppProofNotice whatsappUrl={whatsappUrl} onConfirmPayment={onConfirmPayment} />
            {onAdmin && (
              <button onClick={onAdmin} className="mt-4 text-xs mono uppercase tracking-widest underline-link" style={{ color: "var(--ink-dim)" }}>
                Admin? cek pesanan ini
              </button>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="ink-card rounded-[2rem] p-7">
              <div className="text-[10px] mono uppercase tracking-widest opacity-60 mb-2">Order ID</div>
              <div className="serif text-3xl mb-6" style={{ fontWeight: 600 }}>{order.id}</div>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between gap-4"><span className="opacity-60">Nama</span><span className="text-right">{order.buyer.name}</span></div>
                <div className="flex justify-between gap-4"><span className="opacity-60">WhatsApp</span><span className="text-right">{order.buyer.wa}</span></div>
                <div className="flex justify-between gap-4"><span className="opacity-60">Metode</span><span className="text-right">{order.buyer.method}</span></div>
                <div className="flex justify-between gap-4"><span className="opacity-60">Status</span><span className="text-right">{order.status}</span></div>
              </div>
              <div className="border-t pt-5 mb-5" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between gap-4 text-sm mb-2">
                    <span>{item.qty}x {item.name}{item.plan ? ` - ${item.plan} (${item.duration})` : ""}</span>
                    <span className="mono opacity-70">{fmtIDR(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-5 mb-5" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
                <div className="text-[10px] mono uppercase tracking-widest opacity-60 mb-3">Detail Pembayaran</div>
                <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div className="text-xs opacity-70 mb-3">{payment.instruction}</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="opacity-60">Metode</span>
                      <span className="text-right font-semibold">{payment.label}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="opacity-60">Atas Nama</span>
                      <span className="text-right font-semibold">{payment.accountName}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="opacity-60">Tujuan</span>
                      <span className="text-right mono">{payment.accountNumber}</span>
                    </div>
                  </div>
                  {payment.image && (
                    <div className="mt-4">
                      <div className="rounded-2xl overflow-hidden bg-white p-2">
                        <img src={payment.image} alt="QRIS Palugada" className="w-full rounded-xl" />
                      </div>
                      <a
                        href={payment.image}
                        download="qris-palugada.jpeg"
                        className="mt-3 w-full py-3 rounded-full font-semibold text-xs flex items-center justify-center gap-2"
                        style={{ background: "rgba(255,255,255,0.1)", color: "var(--bg)" }}
                      >
                        <Download className="w-4 h-4" /> Download QRIS
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <div className="border-t pt-5" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
                <div className="text-[10px] mono uppercase tracking-widest opacity-60 mb-1">Total Bayar</div>
                <div className="serif" style={{ color: "var(--gold)", fontSize: "2.5rem", fontWeight: 600, lineHeight: 1 }}>{fmtIDR(order.total)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WhatsAppProofNotice({ whatsappUrl, onConfirmPayment }) {
  return (
    <div className="mt-3 rounded-2xl border p-4" style={{ borderColor: "var(--line)", background: "var(--bg-3)" }}>
      <div className="text-[10px] mono uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>Bukti Pembayaran</div>
      <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--ink-dim)" }}>
        Kirim screenshot bukti transfer lewat WhatsApp admin. Setelah tombol diklik, status pesanan akan berubah menjadi Menunggu Verifikasi.
      </p>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        onClick={onConfirmPayment}
        className="inline-flex px-4 py-2 rounded-full text-xs font-semibold"
        style={{ background: "var(--accent)", color: "white" }}
      >
        Kirim Bukti via WhatsApp
      </a>
    </div>
  );
}

function StepCard({ number, title, body }) {
  return (
    <div className="rounded-2xl border p-4" style={{ borderColor: "var(--line)", background: "var(--bg-3)" }}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center serif text-sm mb-3" style={{ background: "var(--ink)", color: "var(--bg)" }}>{number}</div>
      <div className="serif text-xl leading-none mb-2" style={{ fontWeight: 500 }}>{title}</div>
      <div className="text-xs leading-relaxed" style={{ color: "var(--ink-dim)" }}>{body}</div>
    </div>
  );
}

function createTextDownloadHref(text) {
  return `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`;
}

function createInvoiceText(order, payment) {
  const items = order.items
    .map((item) => {
      const variant = item.plan ? ` - ${item.plan} (${item.duration})` : "";
      return `${item.qty}x ${item.name}${variant} = ${fmtIDR(item.price * item.qty)}`;
    })
    .join("\n");

  return [
    "PALUGADA STORE",
    "INVOICE / BOOKING PESANAN",
    "",
    `Order ID      : ${order.id}`,
    `Tanggal       : ${new Date(order.createdAt).toLocaleString("id-ID")}`,
    `Status        : ${order.status}`,
    "",
    "DATA PEMBELI",
    `Nama          : ${order.buyer.name}`,
    `Email         : ${order.buyer.email}`,
    `WhatsApp      : ${order.buyer.wa}`,
    "",
    "PRODUK",
    items,
    "",
    "PEMBAYARAN",
    `Metode        : ${payment.label}`,
    `Atas Nama     : ${payment.accountName}`,
    `Tujuan        : ${payment.accountNumber}`,
    `Total Bayar   : ${fmtIDR(order.total)}`,
    "",
    "Catatan:",
    "Akun dikirim admin via WhatsApp setelah pembayaran diverifikasi.",
    "Simpan invoice ini sebagai bukti booking pesanan.",
  ].join("\n");
}
