"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { NAV_LINKS } from "@/lib/constants";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <div className="wrap header-inner">
          <Logo />
          <nav className="site-nav" aria-label="Основная навигация">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`site-nav-link${isActive(link.href) ? " active" : ""}`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/book"
              className="btn btn-outline btn-nav"
              onClick={() => setOpen(false)}
            >
              Записаться
            </Link>
          </nav>
          <button
            type="button"
            className="burger"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>
      <div
        id="mobile-menu"
        className={`mobile-menu${open ? " open" : ""}`}
        aria-hidden={!open}
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="mobile-menu-link"
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/book"
          className="btn btn-dark"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
        >
          Записаться
        </Link>
      </div>
    </>
  );
}
