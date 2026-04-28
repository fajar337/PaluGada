import { useRef } from "react";
import { AtSign, Crown, Lock, Mail, MessageCircle, PackageSearch, ShoppingCart, Users } from "lucide-react";
import { ADMIN_WHATSAPP_NUMBER, CONTACT_EMAIL, INSTAGRAM_URL, RESELLER_TIERS } from "../constants";

export function StyleBlock() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300..800&family=Manrope:wght@300;400;500;600;700;800&family=Newsreader:ital,opsz,wght@1,6..72,300..700&family=JetBrains+Mono:wght@400;500;600&display=swap');
      :root {
        --bg: #ede7d6;
        --bg-2: #f8f5ec;
        --bg-3: #e1dac4;
        --ink: #15110d;
        --ink-dim: #6b6660;
        --line: #cdc5af;
        --line-2: #15110d;
        --accent: #7a4b2a;
        --accent-2: #15110d;
        --gold: #a67c52;
        --paper: #faf7f0;
      }
      * { font-family: 'Manrope', sans-serif; box-sizing: border-box; }
      html { overflow-x: hidden; -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
      body { background: var(--bg); overflow-x: hidden; min-width: 320px; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
      button, a, input, textarea, select { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
      .serif { font-family: 'Bricolage Grotesque', sans-serif; font-optical-sizing: auto; letter-spacing: -0.025em; }
      .serif-italic { font-family: 'Newsreader', serif; font-style: italic; font-optical-sizing: auto; letter-spacing: -0.01em; }
      .mono { font-family: 'JetBrains Mono', monospace; }

      .grain::before {
        content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0.06; mix-blend-mode: multiply;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      }
      .paper-card { background: var(--bg-2); border: 1px solid var(--line); }
      .ink-card { background: var(--ink); color: var(--bg); }

      .scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
      .scrollbar::-webkit-scrollbar-thumb { background: var(--line); border-radius: 3px; }

      input, textarea, select { font-family: 'Plus Jakarta Sans', sans-serif; color: var(--ink); font-size: 16px; }
      input::placeholder { color: var(--ink-dim); opacity: 0.6; }

      @keyframes slidein { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      .slidein { animation: slidein 0.5s ease-out backwards; }
      @keyframes zoomin { from { opacity: 0; transform: scale(0.92) translateY(14px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      .zoomin { animation: zoomin 0.22s cubic-bezier(.2,.8,.2,1) both; }
      @keyframes toastpop { 0% { opacity: 0; transform: translate(-50%, 18px) scale(0.96); } 70% { transform: translate(-50%, -3px) scale(1.02); } 100% { opacity: 1; transform: translate(-50%, 0) scale(1); } }
      .toast-pop { animation: toastpop 0.32s cubic-bezier(.2,.8,.2,1) both; }
      @keyframes cartbounce { 0%,100% { transform: scale(1); } 35% { transform: scale(1.16) rotate(-4deg); } 70% { transform: scale(0.96) rotate(2deg); } }
      .cart-bounce { animation: cartbounce 0.45s cubic-bezier(.2,.8,.2,1); }
      @keyframes receiptRise { from { opacity: 0; transform: translateY(28px) rotate(-1deg); } to { opacity: 1; transform: translateY(0) rotate(0); } }
      .receipt-rise { animation: receiptRise 0.55s cubic-bezier(.2,.8,.2,1) both; }
      @keyframes starpop { 0% { transform: scale(0.75) rotate(-8deg); } 70% { transform: scale(1.22) rotate(4deg); } 100% { transform: scale(1) rotate(0); } }
      .star-pop { animation: starpop 0.22s cubic-bezier(.2,.8,.2,1); }
      @keyframes float { 0%,100% { transform: translateY(0) rotate(var(--r,0deg)); } 50% { transform: translateY(-10px) rotate(var(--r,0deg)); } }
      .float { animation: float 6s ease-in-out infinite; }
      @keyframes filterFade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      .filter-fade { animation: filterFade 0.28s ease-out both; }

      .marquee { display: flex; gap: 3rem; animation: marquee 30s linear infinite; }
      @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

      .underline-link { background-image: linear-gradient(var(--accent), var(--accent)); background-size: 100% 1px; background-repeat: no-repeat; background-position: 0 100%; }

      .hover-lift { transition: transform 0.3s cubic-bezier(.2,.8,.2,1), box-shadow 0.3s; }
      .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 30px 60px -20px rgba(20,21,31,0.15); }

      .ticker-dot::before { content: "●"; color: var(--accent); margin-right: 0.5rem; }
      .safe-x { padding-left: max(1rem, env(safe-area-inset-left)); padding-right: max(1rem, env(safe-area-inset-right)); }
      .safe-y { padding-top: max(1rem, env(safe-area-inset-top)); padding-bottom: max(1rem, env(safe-area-inset-bottom)); }
      .ios-scroll { -webkit-overflow-scrolling: touch; overscroll-behavior: auto; }

      @supports (height: 100dvh) {
        .min-h-screen { min-height: 100dvh; }
      }

      @media (max-width: 640px) {
        .hover-lift:hover { transform: none; box-shadow: none; }
      }
    `}</style>
  );
}

export function Header({ promos = [], cartCount, cartPulse, reseller, onCart, onHome, onAdmin, onTrackOrder, onResellerLogin, onResellerDash }) {
  const brandTapTimeoutRef = useRef(null);
  const lastBrandTapRef = useRef(0);
  const activePromos = promos.filter((promo) => promo.active).map((promo) => promo.title?.trim()).filter(Boolean);
  const tickerItems = [
    ...activePromos,
    "Apa lu mau, gua ada",
    "Garansi penuh selama berlangganan",
    "Diskon hingga 80%",
    "Reseller program - diskon hingga 10%",
    "Pengiriman instan via WhatsApp",
    "Toko serba ada sejak 2024",
  ];

  const handleBrandTextTap = () => {
    const now = Date.now();
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (!isMobile) {
      onHome();
      return;
    }

    if (now - lastBrandTapRef.current < 320) {
      if (brandTapTimeoutRef.current) {
        clearTimeout(brandTapTimeoutRef.current);
      }
      brandTapTimeoutRef.current = null;
      lastBrandTapRef.current = 0;
      onAdmin();
      return;
    }

    lastBrandTapRef.current = now;
    brandTapTimeoutRef.current = setTimeout(() => {
      onHome();
      brandTapTimeoutRef.current = null;
    }, 320);
  };

  return (
    <>
      <div
        className="border-b overflow-hidden mono text-[11px] uppercase tracking-widest py-2"
        style={{ borderColor: "var(--line-2)", background: "var(--ink)", color: "var(--bg)" }}
      >
        <div className="marquee whitespace-nowrap">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="flex gap-12">
              {tickerItems.map((item) => (
                <span key={`${index}-${item}`} className="ticker-dot">{item}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <header
        className="sticky top-0 z-40 border-b backdrop-blur-xl"
        style={{ background: "rgba(245,241,234,0.85)", borderColor: "var(--line)" }}
      >
        <div className="max-w-7xl mx-auto safe-x py-4 sm:py-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="relative">
              <button
                onClick={onHome}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center border-2"
                style={{ background: "var(--bg)", borderColor: "var(--ink)" }}
              >
                <span className="serif text-xl leading-none" style={{ color: "var(--ink)", fontWeight: 800 }}>
                  PG
                </span>
              </button>
            </div>
            <button onClick={handleBrandTextTap} className="leading-none text-left min-w-0">
              <div className="serif text-xl sm:text-2xl tracking-tight uppercase" style={{ fontWeight: 800 }}>
                Palu<span style={{ color: "var(--accent)" }}>gada</span>
              </div>
              <div className="hidden min-[420px]:block text-[9px] mono uppercase tracking-[0.18em] mt-1.5" style={{ color: "var(--ink-dim)" }}>
                apa lu mau, gua ada
              </div>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {reseller ? (
              <button
                onClick={onResellerDash}
                className="sm:hidden flex items-center justify-center w-11 h-11 rounded-full border hover:bg-white transition"
                style={{ borderColor: "var(--line-2)" }}
                aria-label="Dashboard reseller"
                title="Dashboard reseller"
              >
                <Crown className="w-4 h-4" style={{ color: RESELLER_TIERS[reseller.tier]?.color }} />
              </button>
            ) : (
              <button
                onClick={onResellerLogin}
                className="sm:hidden flex items-center justify-center w-11 h-11 rounded-full border hover:bg-white transition"
                style={{ borderColor: "var(--line)" }}
                aria-label="Login reseller"
                title="Login reseller"
              >
                <Users className="w-4 h-4" />
              </button>
            )}
            {reseller ? (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={onResellerDash}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm border hover:bg-white transition"
                  style={{ borderColor: "var(--line-2)" }}
                >
                  <Crown className="w-4 h-4" style={{ color: RESELLER_TIERS[reseller.tier]?.color }} />
                  <span className="font-medium">{reseller.name.split(" ")[0]}</span>
                  <span className="text-[10px] mono uppercase opacity-60">{reseller.tier}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onResellerLogin}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-sm border hover:bg-white transition"
                style={{ borderColor: "var(--line)" }}
              >
                <Users className="w-4 h-4" /> Reseller
              </button>
            )}
            <button
              onClick={onTrackOrder}
              className="flex items-center gap-2 px-3 sm:px-4 py-3 sm:py-2 rounded-full text-sm border hover:bg-white transition"
              style={{ borderColor: "var(--line)" }}
            >
              <PackageSearch className="w-4 h-4" /> <span className="hidden lg:inline">Cek Order</span>
            </button>
            <button
              onClick={onAdmin}
              className="hidden md:flex items-center justify-center w-11 h-11 md:w-auto md:h-auto md:px-3 md:py-2 rounded-full text-sm hover:bg-white/60 transition border md:border-transparent"
              style={{ color: "var(--ink-dim)", borderColor: "var(--line)" }}
              aria-label="Admin"
              title="Admin"
            >
              <Lock className="w-4 h-4" />
            </button>
            <button
              onClick={onCart}
              className={`relative flex items-center gap-2 px-4 sm:px-5 py-3 sm:py-2.5 rounded-full text-sm font-semibold transition hover:scale-105 ${cartPulse ? "cart-bounce" : ""}`}
              style={{ background: "var(--ink)", color: "var(--bg)" }}
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden min-[380px]:inline">Cart</span>
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold"
                  style={{ background: "var(--accent)", color: "white" }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

export function Footer() {
  const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}`;
  const emailUrl = `mailto:${CONTACT_EMAIL}`;

  return (
    <footer
      className="mt-24 border-t"
      style={{ borderColor: "var(--line-2)", background: "var(--ink)", color: "var(--bg)" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-12 gap-10 mb-12">
          <div className="lg:col-span-5">
            <div className="serif text-6xl mb-4 leading-none uppercase" style={{ fontWeight: 800 }}>
              Palu<span style={{ color: "var(--accent)" }}>gada</span>
            </div>
            <p className="text-sm max-w-sm leading-relaxed mb-3" style={{ color: "#a3a4b3" }}>
              Toko serba ada untuk aplikasi premium. Apa lu mau, gua ada — dari Netflix sampai ChatGPT,
              semuanya dengan harga ramah kantong.
            </p>
            <div className="text-[10px] mono uppercase tracking-widest" style={{ color: "var(--accent)" }}>
              "apa lu mau, gua ada"
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="text-[10px] mono uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>
              Toko
            </div>
            <ul className="space-y-2 text-sm">
              <li><a href="#katalog" className="hover:opacity-70 transition">Streaming</a></li>
              <li><a href="#katalog" className="hover:opacity-70 transition">AI Tools</a></li>
              <li><a href="#katalog" className="hover:opacity-70 transition">Editor</a></li>
              <li><a href="#katalog" className="hover:opacity-70 transition">Music</a></li>
            </ul>
          </div>
          <div className="lg:col-span-2">
            <div className="text-[10px] mono uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>
              Bantuan
            </div>
            <ul className="space-y-2 text-sm">
              <li><a href="#faq" className="hover:opacity-70 transition">FAQ</a></li>
              <li><a href="#garansi" className="hover:opacity-70 transition">Cara Garansi</a></li>
              <li><a href="#cara-order" className="hover:opacity-70 transition">Cara Order</a></li>
            </ul>
          </div>
          <div className="lg:col-span-3">
            <div className="text-[10px] mono uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>
              Kontak
            </div>
            <div className="flex items-center gap-3">
              <a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="WhatsApp Palugada" className="w-11 h-11 rounded-full border flex items-center justify-center hover:scale-105 transition" style={{ borderColor: "#2a2c3a", background: "rgba(255,255,255,0.04)" }}>
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram Palugada" className="w-11 h-11 rounded-full border flex items-center justify-center hover:scale-105 transition" style={{ borderColor: "#2a2c3a", background: "rgba(255,255,255,0.04)" }}>
                <AtSign className="w-5 h-5" />
              </a>
              <a href={emailUrl} aria-label="Email Palugada" className="w-11 h-11 rounded-full border flex items-center justify-center hover:scale-105 transition" style={{ borderColor: "#2a2c3a", background: "rgba(255,255,255,0.04)" }}>
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        <div
          className="border-t pt-6 flex flex-col sm:flex-row justify-between gap-3 text-[10px] mono uppercase tracking-widest"
          style={{ borderColor: "#2a2c3a", color: "#a3a4b3" }}
        >
          <div>© 2026 Palugada — Toko Serba Ada</div>
          <div>Crafted By Fajar Mustofa</div>
        </div>
      </div>
    </footer>
  );
}

export function FloatingWhatsApp() {
  const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent("Halo admin Palugada, saya mau tanya produk/apps premium.")}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      className="fixed right-4 bottom-5 z-40 rounded-full shadow-2xl float flex items-center gap-2 px-4 py-3 text-sm font-semibold"
      style={{ background: "#1f7a4d", color: "white", paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      aria-label="Chat WhatsApp Palugada"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="hidden sm:inline">Butuh bantuan?</span>
    </a>
  );
}

