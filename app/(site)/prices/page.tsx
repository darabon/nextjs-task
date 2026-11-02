import type { Metadata } from "next";
import { CtaBanner } from "@/components/cta-banner";
import { PageHero } from "@/components/page-hero";
import { PriceList } from "@/components/price-list";
import { getSettings, listServices } from "@/lib/data";

export const metadata: Metadata = { title: "Каталог цен" };

export default async function PricesPage() {
  const [services, settings] = await Promise.all([
    listServices(true),
    getSettings(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="прайс"
        breadcrumb="Каталог цен"
        title={
          <>
            Каталог <span className="accent">цен</span>
          </>
        }
        text="Прозрачные цены без сюрпризов. Длительность и стоимость указаны за работу без учёта длины волос — итоговую смету мастер подтвердит до начала."
      />

      <section className="page-section">
        <div className="wrap">
          <PriceList services={services} />
          <div className="price-note">
            <strong>Приятная деталь:</strong> при первом визите действует скидка
            10% на любую услугу. А ещё мы всегда угощаем кофе и не торопим.
          </div>
        </div>
      </section>

      <CtaBanner settings={settings} />
    </>
  );
}
