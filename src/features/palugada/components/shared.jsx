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

export function Field({ label, value, onChange, type = "text", placeholder, min }) {
  const isPassword = type === "password";
  const isNumber = type === "number";
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
          min={isNumber ? (min ?? 0) : undefined}
          inputMode={isNumber ? "numeric" : undefined}
          onKeyDown={(event) => {
            if (isNumber && event.key === "-") {
              event.preventDefault();
            }
          }}
          onChange={(event) => {
            if (!isNumber) {
              onChange(event.target.value);
              return;
            }

            const rawValue = event.target.value;
            if (rawValue === "") {
              onChange("");
              return;
            }

            const nextValue = Number(rawValue);
            onChange(Number.isNaN(nextValue) ? 0 : Math.max(min ?? 0, nextValue));
          }}
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
