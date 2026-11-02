import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBanner } from "@/components/cta-banner";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { getSettings, listStaff } from "@/lib/data";

export const metadata: Metadata = { title: "Наши сотрудники" };

export default async function TeamPage() {
  const [staff, settings] = await Promise.all([listStaff(true), getSettings()]);

  return (
    <>
      <PageHero
        eyebrow="команда"
        breadcrumb="Наши сотрудники"
        title={
          <>
            Наши <span className="accent">сотрудники</span>
          </>
        }
        text="Четыре характера, одна любовь к волосам. Выбирайте мастера по настроению — или доверьтесь нам."
        tone="lilac"
      />

      <section className="page-section">
        <div className="wrap">
          <Reveal>
            <div className="team-intro">
              <p>
                Мы не делаем «как у всех». Сначала слушаем, потом придумываем
                форму — и только потом берём ножницы. Поэтому уходите с
                причёской, которую хочется носить.
              </p>
              <div className="team-stats">
                <div className="team-stat">
                  <strong>{staff.length}</strong>
                  <span>мастера</span>
                </div>
                <div className="team-stat">
                  <strong>9</strong>
                  <span>лет опыта</span>
                </div>
                <div className="team-stat">
                  <strong>1300+</strong>
                  <span>клиентов</span>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="team-grid">
            {staff.map((person, index) => (
              <Reveal key={person.id} delay={index * 80} variant="pop">
                <article className="team-card">
                  <span className="team-tape" aria-hidden />
                  <div className="team-photo">
                    <Image
                      src={person.photo}
                      alt={`${person.name} — ${person.role}`}
                      fill
                      sizes="(max-width: 640px) 90vw, (max-width: 1180px) 45vw, 24vw"
                    />
                  </div>
                  <div className="team-body">
                    <h2 className="team-name">{person.name}</h2>
                    <p className="team-role">{person.role}</p>
                    <p className="team-experience">Опыт: {person.experience}</p>
                    <p className="team-bio">{person.bio}</p>
                    <div className="team-specialties">
                      {person.specialties.map((specialty) => (
                        <span className="specialty" key={specialty}>
                          {specialty}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/book?stylist=${person.id}`}
                      className="team-book"
                    >
                      Записаться →
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner settings={settings} />
    </>
  );
}
