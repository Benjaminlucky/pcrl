// Small UI kit for the website-CMS screens (dark dashboard theme).
import React, { useEffect } from "react";

export function Panel({ className = "", children, ...rest }) {
  return (
    <div className={`bg-[#121212] border border-white/10 rounded-xl ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function PageHeader({ title, subtitle, actions, back }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mt-8 mb-6">
      <div className="min-w-0">
        {back}
        <h2 className="text-2xl sm:text-3xl font-bold text-white truncate">{title}</h2>
        {subtitle && <p className="text-gray-400 mt-1 text-sm">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

const BTN = {
  primary: "bg-primary-500 hover:bg-primary-600 text-white",
  secondary: "bg-white/10 hover:bg-white/15 text-gray-100",
  ghost: "hover:bg-white/10 text-gray-300",
  danger: "bg-red-900/60 hover:bg-red-800 text-red-100",
  success: "bg-emerald-600 hover:bg-emerald-500 text-white",
};

export function Btn({ variant = "secondary", size = "md", className = "", children, ...rest }) {
  const sz = size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-4 py-2 text-sm";
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${sz} ${BTN[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function IconBtn({ title, className = "", children, ...rest }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      className={`p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

const BADGE = {
  gray: "bg-white/10 text-gray-300",
  green: "bg-emerald-500/15 text-emerald-300",
  amber: "bg-amber-500/15 text-amber-300",
  red: "bg-red-500/15 text-red-300",
  blue: "bg-sky-500/15 text-sky-300",
};

export function Badge({ color = "gray", children }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${BADGE[color]}`}>
      {children}
    </span>
  );
}

export function StatusBadge({ doc, dirty }) {
  if (dirty) return <Badge color="amber">Unsaved changes</Badge>;
  if (!doc?.isPublished && doc?.publishedVersion == null) return <Badge>Not published</Badge>;
  if (doc?.hasUnpublishedChanges) return <Badge color="amber">Draft differs from live</Badge>;
  return <Badge color="green">Live</Badge>;
}

export function Field({ label, hint, action, children }) {
  return (
    <div className="block">
      {(label || action) && (
        <span className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-sm font-medium text-gray-200">{label}</span>
          {action}
        </span>
      )}
      {children}
      {hint && <span className="block text-xs text-gray-500 mt-1">{hint}</span>}
    </div>
  );
}

const INPUT =
  "w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-600 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/40";

export function TextInput({ className = "", ...rest }) {
  return <input className={`${INPUT} ${className}`} {...rest} />;
}

export function TextArea({ className = "", rows = 4, ...rest }) {
  return <textarea rows={rows} className={`${INPUT} resize-y leading-relaxed ${className}`} {...rest} />;
}

export function Select({ options, className = "", ...rest }) {
  return (
    <select className={`${INPUT} ${className}`} {...rest}>
      {options.map((o) => (
        <option key={String(o.value)} value={o.value} className="bg-[#121212]">
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2 text-sm text-gray-300 cursor-pointer"
    >
      <span className={`relative w-9 h-5 rounded-full transition ${checked ? "bg-primary-500" : "bg-white/20"}`}>
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${checked ? "left-[18px]" : "left-0.5"}`}
        />
      </span>
      {label}
    </button>
  );
}

export function Spinner({ className = "" }) {
  return (
    <div
      className={`w-8 h-8 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin ${className}`}
    />
  );
}

export function Loading() {
  return (
    <div className="py-24 flex justify-center">
      <Spinner />
    </div>
  );
}

export function Alert({ color = "red", children, action }) {
  const c =
    color === "red"
      ? "bg-red-500/10 border-red-500/30 text-red-200"
      : color === "amber"
      ? "bg-amber-500/10 border-amber-500/30 text-amber-100"
      : "bg-sky-500/10 border-sky-500/30 text-sky-100";
  return (
    <div className={`border rounded-lg px-4 py-3 text-sm flex flex-wrap items-center justify-between gap-3 ${c}`}>
      <div>{children}</div>
      {action}
    </div>
  );
}

export function Modal({ open, onClose, title, children, footer, wide = false }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className={`w-full ${wide ? "max-w-5xl" : "max-w-lg"} max-h-[90vh] flex flex-col bg-[#161616] border border-white/10 rounded-xl shadow-2xl`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <IconBtn title="Close" onClick={onClose}>
            ✕
          </IconBtn>
        </div>
        <div className="p-5 overflow-y-auto">{children}</div>
        {footer && <div className="px-5 py-4 border-t border-white/10 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
