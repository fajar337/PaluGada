import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Crown, Eye, EyeOff, Lock } from "lucide-react";
import { RESELLER_TIERS } from "../constants";
import { Field } from "./shared";

export function ResellerLogin({ onBack, onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  const submit = () => {
    const result = onLogin(email, pass);
    if (result?.error) {
      setErr(result.error);
    }
  };

  return (
    <AuthLayout onBack={onBack} title="Masuk" subtitle="Lanjutkan sebagai reseller" badge="Reseller Portal">
      <div className="space-y-4">
        <GoogleAuthButton
          mode="signin"
          onSuccess={async (profile) => {
            setErr("");
            const result = await onLogin(null, null, profile);
            if (result?.error) {
              setErr(result.error);
            }
          }}
          onError={setErr}
        />
        <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="kamu@email.com" />
        <Field label="Password" value={pass} onChange={setPass} type="password" placeholder="••••••••" />
        {err && <div className="text-xs" style={{ color: "var(--accent)" }}>{err}</div>}
        <button onClick={submit} className="w-full py-4 rounded-full font-semibold text-sm hover:scale-[1.02] transition" style={{ background: "var(--accent)", color: "white" }}>
          Masuk →
        </button>
        <button onClick={onRegister} className="w-full text-sm underline-link" style={{ color: "var(--ink-dim)" }}>
          Belum punya akun? Daftar gratis →
        </button>
      </div>
    </AuthLayout>
  );
}

export function ResellerRegister({ onBack, onRegister, onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [wa, setWa] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name || !email || !wa || !pass) {
      setErr("Semua field wajib diisi");
      return;
    }

    setLoading(true);
    const result = await onRegister({ name, email, wa, password: pass });
    setLoading(false);

    if (result?.error) {
      setErr(result.error);
    }
  };

  return (
    <AuthLayout onBack={onBack} title="Daftar" subtitle="Bergabung sebagai reseller — gratis selamanya" badge="Reseller Program">
      <div className="space-y-4">
        <div className="ink-card rounded-xl p-4 grid grid-cols-3 gap-3 text-center">
          {Object.entries(RESELLER_TIERS).map(([name, tier]) => (
            <div key={name}>
              <Crown className="w-4 h-4 mx-auto mb-1" style={{ color: tier.color }} />
              <div className="text-[10px] mono uppercase">{name}</div>
              <div className="text-sm font-bold">−{Math.round(tier.discount * 100)}%</div>
            </div>
          ))}
        </div>
        <GoogleAuthButton
          mode="signup"
          onSuccess={async (profile) => {
            setErr("");
            const result = await onRegister({
              name: profile.name,
              email: profile.email,
              wa: "",
              password: null,
              googleSub: profile.sub,
              avatar: profile.picture || "",
            });
            if (result?.error) {
              setErr(result.error);
            }
          }}
          onError={setErr}
        />
        <Field label="Nama Lengkap" value={name} onChange={setName} placeholder="John Doe" />
        <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="kamu@email.com" />
        <Field label="WhatsApp" value={wa} onChange={setWa} placeholder="08xxxxxxxxxx" />
        <Field label="Password" value={pass} onChange={setPass} type="password" placeholder="••••••••" />
        {err && <div className="text-xs" style={{ color: "var(--accent)" }}>{err}</div>}
        <button onClick={submit} disabled={loading} className="w-full py-4 rounded-full font-semibold text-sm hover:scale-[1.02] transition disabled:opacity-50" style={{ background: "var(--accent)", color: "white" }}>
          {loading ? "Mendaftar…" : "Daftar Gratis →"}
        </button>
        <button onClick={onLogin} className="w-full text-sm underline-link" style={{ color: "var(--ink-dim)" }}>
          Sudah punya akun? Masuk →
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
            {title}<span className="serif-italic">.</span>
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--ink-dim)" }}>{subtitle}</p>
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
            Masuk<span className="serif-italic">.</span>
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--ink-dim)" }}>Akses panel administrator</p>

          <div className="space-y-4">
            <Field label="Email Admin" value={email} onChange={setEmail} type="email" placeholder="admin@email.com" />
            <div>
              <label className="text-[10px] mono uppercase tracking-widest block mb-1.5" style={{ color: "var(--ink-dim)" }}>Password</label>
              <div className="relative">
                <input type={show ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} onKeyDown={(event) => event.key === "Enter" && submit()} className="w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:border-zinc-800 pr-12" style={{ borderColor: "var(--line)" }} />
                <button onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--ink-dim)" }}>
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {err && <div className="text-xs" style={{ color: "var(--accent)" }}>{err}</div>}
            <button onClick={submit} disabled={loading} className="w-full py-4 rounded-full font-semibold text-sm hover:scale-[1.02] transition disabled:opacity-50" style={{ background: "var(--ink)", color: "var(--bg)" }}>
              {loading ? "Memeriksa..." : "Masuk →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleAuthButton({ mode, onSuccess, onError }) {
  const buttonRef = useRef(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    let cancelled = false;
    let script = document.querySelector('script[data-google-identity="true"]');

    const loadScript = () =>
      new Promise((resolve, reject) => {
        if (window.google?.accounts?.id) {
          resolve();
          return;
        }

        if (!script) {
          script = document.createElement("script");
          script.src = "https://accounts.google.com/gsi/client";
          script.async = true;
          script.defer = true;
          script.dataset.googleIdentity = "true";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Gagal memuat Google Identity Services"));
          document.head.appendChild(script);
          return;
        }

        script.addEventListener("load", resolve, { once: true });
        script.addEventListener(
          "error",
          () => reject(new Error("Gagal memuat Google Identity Services")),
          { once: true }
        );
      });

    const renderButton = async () => {
      if (!clientId || !buttonRef.current) {
        return;
      }

      try {
        await loadScript();
        if (cancelled || !window.google?.accounts?.id || !buttonRef.current) {
          return;
        }

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            try {
              const profile = parseGoogleCredential(response.credential);
              onSuccess(profile);
            } catch (error) {
              onError(error.message || "Login Google gagal diproses");
            }
          },
        });

        buttonRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          shape: "pill",
          text: mode === "signup" ? "signup_with" : "signin_with",
          width: 320,
        });
      } catch (error) {
        onError(error.message || "Gagal memuat tombol Google");
      }
    };

    renderButton();

    return () => {
      cancelled = true;
    };
  }, [clientId, mode, onError, onSuccess]);

  if (!clientId) {
    return (
      <div className="rounded-[1.5rem] border p-4" style={{ borderColor: "var(--line)", background: "var(--bg-3)" }}>
        <div className="text-[10px] mono uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>
          Google Access
        </div>
        <div className="text-xs leading-relaxed" style={{ color: "var(--ink-dim)" }}>
          Set `VITE_GOOGLE_CLIENT_ID` untuk mengaktifkan login Google.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        className="rounded-[1.75rem] border p-4 relative overflow-hidden"
        style={{ borderColor: "var(--line)", background: "linear-gradient(180deg, var(--bg-2), var(--bg-3))" }}
      >
        <div
          className="absolute inset-x-0 top-0 h-1"
          style={{ background: "linear-gradient(90deg, #4285F4 0%, #34A853 33%, #FBBC05 66%, #EA4335 100%)" }}
        ></div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="text-[10px] mono uppercase tracking-widest mb-1" style={{ color: "var(--accent)" }}>
              Google Access
            </div>
            <div className="serif text-2xl leading-none" style={{ fontWeight: 500 }}>
              {mode === "signup" ? "Daftar lebih cepat." : "Masuk lebih cepat."}
            </div>
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center border"
            style={{ borderColor: "var(--line)", background: "rgba(255,255,255,0.65)" }}
            aria-hidden="true"
          >
            <span className="mono text-sm" style={{ color: "var(--accent)" }}>G</span>
          </div>
        </div>
        <div className="text-xs mb-4 leading-relaxed" style={{ color: "var(--ink-dim)" }}>
          {mode === "signup"
            ? "Pakai akun Google untuk langsung membuat akun reseller."
            : "Pakai akun Google untuk masuk atau menghubungkan reseller yang sudah ada."}
        </div>
        <div className="rounded-full bg-white/80 p-2 border" style={{ borderColor: "var(--line)" }}>
          <div ref={buttonRef} className="flex justify-center min-h-[44px] items-center"></div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="h-px flex-1" style={{ background: "var(--line)" }}></span>
        <span className="text-[10px] mono uppercase tracking-widest" style={{ color: "var(--ink-dim)" }}>
          atau
        </span>
        <span className="h-px flex-1" style={{ background: "var(--line)" }}></span>
      </div>
    </div>
  );
}

function parseGoogleCredential(credential) {
  if (!credential) {
    throw new Error("Credential Google tidak tersedia");
  }

  const [, payload] = credential.split(".");
  if (!payload) {
    throw new Error("Credential Google tidak valid");
  }

  const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
  const decoded = decodeURIComponent(
    atob(normalized)
      .split("")
      .map((char) => "%" + char.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("")
  );

  const profile = JSON.parse(decoded);
  if (!profile.email || !profile.sub) {
    throw new Error("Profil Google tidak lengkap");
  }

  return profile;
}
