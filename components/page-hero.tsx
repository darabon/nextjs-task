import Link from "next/link";
import { Bow, PixelHeart, Sparkle } from "@/components/decor";
import { Reveal } from "@/components/reveal";

type PageHeroProps = {
  eyebrow: string;
  title: React.ReactNode;
  text?: string;
  tone?: "pink" | "paper" | "lilac";
  breadcrumb: string;
  children?: React.ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  text,
  tone = "pink",
  breadcrumb,
  children,
}: PageHeroProps) {
  return (
    <section className={`page-hero${tone === "paper" ? " tone-paper" : tone === "lilac" ? " tone-lilac" : ""}`}>
      <div className="page-hero-blob" />
      <Bow className="page-hero-bow decor-sway" variant="pink" />
      <PixelHeart
        className="page-hero-heart decor-float"
        color="#b83a72"
        size={70}
      />
      <Sparkle
        className="page-hero-sparkle-a decor-twinkle"
        color="#f08fb3"
      />
      <Sparkle
        className="page-hero-sparkle-b decor-twinkle"
        color="#25222b"
        size={40}
      />
      <div className="wrap page-hero-inner">
        <div className="breadcrumbs">
          <Link href="/">Главная</Link>
          <span aria-hidden>/</span>
          <span>{breadcrumb}</span>
        </div>
        <Reveal>
          <span className="sticker">{eyebrow}</span>
        </Reveal>
        <Reveal delay={90}>
          <h1 className="display-title">{title}</h1>
        </Reveal>
        {text && (
          <Reveal delay={160}>
            <p className="page-hero-sub">{text}</p>
          </Reveal>
        )}
        {children && (
          <Reveal delay={220}>
            <div className="page-hero-actions">{children}</div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
