import Image from "next/image";
import { PixelHeart, Sparkle, Squiggle } from "@/components/decor";
import { Reveal } from "@/components/reveal";
import { WEEKDAYS } from "@/lib/constants";
import type { Settings } from "@/lib/types";

export function ScheduleSection({ settings }: { settings: Settings }) {
  const openDays = WEEKDAYS.filter((day) => settings.workingDays.includes(day.n));
  const closedDays = WEEKDAYS.filter(
    (day) => !settings.workingDays.includes(day.n),
  );
  const closedLabel = closedDays.length
    ? closedDays.map((day) => day.short).join(", ")
    : "—";

  return (
    <section className="schedule">
      <Sparkle
        className="schedule-sparkle-a decor-twinkle"
        color="#25222b"
        size={72}
      />
      <Sparkle
        className="schedule-sparkle-b decor-twinkle"
        color="#f08fb3"
        size={52}
      />
      <Sparkle
        className="schedule-sparkle-c decor-twinkle"
        color="#b83a72"
        size={68}
      />
      <PixelHeart
        className="schedule-heart decor-float"
        color="#b83a72"
        size={97}
      />

      <div className="wrap schedule-grid">
        <div className="schedule-visual">
          <span className="schedule-blob" aria-hidden />
          <Image
            src="/images/schedule-pose.png"
            alt="Девушка с серебристыми прядями в чёрном топе тянет руки к камере"
            width={759}
            height={1024}
            sizes="(max-width: 1000px) 66vw, 32vw"
            className="schedule-photo"
          />
        </div>

        <div className="schedule-content">
          <Reveal>
            <h2 className="display-title">Наше расписание</h2>
          </Reveal>

          <Reveal delay={120}>
            <div className="schedule-panels">
              <div>
                <div className="schedule-open-title">
                  Работаем
                  <Squiggle className="schedule-squiggle" />
                </div>
                <div className="day-grid">
                  {openDays.map((day) => (
                    <div
                      className="day-chip"
                      key={day.n}
                      aria-label={day.full}
                    >
                      {day.short}
                    </div>
                  ))}
                </div>
              </div>

              <div className="schedule-closed">
                <div className="closed-pill">Отдыхаем</div>
                <div className="closed-card" aria-label={closedLabel}>
                  {closedLabel}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
