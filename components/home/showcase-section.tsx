"use client";

import Image from "next/image";
import { useEffect, useState, type KeyboardEvent } from "react";
import { PixelHeart, Sparkle } from "@/components/decor";
import { Reveal } from "@/components/reveal";
import type { PortfolioItem } from "@/lib/types";

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={direction === "left" ? "M15 18L9 12L15 6" : "M9 18L15 12L9 6"} />
    </svg>
  );
}

export function ShowcaseSection({ items }: { items: PortfolioItem[] }) {
  const [active, setActive] = useState(0);
  const count = items.length;

  useEffect(() => {
    if (count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setTimeout(() => {
      setActive((current) => (current + 1) % count);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [active, count]);

  if (!count) return null;

  const go = (direction: number) => {
    setActive((current) => (current + direction + count) % count);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    }
  };

  return (
    <section className="showcase-section">
      <span className="showcase-blob" aria-hidden />
      <span className="showcase-blob showcase-blob-lilac" aria-hidden />
      <Sparkle
        className="showcase-sparkle-left decor-twinkle"
        color="#f08fb3"
        size={64}
      />
      <Sparkle
        className="showcase-sparkle-right decor-twinkle"
        color="#25222b"
        size={48}
      />
      <PixelHeart
        className="showcase-heart decor-float"
        color="#b83a72"
        size={54}
      />

      <div className="wrap">
        <Reveal>
          <h2 className="section-heading">Ваши прически</h2>
        </Reveal>

        <div className="showcase-layout">
          <Reveal variant="left" className="showcase-stage">
            <div
              className="stage-card"
              tabIndex={0}
              onKeyDown={onKeyDown}
              role="region"
              aria-roledescription="карусель"
              aria-label="Галерея причёсок"
            >
              <div className="stage-image">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className={`stage-slide${index === active ? " active" : ""}`}
                    aria-hidden={index !== active}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 1000px) 80vw, 30vw"
                      priority={index === 0}
                    />
                  </div>
                ))}
              </div>
              <div className="stage-controls">
                <button
                  type="button"
                  className="icon-button"
                  aria-label="Предыдущая причёска"
                  onClick={() => go(-1)}
                >
                  <Chevron direction="left" />
                </button>
                <span className="stage-counter" aria-live="polite">
                  {active + 1} / {count}
                </span>
                <button
                  type="button"
                  className="icon-button dark"
                  aria-label="Следующая причёска"
                  onClick={() => go(1)}
                >
                  <Chevron direction="right" />
                </button>
              </div>
            </div>
          </Reveal>

          <Reveal variant="right" delay={100} className="showcase-thumbs">
            <div className="thumbs">
              {items.map((item, index) => (
                <button
                  type="button"
                  key={item.id}
                  className={`thumb${index === active ? " active" : ""}`}
                  onClick={() => setActive(index)}
                  aria-label={item.title}
                  aria-pressed={index === active}
                >
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(max-width: 1000px) 30vw, 12vw"
                  />
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
