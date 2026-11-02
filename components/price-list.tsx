"use client";

import Link from "next/link";
import { useState } from "react";
import { formatDuration, formatPrice } from "@/lib/format";
import type { Service } from "@/lib/types";

export function PriceList({ services }: { services: Service[] }) {
  const categories = ["Все", ...Array.from(new Set(services.map((s) => s.category)))];
  const [active, setActive] = useState("Все");

  const filtered =
    active === "Все"
      ? services
      : services.filter((service) => service.category === active);

  return (
    <>
      <div className="tabs" role="tablist" aria-label="Категории услуг">
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            className={`tab${active === category ? " active" : ""}`}
            onClick={() => setActive(category)}
            role="tab"
            aria-selected={active === category}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="price-grid">
        {filtered.map((service) => (
          <article className="price-card" key={service.id}>
            <div>
              <span className="price-cat">{service.category}</span>
              <div className="price-title-row">
                <h2 className="price-title">{service.title}</h2>
                {service.popular && <span className="popular-badge">хит</span>}
              </div>
              <p className="price-desc">{service.description}</p>
              <p className="price-meta">
                {formatDuration(service.duration)} · запись к любому мастеру
              </p>
            </div>
            <div className="price-right">
              <span className="price-value">{formatPrice(service.price)}</span>
              <Link
                href={`/book?service=${service.id}`}
                className="price-arrow"
                aria-label={`Записаться: ${service.title}`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </article>
        ))}
      </div>

      {!filtered.length && (
        <p className="price-note">В этой категории пока нет услуг.</p>
      )}
    </>
  );
}
