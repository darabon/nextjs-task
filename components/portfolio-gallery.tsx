"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { PortfolioItem } from "@/lib/types";

export function PortfolioGallery({ works }: { works: PortfolioItem[] }) {
  const tags = ["Все", ...Array.from(new Set(works.map((work) => work.tag)))];
  const [tag, setTag] = useState("Все");
  const [selected, setSelected] = useState<PortfolioItem | null>(null);

  const filtered =
    tag === "Все" ? works : works.filter((work) => work.tag === tag);

  useEffect(() => {
    if (!selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected]);

  return (
    <>
      <div className="tabs" role="tablist" aria-label="Категории работ">
        {tags.map((item) => (
          <button
            type="button"
            key={item}
            className={`tab${tag === item ? " active" : ""}`}
            onClick={() => setTag(item)}
            role="tab"
            aria-selected={tag === item}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="portfolio-grid">
        {filtered.map((work) => (
          <button
            type="button"
            className="work-card"
            key={work.id}
            onClick={() => setSelected(work)}
            aria-label={`Открыть работу: ${work.title}`}
          >
            <Image
              src={work.image}
              alt={work.title}
              fill
              sizes="(max-width: 560px) 92vw, (max-width: 1000px) 45vw, 30vw"
            />
            <span className="work-overlay">
              <span className="work-tag">{work.tag}</span>
              <span className="work-title">{work.title}</span>
            </span>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
          onClick={(event) => {
            if (event.currentTarget === event.target) setSelected(null);
          }}
        >
          <div className="lightbox-card">
            <button
              type="button"
              className="lightbox-close"
              aria-label="Закрыть"
              onClick={() => setSelected(null)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                aria-hidden
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <div className="lightbox-image">
              <Image
                src={selected.image}
                alt={selected.title}
                fill
                sizes="(max-width: 760px) 90vw, 55vw"
              />
            </div>
            <div className="lightbox-body">
              <span className="work-tag">{selected.tag}</span>
              <h2>{selected.title}</h2>
              <p>{selected.description}</p>
              {selected.stylist && (
                <p>
                  Мастер: <strong>{selected.stylist}</strong>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
