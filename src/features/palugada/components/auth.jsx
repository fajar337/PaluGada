import { useState } from "react";
import { ArrowLeft, ArrowRight, Crown, Eye, EyeOff, Lock } from "lucide-react";
import { ADMIN_WHATSAPP_NUMBER, RESELLER_TIERS, fmtIDR } from "../constants";
import { useI18n } from "../lib/i18n";
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
  const { isJapanese } = useI18n();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (loading) {
      return;
    }

    setErr("");
    setLoading(true);

    try {
      const result = await onLogin(email, pass);
      if (result?.error) {
        setErr(result.error);
      }
    } catch {
      setErr(isJapanese ? "メールアドレスまたはパスワードが違うか、アカウントがまだ有効化されていません。" : "Email atau password salah, atau akun reseller belum diaktifkan admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      onBack={onBack}
      title={isJapanese ? "ログイン" : "Masuk"}
      subtitle={isJapanese ? "有効化済みのリセラーアカウントでログインしてください。" : "Masuk dengan akun reseller yang sudah diaktifkan admin"}
      badge={isJapanese ? "リセラーログイン" : "Reseller Portal"}
    >
      <div className="space-y-4">
        <div
          className="rounded-3xl border p-4 text-sm leading-relaxed"
          style={{ borderColor: "var(--line)", background: "var(--bg-3)", color: "var(--ink-dim)" }}
        >
          {isJapanese ? "リセラー登録は管理者が手動で行います。登録料 " : "Akun reseller tidak bisa dibuat langsung dari website. Bayar pendaftaran dulu ke admin sebesar "}
          <strong style={{ color: "var(--accent)" }}>{fmtIDR(RESELLER_FEE)}</strong>
          {isJapanese ? " をお支払い後、アカウントが有効化されます。" : ", lalu akun akan diaktifkan manual."}
        </div>
        <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="kamu@email.com" />
        <Field label={isJapanese ? "パスワード" : "Password"} value={pass} onChange={setPass} type="password" placeholder="********" />
        {err && (
          <div className="text-xs" style={{ color: "var(--accent)" }}>
            {err}
          </div>
        )}
        <button
          onClick={submit}
          disabled={loading}
          aria-busy={loading}
          className={`auth-submit-button w-full py-4 rounded-full font-semibold text-sm disabled:opacity-60 ${loading ? "is-checking" : ""}`}
          style={{ background: "var(--accent)", color: "white" }}
        >
          <span className="auth-submit-content">
            {loading ? <span className="auth-submit-spinner" aria-hidden="true" /> : null}
            <span>{loading ? (isJapanese ? "確認中…" : "Memeriksa...") : (isJapanese ? "ログイン" : "Masuk")}</span>
            {!loading ? <ArrowRight className="auth-submit-arrow w-4 h-4" aria-hidden="true" /> : null}
          </span>
        </button>
        <a
          href={getResellerJoinUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="reseller-motion-button block w-full text-center py-4 rounded-full font-semibold text-sm border"
          style={{ borderColor: "var(--line)", color: "var(--ink)" }}
        >
          {isJapanese ? `登録料 ${fmtIDR(RESELLER_FEE)} を支払う` : `Bayar daftar reseller ${fmtIDR(RESELLER_FEE)}`}
        </a>
        <button onClick={onRegister} className="reseller-admin-link w-full text-sm" style={{ color: "var(--ink-dim)" }}>
          {isJapanese ? "アカウントをお持ちでない方は管理者へご連絡ください" : "Belum punya akun reseller? Hubungi admin"} <span className="reseller-admin-arrow" aria-hidden="true">{"->"}</span>
        </button>
      </div>
    </AuthLayout>
  );
}

export function ResellerRegister({ onBack, onLogin }) {
  const { isJapanese } = useI18n();
  return (
    <AuthLayout
      onBack={onBack}
      title={isJapanese ? "リセラー登録" : "Reseller"}
      subtitle={isJapanese ? "お支払い確認後、管理者がアカウントを有効化します。" : "Pendaftaran reseller dilakukan manual setelah pembayaran diverifikasi admin"}
      badge={isJapanese ? "リセラープログラム" : "Reseller Program"}
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
              {isJapanese ? "登録料" : "Biaya Aktivasi"}
            </div>
            <div className="serif text-4xl leading-none" style={{ fontWeight: 600 }}>
              {fmtIDR(RESELLER_FEE)}
            </div>
          </div>
          <div className="space-y-2 text-sm leading-relaxed" style={{ color: "var(--ink-dim)" }}>
            <div>1. {isJapanese ? "管理者に連絡し、登録料をお支払いください。" : "Hubungi admin dan lakukan pembayaran pendaftaran reseller."}</div>
            <div>2. {isJapanese ? "入金確認後、管理者がアカウントを作成または有効化します。" : "Setelah pembayaran diverifikasi, admin akan membuat atau mengaktifkan akun reseller kamu."}</div>
            <div>3. {isJapanese ? "有効化されたら、リセラーページからログインできます。" : "Setelah akun aktif, baru kamu bisa login dari halaman reseller."}</div>
          </div>
          <div
            className="rounded-2xl border p-4 text-xs leading-relaxed"
            style={{ borderColor: "var(--line)", background: "rgba(255,255,255,0.7)", color: "var(--ink-dim)" }}
          >
            {isJapanese ? "リセラー登録には管理者の承認が必要です。Googleログインと即時登録には対応していません。" : "Login Google dan daftar instan dinonaktifkan supaya akun reseller tidak bisa bypass approval admin."}
          </div>
        </div>
        <a
          href={getResellerJoinUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-4 rounded-full font-semibold text-sm"
          style={{ background: "var(--accent)", color: "white" }}
        >
          {isJapanese ? "WhatsAppで管理者に連絡する" : "Bayar & Hubungi Admin via WhatsApp"}
        </a>
        <div className="text-xs text-center" style={{ color: "var(--ink-dim)" }}>
          {isJapanese ? "お支払い済みで、アカウントが有効化されていますか？" : "Sudah bayar dan akun sudah dibuat admin?"}
        </div>
        <button onClick={onLogin} className="w-full text-sm underline-link" style={{ color: "var(--ink-dim)" }}>
          {isJapanese ? "アカウントをお持ちの方はこちら" : "Sudah punya akun? Masuk"} {"->"}
        </button>
      </div>
    </AuthLayout>
  );
}

export function AuthLayout({ children, onBack, title, subtitle, badge }) {
  const { isJapanese } = useI18n();
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16 grain relative">
      <div className="w-full max-w-md">
        <button onClick={onBack} className="motion-back-button flex items-center gap-2 text-sm mb-8" style={{ color: "var(--ink-dim)" }}>
          <ArrowLeft className="w-4 h-4" /> {isJapanese ? "ホームへ戻る" : "Kembali ke beranda"}
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
        <button onClick={onBack} className="motion-back-button flex items-center gap-2 text-sm mb-8" style={{ color: "var(--ink-dim)" }}>
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
              <label htmlFor="admin-password" className="text-[10px] mono uppercase tracking-widest block mb-1.5" style={{ color: "var(--ink-dim)" }}>
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && submit()}
                  className="w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:border-zinc-800 pr-12"
                  style={{ borderColor: "var(--line)" }}
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--ink-dim)" }} aria-label={show ? "Sembunyikan password" : "Tampilkan password"}>
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
              aria-busy={loading}
              className={`auth-submit-button w-full py-4 rounded-full font-semibold text-sm disabled:opacity-60 ${loading ? "is-checking" : ""}`}
              style={{ background: "var(--ink)", color: "var(--bg)" }}
            >
              <span className="auth-submit-content">
                {loading ? <span className="auth-submit-spinner" aria-hidden="true" /> : null}
                <span>{loading ? "Memeriksa..." : "Masuk"}</span>
                {!loading ? <ArrowRight className="auth-submit-arrow w-4 h-4" aria-hidden="true" /> : null}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
