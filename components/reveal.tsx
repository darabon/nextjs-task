"use client";

import { useEffect, useRef, type CSSProperties } from "react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: "up" | "left" | "right" | "pop";
};

export function Reveal({
  children,
  className = "",
  delay = 0,
  variant = "up",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            element.classList.add("is-visible");
            observer.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const variantClass =
    variant === "left"
      ? " reveal-left"
      : variant === "right"
        ? " reveal-right"
        : variant === "pop"
          ? " reveal-pop"
          : "";

  return (
    <div
      ref={ref}
      className={`reveal${variantClass}${className ? ` ${className}` : ""}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
