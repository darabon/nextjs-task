"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClientId, getClientId, rememberClientId } from "@/lib/booking";
import { ACTIVE_APPOINTMENT_STATUSES } from "@/lib/constants";
import {
  findActiveAppointmentByPhone,
  getClientAppointment,
  getSettings,
} from "@/lib/data";
import { formatDate, phoneKey, todayISO } from "@/lib/format";
import { getDb } from "@/lib/mongodb";
import type { BookingState } from "@/lib/types";

function text(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function createAppointment(
  _previous: BookingState,
  formData: FormData,
): Promise<BookingState> {
  try {
    const name = text(formData, "name");
    const phone = text(formData, "phone");
    const serviceId = text(formData, "serviceId");
    const stylistId = text(formData, "stylistId");
    const date = text(formData, "date");
    const time = text(formData, "time");
    const comment = text(formData, "comment");

    if (name.length < 2 || name.length > 80) {
      return { status: "error", message: "Укажите имя от 2 до 80 символов." };
    }

    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      return {
        status: "error",
        message: "Проверьте номер телефона — нужно от 10 до 15 цифр.",
      };
    }

    if (!ObjectId.isValid(serviceId)) {
      return { status: "error", message: "Выберите услугу из списка." };
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return { status: "error", message: "Выберите дату визита." };
    }

    const parsedDate = new Date(`${date}T12:00:00`);
    if (Number.isNaN(parsedDate.getTime())) {
      return { status: "error", message: "Некорректная дата." };
    }

    if (date < todayISO()) {
      return { status: "error", message: "Выберите будущую дату." };
    }

    const [hours, minutes] = time.split(":").map(Number);
    const timeMinutes = hours * 60 + minutes;
    if (
      !/^\d{2}:\d{2}$/.test(time) ||
      Number.isNaN(timeMinutes) ||
      timeMinutes < 10 * 60 ||
      timeMinutes > 20 * 60 + 30 ||
      minutes % 30 !== 0
    ) {
      return {
        status: "error",
        message: "Выберите время с 10:00 до 20:30 с шагом 30 минут.",
      };
    }

    if (comment.length > 500) {
      return { status: "error", message: "Комментарий слишком длинный." };
    }

    const db = await getDb();
    const settings = await getSettings();

    if (!settings.workingDays.includes(parsedDate.getDay())) {
      return {
        status: "error",
        message: "В этот день салон отдыхает. Выберите другой день.",
      };
    }

    const service = await db
      .collection("services")
      .findOne({ _id: new ObjectId(serviceId), active: true });

    if (!service) {
      return {
        status: "error",
        message: "Услуга больше недоступна. Выберите другую.",
      };
    }

    let stylistName = "Любой мастер";
    if (stylistId) {
      if (!ObjectId.isValid(stylistId)) {
        return { status: "error", message: "Выберите мастера из списка." };
      }
      const stylist = await db
        .collection("staff")
        .findOne({ _id: new ObjectId(stylistId), active: true });
      if (!stylist) {
        return {
          status: "error",
          message: "Мастер больше недоступен. Выберите другого.",
        };
      }
      stylistName = String(stylist.name ?? "");
    }

    const existingClientId = await getClientId();
    const clientId = existingClientId ?? createClientId();

    if (existingClientId) {
      const ownBooking = await getClientAppointment(existingClientId);
      if (ownBooking) {
        return {
          status: "error",
          message: `У вас уже есть активная запись на ${formatDate(ownBooking.date)} в ${ownBooking.time}. Отмените её на странице «Записаться», чтобы выбрать новое время.`,
        };
      }
    }

    const samePhoneBooking = await findActiveAppointmentByPhone(phone);
    if (samePhoneBooking) {
      return {
        status: "error",
        message:
          "На этот номер уже есть активная запись. Откройте страницу «Записаться» в том же браузере, где оформляли запись, чтобы отменить её или выбрать другое время.",
      };
    }

    await rememberClientId(clientId);

    await db.collection("appointments").insertOne({
      name,
      phone,
      phoneKey: phoneKey(phone),
      clientId,
      serviceId,
      serviceTitle: String(service.title ?? ""),
      stylistId,
      stylistName,
      date,
      time,
      comment,
      status: "new",
      createdAt: new Date(),
    });

    revalidatePath("/admin");
    revalidatePath("/admin/appointments");
  } catch (error) {
    console.error("Booking error", error);
    return {
      status: "error",
      message:
        "Не получилось отправить заявку. Позвоните нам — мы всё оформим вручную.",
    };
  }

  redirect("/book#booking");
}

export async function cancelMyAppointment(): Promise<void> {
  let result: "cancelled" | "missing" | "notfound" | "error" = "error";

  try {
    const clientId = await getClientId();

    if (!clientId) {
      result = "missing";
    } else {
      const db = await getDb();
      const updated = await db.collection("appointments").updateMany(
        {
          clientId,
          status: { $in: [...ACTIVE_APPOINTMENT_STATUSES] },
        },
        {
          $set: {
            status: "cancelled",
            cancelledBy: "client",
            cancelledAt: new Date(),
            updatedAt: new Date(),
          },
        },
      );
      result = updated.modifiedCount > 0 ? "cancelled" : "notfound";
    }
  } catch (error) {
    console.error("Cancel booking error", error);
  }

  revalidatePath("/book");
  revalidatePath("/admin");
  revalidatePath("/admin/appointments");

  redirect(`/book?cancel=${result}#booking`);
}
