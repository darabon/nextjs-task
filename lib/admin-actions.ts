"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertAdmin } from "@/lib/auth";
import {
  PORTFOLIO_TAGS,
  SERVICE_CATEGORIES,
  STATUS_ORDER,
} from "@/lib/constants";
import { getDb } from "@/lib/mongodb";
import type { AppointmentStatus } from "@/lib/types";

function text(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function int(formData: FormData, key: string, fallback = 0): number {
  const value = Number.parseInt(text(formData, key), 10);
  return Number.isFinite(value) ? value : fallback;
}

function bool(formData: FormData, key: string): boolean {
  return formData.get(key) === "on";
}

function objectId(formData: FormData, key: string): ObjectId | null {
  const value = text(formData, key);
  return ObjectId.isValid(value) ? new ObjectId(value) : null;
}

function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function finish(path: string): never {
  for (const sitePath of ["/", "/prices", "/team", "/portfolio", "/book"]) {
    revalidatePath(sitePath);
  }
  revalidatePath("/admin");
  redirect(`${path}?saved=1`);
}

/* ---------- услуги ---------- */

function servicePayload(formData: FormData, path: string) {
  const title = text(formData, "title");
  const category = text(formData, "category");
  const price = int(formData, "price");
  const duration = int(formData, "duration");
  const order = int(formData, "order");
  const description = text(formData, "description");

  if (title.length < 2 || title.length > 80) {
    fail(path, "Название услуги — от 2 до 80 символов.");
  }
  if (!SERVICE_CATEGORIES.includes(category as never)) {
    fail(path, "Выберите категорию из списка.");
  }
  if (price < 0 || price > 1_000_000) {
    fail(path, "Укажите корректную цену.");
  }
  if (duration < 5 || duration > 600) {
    fail(path, "Длительность — от 5 до 600 минут.");
  }
  if (description.length > 500) {
    fail(path, "Описание — не больше 500 символов.");
  }

  return {
    title,
    category,
    price: Math.round(price),
    duration: Math.round(duration),
    description,
    order: Math.max(0, Math.min(999, Math.round(order))),
    popular: bool(formData, "popular"),
    active: bool(formData, "active"),
  };
}

export async function createService(formData: FormData): Promise<void> {
  await assertAdmin();
  const payload = servicePayload(formData, "/admin/services");
  const db = await getDb();
  await db.collection("services").insertOne({
    ...payload,
    createdAt: new Date(),
  });
  finish("/admin/services");
}

export async function updateService(formData: FormData): Promise<void> {
  await assertAdmin();
  const id = objectId(formData, "id");
  if (!id) fail("/admin/services", "Услуга не найдена.");
  const payload = servicePayload(formData, "/admin/services");
  const db = await getDb();
  await db
    .collection("services")
    .updateOne({ _id: id }, { $set: { ...payload, updatedAt: new Date() } });
  finish("/admin/services");
}

export async function deleteService(formData: FormData): Promise<void> {
  await assertAdmin();
  const id = objectId(formData, "id");
  if (!id) fail("/admin/services", "Услуга не найдена.");
  const db = await getDb();
  await db.collection("services").deleteOne({ _id: id });
  finish("/admin/services");
}

/* ---------- мастера ---------- */

function staffPayload(formData: FormData, path: string) {
  const name = text(formData, "name");
  const role = text(formData, "role");
  const photo = text(formData, "photo") || "/images/salon.jpg";
  const experience = text(formData, "experience");
  const bio = text(formData, "bio");
  const order = int(formData, "order");
  const specialties = text(formData, "specialties")
    .split(/[,;\n]/)
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 8);

  if (name.length < 2 || name.length > 60) {
    fail(path, "Имя мастера — от 2 до 60 символов.");
  }
  if (role.length < 2 || role.length > 60) {
    fail(path, "Укажите специализацию мастера.");
  }
  if (bio.length > 600) {
    fail(path, "Описание — не больше 600 символов.");
  }

  return {
    name,
    role,
    photo,
    experience,
    bio,
    specialties,
    order: Math.max(0, Math.min(999, Math.round(order))),
    active: bool(formData, "active"),
  };
}

export async function createStaff(formData: FormData): Promise<void> {
  await assertAdmin();
  const payload = staffPayload(formData, "/admin/staff");
  const db = await getDb();
  await db.collection("staff").insertOne({ ...payload, createdAt: new Date() });
  finish("/admin/staff");
}

export async function updateStaff(formData: FormData): Promise<void> {
  await assertAdmin();
  const id = objectId(formData, "id");
  if (!id) fail("/admin/staff", "Мастер не найден.");
  const payload = staffPayload(formData, "/admin/staff");
  const db = await getDb();
  await db
    .collection("staff")
    .updateOne({ _id: id }, { $set: { ...payload, updatedAt: new Date() } });
  finish("/admin/staff");
}

