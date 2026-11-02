import type { Metadata } from "next";
import { CtaBanner } from "@/components/cta-banner";
import { PageHero } from "@/components/page-hero";
import { PortfolioGallery } from "@/components/portfolio-gallery";
import { getSettings, listPortfolio } from "@/lib/data";

export const metadata: Metadata = { title: "Портфолио" };

export default async function PortfolioPage() {
  const [works, settings] = await Promise.all([
    listPortfolio(true),
    getSettings(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="наши работы"
        breadcrumb="Портфолио"
        title={
          <>
            Портфолио
          </>
        }
        text="Стрижки, которые хочется трогать, и цвет, который хочется показывать. Здесь — только настоящие работы наших мастеров."
        tone="paper"
      />

      <section className="page-section">
        <div className="wrap">
          <PortfolioGallery works={works} />
        </div>
      </section>

      <CtaBanner settings={settings} />
    </>
  );
}
