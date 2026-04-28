import { Award, ArrowLeft, Crown, LogOut, Receipt, TrendingUp, Wallet } from "lucide-react";
import { RESELLER_TIERS, fmtIDR } from "../constants";

export function ResellerDashboard({ reseller, resellerTiers = RESELLER_TIERS, orders, onBack, onLogout }) {
  const tierMap = resellerTiers || RESELLER_TIERS;
  const tier = tierMap[reseller.tier] || tierMap.Bronze || RESELLER_TIERS.Bronze;
  const nextTier = reseller.tier === "Bronze" ? tierMap.Silver : reseller.tier === "Silver" ? tierMap.Gold : null;
  const nextName = reseller.tier === "Bronze" ? "Silver" : reseller.tier === "Silver" ? "Gold" : null;
  const progress = nextTier ? Math.min(100, (reseller.totalSpent / nextTier.min) * 100) : 100;
  const totalProfit = orders.reduce((sum, order) => sum + (order.profit || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-sm" style={{ color: "var(--ink-dim)" }}>
          <ArrowLeft className="w-4 h-4" /> Beranda
        </button>
        <button onClick={onLogout} className="flex items-center gap-2 text-sm hover:text-red-500 transition" style={{ color: "var(--ink-dim)" }}>
          <LogOut className="w-4 h-4" /> Keluar
        </button>
      </div>

      <div className="text-xs mono uppercase tracking-widest mb-3 flex items-center gap-3" style={{ color: "var(--accent)" }}>
        <span className="w-8 h-px" style={{ background: "var(--accent)" }}></span>
        Reseller Dashboard
      </div>
      <h1 className="serif leading-none mb-2" style={{ fontSize: "clamp(3rem, 6vw, 5rem)", fontWeight: 500 }}>
        Halo, <span className="serif-italic">{reseller.name.split(" ")[0]}.</span>
      </h1>
      <p className="mb-12" style={{ color: "var(--ink-dim)" }}>Selamat datang kembali di portal reseller Palugada</p>

      <div className="ink-card rounded-3xl p-8 lg:p-10 mb-8 relative overflow-hidden grain">
        <div className="grid lg:grid-cols-2 gap-8 items-center relative">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-8 h-8" style={{ color: tier.color }} />
              <div>
                <div className="text-[10px] mono uppercase tracking-widest opacity-60">Tier saat ini</div>
                <div className="serif text-4xl" style={{ fontWeight: 500, color: tier.color }}>{reseller.tier}</div>
              </div>
            </div>
            <div className="serif text-2xl serif-italic mb-2">Diskon {Math.round(tier.discount * 100)}% untuk semua produk</div>
            <div className="text-sm opacity-70">ID Reseller: <span className="mono">{reseller.id}</span></div>
          </div>
          <div>
            {nextTier ? (
              <>
                <div className="flex justify-between text-xs mb-2">
                  <span className="opacity-70">Progress ke {nextName}</span>
                  <span className="mono">{fmtIDR(reseller.totalSpent)} / {fmtIDR(nextTier.min)}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden mb-3" style={{ background: "rgba(255,255,255,0.1)" }}>
                  <div className="h-full transition-all" style={{ width: `${progress}%`, background: nextTier.color }}></div>
                </div>
                <div className="text-xs opacity-60">
                  Belanja <strong>{fmtIDR(Math.max(0, nextTier.min - reseller.totalSpent))}</strong> lagi untuk naik ke {nextName} dan dapatkan diskon {Math.round(nextTier.discount * 100)}%
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <Award className="w-10 h-10 mx-auto mb-2" style={{ color: tier.color }} />
                <div className="serif text-2xl serif-italic">Tier tertinggi tercapai!</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <ResellerStat label="Total Pesanan" value={reseller.totalOrders || 0} icon={Receipt} />
        <ResellerStat label="Total Belanja" value={fmtIDR(reseller.totalSpent || 0)} icon={Wallet} />
        <ResellerStat label="Total Hemat" value={fmtIDR(totalProfit)} icon={TrendingUp} accent />
      </div>

      <div className="paper-card p-7">
        <div className="flex items-center justify-between mb-5">
          <div className="text-xs mono uppercase tracking-widest" style={{ color: "var(--accent)" }}>Riwayat Pesanan</div>
          <div className="text-xs mono" style={{ color: "var(--ink-dim)" }}>{orders.length} total</div>
        </div>
        {orders.length === 0 ? (
          <div className="text-center py-12 serif text-2xl serif-italic" style={{ color: "var(--ink-dim)" }}>Belum ada pesanan…</div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-4 border-b last:border-0" style={{ borderColor: "var(--line)" }}>
                <div>
                  <div className="mono text-xs" style={{ color: "var(--accent)" }}>{order.id}</div>
                  <div className="text-sm font-medium mt-1">
                    {order.items.map((item) => `${item.name}${item.plan ? ` - ${item.plan} (${item.duration})` : ""}`).join(", ")}
                  </div>
                  <div className="text-[10px] mono mt-0.5" style={{ color: "var(--ink-dim)" }}>{new Date(order.createdAt).toLocaleString("id-ID")}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold" style={{ color: "var(--accent)" }}>{fmtIDR(order.total)}</div>
                  <div className="text-[10px] mono mt-0.5" style={{ color: "var(--ink-dim)" }}>{order.status}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ResellerStat({ label, value, icon, accent }) {
  const Icon = icon;
  return (
    <div className="paper-card p-6" style={{ background: accent ? "var(--accent)" : undefined, color: accent ? "white" : undefined }}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10px] mono uppercase tracking-widest" style={{ color: accent ? "rgba(255,255,255,0.7)" : "var(--ink-dim)" }}>{label}</div>
        <Icon className="w-4 h-4" />
      </div>
      <div className="serif text-3xl" style={{ fontWeight: 600 }}>{value}</div>
    </div>
  );
}
