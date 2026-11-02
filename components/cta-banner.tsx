import Link from "next/link";
import { Bow, PixelHeart, Sparkle } from "@/components/decor";
import { Reveal } from "@/components/reveal";
import type { Settings } from "@/lib/types";

export function CtaBanner({ settings }: { settings: Settings }) {
  return (
    <section className="cta">
      <Bow className="cta-bow-left decor-sway" variant="pink" />
      <Bow className="cta-bow-right decor-float" variant="pink" />
      <Sparkle className="cta-sparkle-a decor-twinkle" color="#f08fb3" />
      <Sparkle className="cta-sparkle-b decor-twinkle" color="#ffffff" />
      <Sparkle className="cta-sparkle-c decor-twinkle" color="#f9dee8" />
      <PixelHeart className="cta-heart-left decor-float" color="#f08fb3" size={72} />
      <PixelHeart className="cta-heart-right decor-float" color="#f9dee8" size={58} />
      <div className="wrap cta-inner">
        <Reveal>
          <h2 className="cta-title">
            Записаться <span>скорее!</span>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <Link href="/book" className="btn btn-pink">
            Записаться
          </Link>
        </Reveal>
        <Reveal delay={200}>
          <p className="cta-phone">
            или позвоните: <a href={settings.phoneHref}>{settings.phone}</a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
