"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Video,
  Layers,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/video-creator", label: "Video Creator", icon: Video },
  { href: "/carousel-creator", label: "Carousel Creator", icon: Layers },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border border-[var(--color-border)] shadow-sm"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-[260px] bg-white border-r border-[var(--color-border)]
          flex flex-col z-40 transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-[var(--color-border)]">
          <Link href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
            <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[var(--color-text)] tracking-tight">
                Presocio
              </h1>
              <p className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-widest">
                AI-Powered
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                  transition-all duration-200
                  ${isActive
                    ? "bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                  }
                `}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-[var(--color-border)]">
          <div className="px-4 py-3 rounded-xl bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-primary)]/10">
            <p className="text-xs font-semibold text-[var(--color-primary)]">
              Powered by Gemini AI
            </p>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
              gemini-3-flash-preview
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
