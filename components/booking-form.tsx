"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createAppointment } from "@/app/(site)/book/actions";
import { formatDate, todayISO } from "@/lib/format";
import type { BookingState, Service, Settings, Staff } from "@/lib/types";

type BookingFormProps = {
  services: Service[];
  staff: Staff[];
  settings: Settings;
  defaultService?: string;
  defaultStylist?: string;
};

const initialState: BookingState = { status: "idle" };

function timeOptions() {
  const options: string[] = [];
  for (let minutes = 10 * 60; minutes <= 20 * 60 + 30; minutes += 30) {
    const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
    const mins = String(minutes % 60).padStart(2, "0");
    options.push(`${hours}:${mins}`);
  }
  return options;
}

export function BookingForm({
  services,
  staff,
  settings,
  defaultService = "",
  defaultStylist = "",
}: BookingFormProps) {
  const [state, formAction, pending] = useActionState(
    createAppointment,
    initialState,
  );

  if (state.status === "success" && state.appointment) {
    return (
      <div className="success-card">
        <span className="success-icon" aria-hidden>
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12.5l4.5 4.5L19 7" />
          </svg>
        </span>
        <h2>Вы записаны!</h2>
        <p>
          Мы получили заявку и позвоним, чтобы подтвердить время. Если планы
          изменятся — просто напишите или позвоните.
        </p>
        <div className="success-summary">
          <div>
            <span>Имя</span>
            <span>{state.appointment.name}</span>
          </div>
          <div>
            <span>Услуга</span>
            <span>{state.appointment.serviceTitle}</span>
          </div>
          <div>
            <span>Мастер</span>
            <span>{state.appointment.stylistName}</span>
          </div>
          <div>
            <span>Когда</span>
            <span>
              {formatDate(state.appointment.date)}, {state.appointment.time}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 26 }}>
          <Link href="/" className="btn btn-outline btn-sm">
            На главную
          </Link>
          <Link href="/book" className="btn btn-dark btn-sm">
            Записаться ещё
          </Link>
        </div>
      </div>
    );
  }

  const categories = Array.from(new Set(services.map((s) => s.category)));

  return (
    <form className="booking-form" action={formAction} noValidate>
      {state.status === "error" && (
        <p className="form-error" role="alert">
          {state.message}
        </p>
      )}

      <div className="field full">
        <label htmlFor="serviceId">
          Услуга <span className="req">*</span>
        </label>
        <select
          id="serviceId"
          name="serviceId"
          className="select"
          required
          defaultValue={defaultService}
        >
          <option value="" disabled>
            Выберите услугу
          </option>
          {categories.map((category) => (
            <optgroup key={category} label={category}>
              {services
                .filter((service) => service.category === category)
                .map((service) => (
                  <option value={service.id} key={service.id}>
                    {service.title} — от {service.price.toLocaleString("ru-RU")} ₽
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="field full">
        <label htmlFor="stylistId">Мастер</label>
        <select
          id="stylistId"
          name="stylistId"
          className="select"
          defaultValue={defaultStylist}
        >
          <option value="">Любой мастер — подберём сами</option>
          {staff.map((person) => (
            <option value={person.id} key={person.id}>
              {person.name} — {person.role}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="date">
          Дата <span className="req">*</span>
        </label>
        <input
          id="date"
          name="date"
          type="date"
          className="input"
          min={todayISO()}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="time">
          Время <span className="req">*</span>
        </label>
        <select id="time" name="time" className="select" required defaultValue="">
          <option value="" disabled>
            Выберите время
          </option>
          {timeOptions().map((time) => (
            <option value={time} key={time}>
              {time}
            </option>
          ))}
        </select>
        <span className="form-hint">{settings.hours}</span>
      </div>

      <div className="field">
        <label htmlFor="name">
          Имя <span className="req">*</span>
        </label>
        <input
          id="name"
          name="name"
          className="input"
          placeholder="Как к вам обращаться"
          autoComplete="name"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="phone">
          Телефон <span className="req">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="input"
          placeholder="+7 (___) ___-__-__"
          autoComplete="tel"
          required
        />
      </div>

      <div className="field full">
        <label htmlFor="comment">Комментарий</label>
        <textarea
          id="comment"
          name="comment"
          className="textarea"
          placeholder="Пожелания, ссылка на референс или важные детали"
        />
      </div>

      <div className="form-submit">
        <p>
          Нажимая «Отправить», вы соглашаетесь с обработкой персональных данных.
          Это демо-заявка, она сохраняется в MongoDB.
        </p>
        <button type="submit" className="btn btn-dark" disabled={pending}>
          {pending ? "Отправляем…" : "Отправить"}
        </button>
      </div>
    </form>
  );
}
