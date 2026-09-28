import { useState } from "react";
import { Award, ArrowLeft, Crown, LogOut, Receipt, TrendingUp, Wallet } from "lucide-react";
import { RESELLER_TIERS, fmtCurrency, fmtIDR } from "../constants";
import { useI18n } from "../lib/i18n";

export function ResellerDashboard({ reseller, resellerTiers = RESELLER_TIERS, orders, onBack, onLogout }) {
  const { t, isJapanese, locale, catalogText } = useI18n();
  const tierMap = resellerTiers || RESELLER_TIERS;
  const tier = tierMap[reseller.tier] || tierMap.Bronze || RESELLER_TIERS.Bronze;
  const nextTier = reseller.tier === "Bronze" ? tierMap.Silver : reseller.tier === "Silver" ? tierMap.Gold : null;
  const nextName = reseller.tier === "Bronze" ? "Silver" : reseller.tier === "Silver" ? "Gold" : null;
  const progress = nextTier ? Math.min(100, (reseller.totalSpent / nextTier.min) * 100) : 100;
  const totalProfit = orders.reduce((sum, order) => sum + (order.profit || 0), 0);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);
    await new Promise((resolve) => setTimeout(resolve, 260));

    try {
      await onLogout();
    } catch {
      setLoggingOut(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="motion-back-button flex items-center gap-2 text-sm" style={{ color: "var(--ink-dim)" }}>
          <ArrowLeft className="w-4 h-4" /> {isJapanese ? "ホーム" : "Beranda"}
        </button>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          aria-busy={loggingOut}
          className={`motion-logout-button flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${loggingOut ? "is-leaving" : ""}`}
          style={{ color: "var(--ink-dim)" }}
        >
          <LogOut className="w-4 h-4" /> {isJapanese ? (loggingOut ? "ログアウト中…" : "ログアウト") : (loggingOut ? "Keluar..." : "Keluar")}
        </button>
      </div>

      <div className="text-xs mono uppercase tracking-widest mb-3 flex items-center gap-3" style={{ color: "var(--accent)" }}>
        <span className="w-8 h-px" style={{ background: "var(--accent)" }}></span>
        {isJapanese ? "リセラー管理画面" : "Reseller Dashboard"}
      </div>
      <h1 className="serif leading-none mb-2" style={{ fontSize: "clamp(3rem, 6vw, 5rem)", fontWeight: 500 }}>
        {isJapanese ? "こんにちは、" : "Halo, "}<span className="serif-italic">{reseller.name.split(" ")[0]}.</span>
      </h1>
      <p className="mb-12" style={{ color: "var(--ink-dim)" }}>{isJapanese ? "PaluGadaのリセラーページへようこそ。" : "Selamat datang kembali di portal reseller Palugada"}</p>

      <div className="ink-card rounded-3xl p-8 lg:p-10 mb-8 relative overflow-hidden grain">
        <div className="grid lg:grid-cols-2 gap-8 items-center relative">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-8 h-8" style={{ color: tier.color }} />
              <div>
                <div className="text-[10px] mono uppercase tracking-widest opacity-60">{isJapanese ? "現在のランク" : "Tier saat ini"}</div>
                <div className="serif text-4xl" style={{ fontWeight: 500, color: tier.color }}>{t(reseller.tier)}</div>
              </div>
            </div>
            <div className="serif text-2xl serif-italic mb-2">{isJapanese ? `すべての商品が${Math.round(tier.discount * 100)}%オフ` : `Diskon ${Math.round(tier.discount * 100)}% untuk semua produk`}</div>
            <div className="text-sm opacity-70">{isJapanese ? "リセラーID" : "ID Reseller"}: <span className="mono">{reseller.id}</span></div>
          </div>
          <div>
            {nextTier ? (
              <>
                <div className="flex justify-between text-xs mb-2">
                  <span className="opacity-70">{isJapanese ? `${t(nextName)}まで` : `Progress ke ${nextName}`}</span>
                  <span className="mono">{fmtIDR(reseller.totalSpent)} / {fmtIDR(nextTier.min)}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden mb-3" style={{ background: "rgba(255,255,255,0.1)" }}>
                  <div className="h-full transition-all" style={{ width: `${progress}%`, background: nextTier.color }}></div>
                </div>
                <div className="text-xs opacity-60">
                  {isJapanese ? <>あと<strong>{fmtIDR(Math.max(0, nextTier.min - reseller.totalSpent))}</strong>の購入で{t(nextName)}に昇格し、割引率が{Math.round(nextTier.discount * 100)}%になります。</> : <>Belanja <strong>{fmtIDR(Math.max(0, nextTier.min - reseller.totalSpent))}</strong> lagi untuk naik ke {nextName} dan dapatkan diskon {Math.round(nextTier.discount * 100)}%</>}
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <Award className="w-10 h-10 mx-auto mb-2" style={{ color: tier.color }} />
                <div className="serif text-2xl serif-italic">{isJapanese ? "最高ランクに到達しました！" : "Tier tertinggi tercapai!"}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <ResellerStat label={isJapanese ? "注文数" : "Total Pesanan"} value={reseller.totalOrders || 0} icon={Receipt} />
        <ResellerStat label={isJapanese ? "累計購入額" : "Total Belanja"} value={fmtIDR(reseller.totalSpent || 0)} icon={Wallet} />
        <ResellerStat label={isJapanese ? "累計割引額" : "Total Hemat"} value={fmtIDR(totalProfit)} icon={TrendingUp} accent />
      </div>

      <div className="paper-card p-7">
        <div className="flex items-center justify-between mb-5">
          <div className="text-xs mono uppercase tracking-widest" style={{ color: "var(--accent)" }}>{isJapanese ? "注文履歴" : "Riwayat Pesanan"}</div>
          <div className="text-xs mono" style={{ color: "var(--ink-dim)" }}>{isJapanese ? `全${orders.length}件` : `${orders.length} total`}</div>
        </div>
        {orders.length === 0 ? (
          <div className="text-center py-12 serif text-2xl serif-italic" style={{ color: "var(--ink-dim)" }}>{isJapanese ? "注文はまだありません…" : "Belum ada pesanan…"}</div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-4 border-b last:border-0" style={{ borderColor: "var(--line)" }}>
                <div>
                  <div className="mono text-xs" style={{ color: "var(--accent)" }}>{order.id}</div>
                  <div className="text-sm font-medium mt-1">
                    {order.items.map((item) => `${item.name}${item.plan ? ` - ${catalogText(item.plan)} (${catalogText(item.duration)})` : ""}`).join(", ")}
                  </div>
                  <div className="text-[10px] mono mt-0.5" style={{ color: "var(--ink-dim)" }}>{new Date(order.createdAt).toLocaleString(locale === "jp" ? "ja-JP" : "id-ID")}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold" style={{ color: "var(--accent)" }}>{fmtCurrency(order.total, order.currency || "IDR")}</div>
                  <div className="text-[10px] mono mt-0.5" style={{ color: "var(--ink-dim)" }}>{t(order.status)}</div>
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
