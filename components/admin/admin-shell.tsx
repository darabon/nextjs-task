"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { logoutAction } from "@/app/admin/actions";
import { PixelHeart } from "@/components/decor";

const ICONS: Record<string, ReactNode> = {
  dashboard: (
    <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
  ),
  appointments: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </>
  ),
  services: (
    <>
      <path d="M4 7h16M4 12h16M4 17h10" />
      <circle cx="19" cy="17" r="2" />
    </>
  ),
  staff: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19c.6-3.4 2.8-5.2 5.5-5.2S13.9 15.6 14.5 19" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M15.5 14.6c2.6.1 4.3 1.7 4.9 4.4" />
    </>
  ),
  portfolio: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="M4 17l5-4.5 4 3 3-2.5 4.5 4" />
    </>
  ),
  settings: (
    <>
      <path d="M4 7h7M15 7h5M4 17h5M13 17h7" />
      <circle cx="13" cy="7" r="2" />
      <circle cx="10" cy="17" r="2" />
    </>
  ),
};

const NAV = [
  { href: "/admin", label: "Панель", icon: "dashboard" },
  { href: "/admin/appointments", label: "Записи", icon: "appointments" },
  { href: "/admin/services", label: "Услуги", icon: "services" },
  { href: "/admin/staff", label: "Мастера", icon: "staff" },
  { href: "/admin/portfolio", label: "Портфолио", icon: "portfolio" },
  { href: "/admin/settings", label: "Расписание", icon: "settings" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className={`admin-shell${open ? " nav-open" : ""}`}>
      {open && (
        <button
          type="button"
          className="admin-backdrop"
          aria-label="Закрыть меню"
          onClick={() => setOpen(false)}
        />
      )}

      <aside className="admin-sidebar">
        <Link
          href="/admin"
          className="admin-logo"
          aria-label="каприз, админ-панель"
          onClick={() => setOpen(false)}
        >
          <PixelHeart size={28} color="#f08fb3" />
          <span className="logo-word">каприз</span>
          <span className="admin-logo-sub">admin</span>
        </Link>

        <nav className="admin-nav" aria-label="Админ-навигация">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(item.href) ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                {ICONS[item.icon]}
              </svg>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <Link href="/" className="admin-side-link" onClick={() => setOpen(false)}>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M14 4h5v16h-5M10 8l-4 4 4 4M6 12h10" />
            </svg>
            Открыть сайт
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="admin-logout">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden
              >
                <path d="M9 4H4v16h5M14 8l4 4-4 4M8 12h10" />
              </svg>
              Выйти
            </button>
          </form>
        </div>
      </aside>

      <div className="admin-main">
        <div className="admin-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              type="button"
              className="admin-burger"
              aria-label="Открыть меню"
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <span className="admin-topbar-title">Админ-панель</span>
          </div>
          <div className="admin-topbar-actions">
            <Link href="/">На сайт ↗</Link>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
