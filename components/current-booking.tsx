import Link from "next/link";
import { cancelMyAppointment } from "@/app/(site)/book/actions";
import { CancelBookingButton } from "@/components/cancel-booking-button";
import { STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import type { Appointment } from "@/lib/types";

export function CurrentBooking({ appointment }: { appointment: Appointment }) {
  return (
    <div className="current-booking">
      <div className="current-booking-head">
        <span className="current-booking-label">ваша запись</span>
        <span className={`badge badge-${appointment.status}`}>
          {STATUS_LABELS[appointment.status]}
        </span>
      </div>

      <h2>
        {appointment.status === "confirmed" ? "Ждём вас!" : "Заявка принята"}
      </h2>
      <p className="current-booking-lead">
        {appointment.status === "confirmed"
          ? "Мастер и время закреплены за вами. Если планы изменятся, отмените запись здесь — звонить не нужно."
          : "Мы получили заявку и свяжемся с вами для подтверждения. Если планы изменятся, запись можно отменить здесь."}
      </p>

      <div className="success-summary">
        <div>
          <span>Имя</span>
          <span>{appointment.name}</span>
        </div>
        <div>
          <span>Услуга</span>
          <span>{appointment.serviceTitle}</span>
        </div>
        <div>
          <span>Мастер</span>
          <span>{appointment.stylistName || "Любой мастер"}</span>
        </div>
        <div>
          <span>Когда</span>
          <span>
            {formatDate(appointment.date)}, {appointment.time}
          </span>
        </div>
      </div>

      <div className="current-booking-actions">
        <Link href="/" className="btn btn-outline btn-sm">
          На главную
        </Link>
        <form action={cancelMyAppointment}>
          <CancelBookingButton className="btn btn-dark btn-sm" />
        </form>
      </div>

      <p className="current-booking-note">
        Запись привязана к этому браузеру. Чтобы не потерять доступ к отмене,
        не очищайте cookies.
      </p>
    </div>
  );
}
