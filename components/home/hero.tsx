import Image from "next/image";
import Link from "next/link";
import { Bow, PixelHeart, Sparkle } from "@/components/decor";
import { Reveal } from "@/components/reveal";

export function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero-inner">
        <div className="hero-visual">
          <span className="hero-blob" aria-hidden />
          <div className="hero-photo">
            <Image
              src="/images/hero-curls.png"
              alt="Улыбающаяся девушка с тёмными кудрявыми волосами в салоне"
              width={1648}
              height={1697}
              priority
              sizes="(max-width: 900px) 92vw, 44vw"
            />
          </div>
          <Bow className="hero-bow decor-sway" />
        </div>

        <div className="hero-content">
          <Reveal>
            <span className="sticker">hair studio</span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="display-title hero-title">
              <span className="block">Любой безум</span>
              <span className="block accent">за ваш каприз!</span>
            </h1>
          </Reveal>
          <Reveal delay={180}>
            <p className="hero-text">
              Стрижки, окрашивание и укладки в атмосфере вашей любимой эстетики.
            </p>
          </Reveal>
          <Reveal delay={260}>
            <div className="hero-actions">
              <span className="hero-actions-wrap">
                <Link href="/book" className="btn btn-dark">
                  Записаться
                </Link>
                <PixelHeart
                  className="hero-button-heart decor-twinkle"
                  color="#b83a72"
                  size={34}
                />
              </span>
            </div>
          </Reveal>
        </div>
      </div>

      <PixelHeart
        className="hero-row-heart decor-twinkle"
        color="#f08fb3"
        size={105}
      />
      <PixelHeart
        className="hero-big-heart decor-float"
        color="#f08fb3"
        size={280}
      />
      <Sparkle
        className="hero-black-sparkle decor-twinkle"
        color="#25222b"
        size={190}
      />
      <Sparkle
        className="hero-mini-sparkle decor-twinkle"
        color="#25222b"
        size={60}
      />
      <Sparkle
        className="hero-pink-sparkle decor-twinkle"
        color="#f08fb3"
        size={90}
      />
      <Sparkle
        className="hero-extra-sparkle decor-twinkle"
        color="#b83a72"
        size={56}
      />
      <PixelHeart
        className="hero-small-heart decor-float"
        color="#f08fb3"
        size={52}
      />
    </section>
  );
}
