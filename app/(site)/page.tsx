import { Hero } from "@/components/home/hero";
import { ScheduleSection } from "@/components/home/schedule-section";
import { ShowcaseSection } from "@/components/home/showcase-section";
import { CtaBanner } from "@/components/cta-banner";
import { listPortfolio, getSettings } from "@/lib/data";

export default async function HomePage() {
  const [settings, portfolio] = await Promise.all([
    getSettings(),
    listPortfolio(true),
  ]);

  return (
    <>
      <Hero />
      <ScheduleSection settings={settings} />
      <ShowcaseSection items={portfolio.slice(0, 9)} />
      <CtaBanner settings={settings} />
    </>
  );
}
