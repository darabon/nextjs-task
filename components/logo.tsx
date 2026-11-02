import Link from "next/link";
import { PixelHeart } from "@/components/decor";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className="logo"
      aria-label="каприз — на главную"
      style={light ? { color: "#fff" } : undefined}
    >
      <PixelHeart size={38} color="#b83a72" />
      <span className="logo-word">каприз</span>
    </Link>
  );
}
