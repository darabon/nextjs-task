import type { Metadata } from "next";
import Image from "next/image";
import { BookingForm } from "@/components/booking-form";
import { PageHero } from "@/components/page-hero";
import { getSettings, listServices, listStaff } from "@/lib/data";

export const metadata: Metadata = { title: "Записаться" };

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; stylist?: string }>;
}) {
  const params = await searchParams;
  const [services, staff, settings] = await Promise.all([
    listServices(true),
    listStaff(true),
    getSettings(),
  ]);

  const defaultService = services.some((s) => s.id === params.service)
    ? params.service
    : "";
  const defaultStylist = staff.some((s) => s.id === params.stylist)
    ? params.stylist
    : "";

  return (
    <>
      <PageHero
        eyebrow="онлайн-запись"
        breadcrumb="Записаться"
        title={
          <>
            Записаться <span className="accent">к нам</span>
          </>
        }
        text="Оставьте заявку — мы позвоним, подтвердим время и ответим на все вопросы. Или просто приходите, если хочется спонтанно."
        tone="lilac"
      >
        <a href={settings.phoneHref} className="btn btn-outline">
          Позвонить
        </a>
      </PageHero>

      <section className="page-section">
        <div className="wrap booking-layout">
          <div className="booking-card">
            <BookingForm
              services={services}
              staff={staff}
              settings={settings}
              defaultService={defaultService}
              defaultStylist={defaultStylist}
            />
          </div>

          <aside className="booking-side">
            <div className="side-card pink">
              <h3>Где мы</h3>
              <p>{settings.address}</p>
              <p style={{ marginTop: 10 }}>
                <a href={settings.phoneHref}>{settings.phone}</a>
              </p>
              <p>
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </p>
              <p style={{ marginTop: 10 }}>
                {settings.hours}
                <br />
                {settings.dayOffLabel}
              </p>
            </div>

            <div className="side-card">
              <h3>Как это работает</h3>
              <div className="steps">
                <div className="step">
                  <span className="step-num">1</span>
                  <p>Оставляете заявку с удобными датой и временем.</p>
                </div>
                <div className="step">
                  <span className="step-num">2</span>
                  <p>Мы звоним и подтверждаем визит в течение дня.</p>
                </div>
                <div className="step">
                  <span className="step-num">3</span>
                  <p>Приходите за новым образом — и уходите с улыбкой.</p>
                </div>
              </div>
            </div>

            <div className="side-photo">
              <Image
                src="/images/salon.jpg"
                alt="Интерьер парикмахерской с зеркалами и рабочими местами"
                fill
                sizes="(max-width: 1000px) 45vw, 28vw"
              />
            </div>

            <div className="side-card">
              <h3>Важно</h3>
              <p>
                Если опаздываете больше чем на 15 минут — позвоните. Мы
                постараемся сохранить ваше время, но иногда придётся
                перенести визит.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
