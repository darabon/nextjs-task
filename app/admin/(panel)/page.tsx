import Link from "next/link";
import { PixelHeart, Sparkle } from "@/components/decor";
import { WEEKDAYS, STATUS_LABELS } from "@/lib/constants";
import {
  getAdminStats,
  getSettings,
  listAppointments,
  listUpcomingAppointments,
} from "@/lib/data";
import { formatDateShort, plural } from "@/lib/format";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  const [stats, upcoming, latest, settings] = await Promise.all([
    getAdminStats(),
    listUpcomingAppointments(5),
    listAppointments(),
    getSettings(),
  ]);

  const today = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    weekday: "long",
  }).format(new Date());

  return (
    <div className="admin-content">
      <header className="admin-page-head">
        <div>
          <h1>Всё под контролем</h1>
          <p>
            {today} · {stats.newAppointments}{" "}
            {plural(stats.newAppointments, "новая заявка", "новые заявки", "новых заявок")}{" "}
            ждёт ответа
          </p>
        </div>
        <Link href="/admin/appointments" className="btn btn-dark btn-sm">
          Все записи →
        </Link>
      </header>

      {params.error && (
        <p className="admin-note error" role="alert">
          {params.error}
        </p>
      )}
      {params.saved && (
        <p className="admin-note" role="status">
          Изменения сохранены.
        </p>
      )}

      <div className="admin-stats">
        <article className="stat-card">
          <span className="stat-label">Новые записи</span>
          <strong className="stat-value">{stats.newAppointments}</strong>
          <span className="stat-hint">Ждут подтверждения</span>
        </article>
        <article className="stat-card">
          <span className="stat-label">Всего записей</span>
          <strong className="stat-value">{stats.totalAppointments}</strong>
          <span className="stat-hint">За всё время работы сайта</span>
        </article>
        <article className="stat-card">
          <span className="stat-label">Услуги</span>
          <strong className="stat-value">{stats.services}</strong>
          <span className="stat-hint">В каталоге цен</span>
        </article>
        <article className="stat-card">
          <span className="stat-label">Мастера</span>
          <strong className="stat-value">{stats.staff}</strong>
          <span className="stat-hint">{stats.works} работ в портфолио</span>
        </article>
      </div>

      <div className="admin-grid-2">
        <section className="admin-card">
          <div className="admin-card-head">
            <h2>Последние заявки</h2>
            <Link href="/admin/appointments" className="mini-btn">
              Открыть всё
            </Link>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table admin-table-dashboard">
              <thead>
                <tr>
                  <th>Клиент</th>
                  <th>Когда</th>
                  <th>Услуга</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {latest.slice(0, 6).map((appointment) => (
                  <tr key={appointment.id}>
                    <td data-label="Клиент">
                      <div className="strong">{appointment.name}</div>
                      <div className="sub">{appointment.phone}</div>
                    </td>
                    <td data-label="Когда">
                      <div>{formatDateShort(appointment.date)}</div>
                      <div className="sub">{appointment.time}</div>
                    </td>
                    <td data-label="Услуга">
                      <div>{appointment.serviceTitle}</div>
                      <div className="sub">
                        {appointment.stylistName || "Любой мастер"}
                      </div>
                    </td>
                    <td data-label="Статус">
                      <span className={`badge badge-${appointment.status}`}>
                        {STATUS_LABELS[appointment.status]}
                      </span>
                    </td>
                  </tr>
                ))}
                {latest.length === 0 && (
                  <tr>
                    <td colSpan={4}>
                      <div className="admin-empty">
                        Пока ни одной записи. Отправьте тестовую заявку через{" "}
                        <Link href="/book">страницу записи</Link>.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="admin-stack">
          <section className="admin-card">
            <div className="admin-card-head">
              <h2>Ближайшие визиты</h2>
              <PixelHeart size={20} color="#f08fb3" />
            </div>
            <div className="admin-list">
              {upcoming.map((appointment) => (
                <div className="admin-list-item" key={appointment.id}>
                  <div className="admin-date-tile">
                    <span>{appointment.date.slice(8, 10)}</span>
                    <small>
                      {new Intl.DateTimeFormat("ru-RU", { month: "short" })
                        .format(new Date(`${appointment.date}T12:00:00`))
                        .replace(".", "")}
                    </small>
                  </div>
                  <div>
                    <div className="admin-item-title">{appointment.name}</div>
                    <div className="admin-item-meta">
                      {appointment.time} · {appointment.serviceTitle}
                    </div>
                  </div>
                  <span className={`badge badge-${appointment.status}`}>
                    {STATUS_LABELS[appointment.status]}
                  </span>
                </div>
              ))}
              {upcoming.length === 0 && (
                <div className="admin-empty">
                  Впереди пока пусто — самое время пригласить клиентов.
                </div>
              )}
            </div>
          </section>

          <section className="admin-card">
            <div className="admin-card-head">
              <h2>Быстрые действия</h2>
              <Sparkle size={20} color="#b83a72" />
            </div>
            <div className="admin-card-body admin-quick">
              <Link href="/admin/services" className="admin-quick-link">
                <span>Добавить услугу</span>
                <span aria-hidden>→</span>
              </Link>
              <Link href="/admin/staff" className="admin-quick-link">
                <span>Добавить мастера</span>
                <span aria-hidden>→</span>
              </Link>
              <Link href="/admin/portfolio" className="admin-quick-link">
                <span>Пополнить портфолио</span>
                <span aria-hidden>→</span>
              </Link>
              <Link href="/admin/settings" className="admin-quick-link">
                <span>Изменить расписание</span>
                <span aria-hidden>→</span>
              </Link>
            </div>
          </section>

          <section className="admin-card">
            <div className="admin-card-head">
              <h2>График салона</h2>
            </div>
            <div className="admin-card-body">
              <div className="admin-days">
                {WEEKDAYS.map((day) => (
                  <span
                    key={day.n}
                    className={`admin-day-pill${
                      settings.workingDays.includes(day.n) ? " on" : ""
                    }`}
                  >
                    {day.short}
                  </span>
                ))}
              </div>
              <p className="admin-card-note">
                {settings.hours}
                <br />
                {settings.dayOffLabel}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