export async function deleteStaff(formData: FormData): Promise<void> {
  await assertAdmin();
  const id = objectId(formData, "id");
  if (!id) fail("/admin/staff", "Мастер не найден.");
  const db = await getDb();
  await db.collection("staff").deleteOne({ _id: id });
  finish("/admin/staff");
}

/* ---------- портфолио ---------- */

function portfolioPayload(formData: FormData, path: string) {
  const title = text(formData, "title");
  const tag = text(formData, "tag");
  const image = text(formData, "image");
  const description = text(formData, "description");
  const stylist = text(formData, "stylist");
  const order = int(formData, "order");

  if (title.length < 2 || title.length > 90) {
    fail(path, "Название работы — от 2 до 90 символов.");
  }
  if (!PORTFOLIO_TAGS.includes(tag as never)) {
    fail(path, "Выберите категорию работы.");
  }
  if (!image) {
    fail(path, "Укажите ссылку на изображение.");
  }
  if (description.length > 400) {
    fail(path, "Описание — не больше 400 символов.");
  }

  return {
    title,
    tag,
    image,
    description,
    stylist,
    order: Math.max(0, Math.min(999, Math.round(order))),
    active: bool(formData, "active"),
  };
}

export async function createPortfolio(formData: FormData): Promise<void> {
  await assertAdmin();
  const payload = portfolioPayload(formData, "/admin/portfolio");
  const db = await getDb();
  await db
    .collection("portfolio")
    .insertOne({ ...payload, createdAt: new Date() });
  finish("/admin/portfolio");
}

export async function updatePortfolio(formData: FormData): Promise<void> {
  await assertAdmin();
  const id = objectId(formData, "id");
  if (!id) fail("/admin/portfolio", "Работа не найдена.");
  const payload = portfolioPayload(formData, "/admin/portfolio");
  const db = await getDb();
  await db
    .collection("portfolio")
    .updateOne({ _id: id }, { $set: { ...payload, updatedAt: new Date() } });
  finish("/admin/portfolio");
}

export async function deletePortfolio(formData: FormData): Promise<void> {
  await assertAdmin();
  const id = objectId(formData, "id");
  if (!id) fail("/admin/portfolio", "Работа не найдена.");
  const db = await getDb();
  await db.collection("portfolio").deleteOne({ _id: id });
  finish("/admin/portfolio");
}

/* ---------- записи ---------- */

export async function setAppointmentStatus(formData: FormData): Promise<void> {
  await assertAdmin();
  const id = objectId(formData, "id");
  const status = text(formData, "status") as AppointmentStatus;
  if (!id) fail("/admin/appointments", "Запись не найдена.");
  if (!STATUS_ORDER.includes(status as never)) {
    fail("/admin/appointments", "Неизвестный статус записи.");
  }

  const db = await getDb();
  await db
    .collection("appointments")
    .updateOne(
      { _id: id },
      { $set: { status, updatedAt: new Date() } },
    );
  finish("/admin/appointments");
}

export async function deleteAppointment(formData: FormData): Promise<void> {
  await assertAdmin();
  const id = objectId(formData, "id");
  if (!id) fail("/admin/appointments", "Запись не найдена.");
  const db = await getDb();
  await db.collection("appointments").deleteOne({ _id: id });
  finish("/admin/appointments");
}

/* ---------- настройки ---------- */

export async function saveSettings(formData: FormData): Promise<void> {
  await assertAdmin();
  const path = "/admin/settings";

  const phone = text(formData, "phone");
  const address = text(formData, "address");
  const email = text(formData, "email");
  const hours = text(formData, "hours");
  const dayOffLabel = text(formData, "dayOffLabel");
  const workingDays = formData
    .getAll("workingDays")
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value >= 0 && value <= 6);
  const phoneHref =
    text(formData, "phoneHref") ||
    `tel:${phone.replace(/[^\d+]/g, "")}`;

  if (phone.length < 5) fail(path, "Укажите телефон салона.");
  if (address.length < 5) fail(path, "Укажите адрес салона.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fail(path, "Проверьте email.");
  }
  if (!hours) fail(path, "Укажите часы работы.");

  const db = await getDb();
  await db.collection("settings").updateOne(
    { _id: "site" as never },
    {
      $set: {
        phone,
        phoneHref,
        address,
        email,
        hours,
        dayOffLabel,
        workingDays: Array.from(new Set(workingDays)).sort(),
        socials: {
          instagram: text(formData, "instagram"),
          telegram: text(formData, "telegram"),
          vk: text(formData, "vk"),
        },
        updatedAt: new Date(),
      },
    },
    { upsert: true },
  );

  finish(path);
}
