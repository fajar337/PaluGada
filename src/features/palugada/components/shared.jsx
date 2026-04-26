import { useState } from "react";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { ICONS } from "../constants";

export function ProductIcon({ icon, color, size = 48 }) {
  const Icon = ICONS[icon] || Sparkles;

  return (
    <div
      className="rounded-full flex items-center justify-center"
      style={{
        background: color + "18",
        width: size,
        height: size,
        border: `1.5px solid ${color}50`,
      }}
    >
      <Icon style={{ color }} className="w-1/2 h-1/2" strokeWidth={1.8} />
    </div>
  );
}

export function Field({ label, value, onChange, type = "text", placeholder }) {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label
        className="text-[10px] mono uppercase tracking-widest block mb-1.5"
        style={{ color: "var(--ink-dim)" }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={isPassword && showPassword ? "text" : type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:border-zinc-800 transition"
          style={{ borderColor: "var(--line)", paddingRight: isPassword ? 48 : 16 }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--ink-dim)" }}
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
}
