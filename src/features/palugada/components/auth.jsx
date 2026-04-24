import { useState } from "react";
import { ArrowLeft, Crown, Eye, EyeOff, Lock } from "lucide-react";
import { ADMIN_WHATSAPP_NUMBER, RESELLER_TIERS, fmtIDR } from "../constants";
import { Field } from "./shared";

const RESELLER_FEE = 50000;

function getResellerJoinUrl() {
  const message = [
    "Halo admin Palugada, saya ingin daftar reseller.",
    "",
    `Biaya pendaftaran reseller: ${fmtIDR(RESELLER_FEE)}`,
    "Saya siap bayar dan minta akun reseller diaktifkan.",
  ].join("\n");

  return `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function ResellerLogin({ onBack, onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  const submit = async () => {
    try {
      const result = await onLogin(email, pass);
      if (result?.error) {
        setErr(result.error);
      }
    } catch {
      setErr("Email atau password salah, atau akun reseller belum diaktifkan admin");
    }
  };

  return (
    <AuthLayout
      onBack={onBack}
      title="Masuk"
      subtitle="Masuk dengan akun reseller yang sudah diaktifkan admin"
      badge="Reseller Portal"
    >
      <div className="space-y-4">
        <div
          className="rounded-3xl border p-4 text-sm leading-relaxed"
          style={{ borderColor: "var(--line)", background: "var(--bg-3)", color: "var(--ink-dim)" }}
        >
          Akun reseller tidak bisa dibuat langsung dari website. Bayar pendaftaran dulu ke admin sebesar{" "}
          <strong style={{ color: "var(--accent)" }}>{fmtIDR(RESELLER_FEE)}</strong>, lalu akun akan diaktifkan manual.
        </div>
        <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="kamu@email.com" />
        <Field label="Password" value={pass} onChange={setPass} type="password" placeholder="********" />
        {err && (
          <div className="text-xs" style={{ color: "var(--accent)" }}>
            {err}
          </div>
        )}
        <button
          onClick={submit}
          className="w-full py-4 rounded-full font-semibold text-sm hover:scale-[1.02] transition"
          style={{ background: "var(--accent)", color: "white" }}
        >
          Masuk {"->"}
        </button>
        <a
          href={getResellerJoinUrl()}
          target="_blank"
          rel="noreferrer"
          className="block w-full text-center py-4 rounded-full font-semibold text-sm border"
          style={{ borderColor: "var(--line)", color: "var(--ink)" }}
        >
          Bayar daftar reseller {fmtIDR(RESELLER_FEE)}
        </a>
        <button onClick={onRegister} className="w-full text-sm underline-link" style={{ color: "var(--ink-dim)" }}>
          Belum punya akun reseller? Hubungi admin {"->"}
        </button>
      </div>
    </AuthLayout>
  );
}

export function ResellerRegister({ onBack, onLogin }) {
  return (
    <AuthLayout
      onBack={onBack}
      title="Reseller"
      subtitle="Pendaftaran reseller dilakukan manual setelah pembayaran diverifikasi admin"
      badge="Reseller Program"
    >
      <div className="space-y-4">
        <div className="ink-card rounded-xl p-4 grid grid-cols-3 gap-3 text-center">
          {Object.entries(RESELLER_TIERS).map(([name, tier]) => (
            <div key={name}>
              <Crown className="w-4 h-4 mx-auto mb-1" style={{ color: tier.color }} />
              <div className="text-[10px] mono uppercase">{name}</div>
              <div className="text-sm font-bold">-{Math.round(tier.discount * 100)}%</div>
            </div>
          ))}
        </div>
        <div className="rounded-3xl border p-5 space-y-4" style={{ borderColor: "var(--line)", background: "var(--bg-3)" }}>
          <div>
            <div className="text-[10px] mono uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>
              Biaya Aktivasi
            </div>
            <div className="serif text-4xl leading-none" style={{ fontWeight: 600 }}>
              {fmtIDR(RESELLER_FEE)}
            </div>
          </div>
          <div className="space-y-2 text-sm leading-relaxed" style={{ color: "var(--ink-dim)" }}>
            <div>1. Hubungi admin dan lakukan pembayaran pendaftaran reseller.</div>
            <div>2. Setelah pembayaran diverifikasi, admin akan membuat atau mengaktifkan akun reseller kamu.</div>
            <div>3. Setelah akun aktif, baru kamu bisa login dari halaman reseller.</div>
          </div>
          <div
            className="rounded-2xl border p-4 text-xs leading-relaxed"
            style={{ borderColor: "var(--line)", background: "rgba(255,255,255,0.7)", color: "var(--ink-dim)" }}
          >
            Login Google dan daftar instan dinonaktifkan supaya akun reseller tidak bisa bypass approval admin.
          </div>
        </div>
        <a
          href={getResellerJoinUrl()}
          target="_blank"
          rel="noreferrer"
          className="block w-full text-center py-4 rounded-full font-semibold text-sm"
          style={{ background: "var(--accent)", color: "white" }}
        >
          Bayar & Hubungi Admin via WhatsApp
        </a>
        <div className="text-xs text-center" style={{ color: "var(--ink-dim)" }}>
          Sudah bayar dan akun sudah dibuat admin?
        </div>
        <button onClick={onLogin} className="w-full text-sm underline-link" style={{ color: "var(--ink-dim)" }}>
          Sudah punya akun? Masuk {"->"}
        </button>
      </div>
    </AuthLayout>
  );
}

export function AuthLayout({ children, onBack, title, subtitle, badge }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16 grain relative">
      <div className="w-full max-w-md">
        <button onClick={onBack} className="flex items-center gap-2 text-sm mb-8" style={{ color: "var(--ink-dim)" }}>
          <ArrowLeft className="w-4 h-4" /> Kembali ke beranda
        </button>
        <div className="paper-card p-8 lg:p-10 relative">
          <div className="text-[10px] mono uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: "var(--accent)" }}>
            <Crown className="w-3 h-3" /> {badge}
          </div>
          <h1 className="serif leading-none mb-2" style={{ fontSize: "3.5rem", fontWeight: 500 }}>
            {title}
            <span className="serif-italic">.</span>
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--ink-dim)" }}>
            {subtitle}
          </p>
          {children}
        </div>
      </div>
    </div>
  );
}

export function AdminLogin({ onBack, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || !password) {
      setErr("Email dan password wajib diisi");
      return;
    }

    setErr("");
    setLoading(true);

    try {
      const result = await onLogin(email, password);
      if (result?.error) {
        setErr(result.error);
      }
    } catch {
      setErr("Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 grain">
      <div className="w-full max-w-md">
        <button onClick={onBack} className="flex items-center gap-2 text-sm mb-8" style={{ color: "var(--ink-dim)" }}>
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
        <div className="paper-card p-10">
          <div className="text-[10px] mono uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: "var(--accent)" }}>
            <Lock className="w-3 h-3" /> Admin Console
          </div>
          <h1 className="serif text-5xl mb-2" style={{ fontWeight: 500 }}>
            Masuk
            <span className="serif-italic">.</span>
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--ink-dim)" }}>
            Akses panel administrator
          </p>

          <div className="space-y-4">
            <Field label="Email Admin" value={email} onChange={setEmail} type="email" placeholder="admin@email.com" />
            <div>
              <label className="text-[10px] mono uppercase tracking-widest block mb-1.5" style={{ color: "var(--ink-dim)" }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && submit()}
                  className="w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:border-zinc-800 pr-12"
                  style={{ borderColor: "var(--line)" }}
                />
                <button onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--ink-dim)" }}>
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {err && (
              <div className="text-xs" style={{ color: "var(--accent)" }}>
                {err}
              </div>
            )}
            <button
              onClick={submit}
              disabled={loading}
              className="w-full py-4 rounded-full font-semibold text-sm hover:scale-[1.02] transition disabled:opacity-50"
              style={{ background: "var(--ink)", color: "var(--bg)" }}
            >
              {loading ? "Memeriksa..." : "Masuk ->"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
