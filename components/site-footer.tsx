import Link from "next/link";
import { Logo } from "@/components/logo";
import { PixelHeart, Sparkle } from "@/components/decor";
import { NAV_LINKS } from "@/lib/constants";
import type { Settings } from "@/lib/types";

export function SiteFooter({ settings }: { settings: Settings }) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-main">
          <div>
            <Logo />
            <p className="footer-desc">
              Парикмахерская для тех, кто любит экспериментировать.
            </p>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <h3>Разделы</h3>
              <ul>
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
                <li>
                  <Link href="/book">Записаться</Link>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h3>Контакты</h3>
              <ul>
                <li>{settings.address}</li>
                <li>
                  <a href={settings.phoneHref}>{settings.phone}</a>
                </li>
                <li>
                  <a href={`mailto:${settings.email}`}>{settings.email}</a>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h3>Часы работы</h3>
              <ul>
                <li>{settings.hours}</li>
                <li>{settings.dayOffLabel}</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} каприз. Все права защищены.</span>
          <span style={{ display: "flex", gap: 16 }}>
            {settings.socials.telegram && (
              <a href={settings.socials.telegram} target="_blank" rel="noreferrer">
                Telegram
              </a>
            )}
            {settings.socials.instagram && (
              <a
                href={settings.socials.instagram}
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            )}
            {settings.socials.vk && (
              <a href={settings.socials.vk} target="_blank" rel="noreferrer">
                VK
              </a>
            )}
          </span>
        </div>
      </div>
      <Sparkle className="footer-sparkle decor-twinkle" color="#f08fb3" />
      <PixelHeart className="footer-heart decor-float" color="#b83a72" size={54} />
    </footer>
  );
}
