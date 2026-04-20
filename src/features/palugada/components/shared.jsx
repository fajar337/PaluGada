import { Sparkles } from "lucide-react";
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
  return (
    <div>
      <label
        className="text-[10px] mono uppercase tracking-widest block mb-1.5"
        style={{ color: "var(--ink-dim)" }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:border-zinc-800 transition"
        style={{ borderColor: "var(--line)" }}
      />
    </div>
  );
}
