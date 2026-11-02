import Image from "next/image";

type SparkleProps = {
  className?: string;
  color?: string;
  size?: number;
};

export function Sparkle({
  className,
  color = "#25222b",
  size = 64,
}: SparkleProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`sparkle${className ? ` ${className}` : ""}`}
      fill="none"
    >
      <path
        d="M50 0C55.5 34.5 65.5 44.5 100 50C65.5 55.5 55.5 65.5 50 100C44.5 65.5 34.5 55.5 0 50C34.5 44.5 44.5 34.5 50 0Z"
        fill={color}
      />
    </svg>
  );
}

const HEART_ROWS = [
  ".##...##.",
  "####.####",
  "#########",
  "#########",
  ".#######.",
  "..#####..",
  "...###...",
  "....#....",
];

export function PixelHeart({
  className,
  color = "#b83a72",
  size = 40,
}: {
  className?: string;
  color?: string;
  size?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 9 8"
      width={size}
      height={Math.round((size * 8) / 9)}
      shapeRendering="crispEdges"
      className={`pixel-heart${className ? ` ${className}` : ""}`}
    >
      {HEART_ROWS.flatMap((row, y) =>
        row.split("").map((cell, x) =>
          cell === "#" ? (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              fill={color}
            />
          ) : null,
        ),
      )}
    </svg>
  );
}

export function Bow({
  className,
  variant = "white",
}: {
  className?: string;
  variant?: "white" | "pink";
}) {
  return (
    <Image
      src={variant === "pink" ? "/decor/bow_pink.svg" : "/decor/bow.svg"}
      alt=""
      width={variant === "pink" ? 224 : 194}
      height={variant === "pink" ? 170 : 125}
      unoptimized
      className={className}
      aria-hidden
    />
  );
}

export function Squiggle({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="17.5 17.5 413.594 25.895"
      preserveAspectRatio="none"
      className={className}
      fill="none"
    >
      <path
        d="M0 20.395C21.288 13.295 158.516 4.617 224.469 1.166L193.567 17.807C253.511 10.041 380.439 -4.159 408.594 1.166"
        transform="translate(20 20)"
        stroke="#F08FB3"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}
