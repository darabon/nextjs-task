import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const marck = localFont({
  src: "./fonts/MarckScript-Regular.ttf",
  weight: "400",
  variable: "--font-marck",
  display: "swap",
});

const nunito = localFont({
  src: "./fonts/Nunito-Variable.ttf",
  weight: "200 1000",
  variable: "--font-nunito",
  display: "swap",
});

const unbounded = localFont({
  src: "./fonts/Unbounded-Variable.ttf",
  weight: "200 900",
  variable: "--font-unbounded",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "каприз — парикмахерская для тех, кто любит экспериментировать",
    template: "%s · каприз",
  },
  description:
    "Парикмахерская «каприз»: стрижки, окрашивание и укладки в атмосфере вашей любимой эстетики. Запись онлайн.",
  openGraph: {
    title: "каприз — парикмахерская",
    description:
      "Стрижки, окрашивание и укладки в атмосфере вашей любимой эстетики.",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      className={`${marck.variable} ${nunito.variable} ${unbounded.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>{children}</body>
    </html>
  );
}
