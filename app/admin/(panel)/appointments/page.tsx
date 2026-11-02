import Link from "next/link";
import { ConfirmButton } from "@/components/admin/confirm-button";
import {
  deleteAppointment,
  setAppointmentStatus,
} from "@/lib/admin-actions";
import { STATUS_LABELS, STATUS_ORDER } from "@/lib/constants";
import { listAppointments } from "@/lib/data";
import { formatDateShort, plural } from "@/lib/format";
import type { AppointmentStatus } from "@/lib/types";

const FILTERS: { key: AppointmentStatus | "all"; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "new", label: "Новые" },
  { key: "confirmed", label: "Подтверждённые" },
  { key: "done", label: "Выполненные" },
  { key: "cancelled", label: "Отменённые" },
];

export default async function AdminAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  const active = FILTERS.some((filter) => filter.key === params.status)
    ? (params.status as AppointmentStatus | "all")
    : "all";
  const appointments = await listAppointments();
  const visible =
    active === "all"
      ? appointments
      : appointments.filter((appointment) => appointment.status === active);

  const sorted = [...visible].sort((a, b) =>
    `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`),
  );

  const counts = Object.fromEntries(
    STATUS_ORDER.map((status) => [
      status,
      appointments.filter((appointment) => appointment.status === status)
        .length,
    ]),
  ) as Record<AppointmentStatus, number>;

  return (
    <div className="admin-content">
      <header className="admin-page-head">
        <div>
          <h1>Записи</h1>
          <p>
            {appointments.length}{" "}
            {plural(appointments.length, "заявка", "заявки", "заявок")} ·{" "}
            {counts.new} новых
          </p>
        </div>
        <Link href="/book" className="btn btn-outline btn-sm" target="_blank">
          Проверить форму ↗
        </Link>
      </header>

      {params.error && (
        <p className="admin-note error" role="alert">
          {params.error}
        </p>
      )}
      {params.saved && (
        <p className="admin-note" role="status">
          Запись обновлена.
        </p>
      )}

      <div className="admin-filters">
        {FILTERS.map((filter) => {
          const count =
            filter.key === "all" ? appointments.length : counts[filter.key];
          return (
            <Link
              key={filter.key}
              href={
                filter.key === "all"
                  ? "/admin/appointments"
                  : `/admin/appointments?status=${filter.key}`
              }
              className={`admin-filter${active === filter.key ? " active" : ""}`}
            >
              {filter.label}
              <span>{count}</span>
            </Link>
          );
        })}
      </div>

      <section className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table admin-table-appointments">
            <thead>
              <tr>
                <th>Клиент</th>
                <th>Визит</th>
                <th>Услуга и мастер</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((appointment) => {
                const nextActions: {
                  status: AppointmentStatus;
                  label: string;
                  tone: string;
                }[] = [];
                if (appointment.status === "new") {
                  nextActions.push({
                    status: "confirmed",
                    label: "Подтвердить",
                    tone: "pink",
                  });
                }
                if (appointment.status === "confirmed") {
                  nextActions.push({
                    status: "done",
                    label: "Выполнено",
                    tone: "pink",
                  });
                }
                if (appointment.status === "cancelled") {
                  nextActions.push({
                    status: "new",
                    label: "Вернуть",
                    tone: "",
                  });
                }
                if (
                  appointment.status === "new" ||
                  appointment.status === "confirmed"
                ) {
                  nextActions.push({
                    status: "cancelled",
                    label: "Отменить",
                    tone: "danger",
                  });
                }

                return (
                  <tr key={appointment.id}>
                    <td data-label="Клиент">
                      <div className="strong">{appointment.name}</div>
                      <a
                        className="sub admin-phone"
                        href={`tel:${appointment.phone.replace(/[^\d+]/g, "")}`}
                      >
                        {appointment.phone}
                      </a>
                    </td>
                    <td data-label="Визит">
                      <div className="strong">
                        {formatDateShort(appointment.date)}
                      </div>
                      <div className="sub">{appointment.time}</div>
                    </td>
                    <td data-label="Услуга и мастер">
                      <div>{appointment.serviceTitle}</div>
                      <div className="sub">
                        {appointment.stylistName || "Любой мастер"}
                      </div>
                      {appointment.comment && (
                        <div className="admin-comment" title={appointment.comment}>
                          «{appointment.comment}»
                        </div>
                      )}
                    </td>
                    <td data-label="Статус">
                      <span className={`badge badge-${appointment.status}`}>
                        {STATUS_LABELS[appointment.status]}
                      </span>
                    </td>
                    <td data-label="Действия">
                      <div className="admin-actions">
                        {nextActions.map((action) => (
                          <form action={setAppointmentStatus} key={action.status}>
                            <input
                              type="hidden"
                              name="id"
                              value={appointment.id}
                            />
                            <input
                              type="hidden"
                              name="status"
                              value={action.status}
                            />
                            <button
                              type="submit"
                              className={`mini-btn ${action.tone}`}
                            >
                              {action.label}
                            </button>
                          </form>
                        ))}
                        <form action={deleteAppointment}>
                          <input
                            type="hidden"
                            name="id"
                            value={appointment.id}
                          />
                          <ConfirmButton message="Удалить эту запись безвозвратно?">
                            Удалить
                          </ConfirmButton>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <div className="admin-empty">
                      {active === "all" ? (
                        <>
                          Записей ещё нет. Первая заявка появится здесь после
                          отправки формы на <Link href="/book">сайте</Link>.
                        </>
                      ) : (
                        "В этой категории пока пусто."
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
