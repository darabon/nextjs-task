import { ObjectId } from "mongodb";
import { ACTIVE_APPOINTMENT_STATUSES } from "@/lib/constants";
import { phoneKey, todayISO } from "@/lib/format";
import { getDb } from "@/lib/mongodb";
import type {
  Appointment,
  AppointmentStatus,
  PortfolioItem,
  Service,
  Settings,
  Staff,
} from "@/lib/types";

const DEFAULT_SETTINGS: Settings = {
  phone: "+7 (921) 555-14-08",
  phoneHref: "tel:+79215551408",
  address: "Санкт-Петербург, ул. Гагаринская, 14",
  email: "hello@kapriz.studio",
  hours: "Пн–Сб, 10:00–21:00",
  dayOffLabel: "Вс — выходной",
  workingDays: [1, 2, 3, 4, 5, 6],
  socials: {
    instagram: "https://instagram.com",
    telegram: "https://t.me",
    vk: "https://vk.com",
  },
};

const idOf = (value: { _id?: unknown }): string => String(value._id ?? "");

export function toObjectId(value: string): ObjectId | null {
  return ObjectId.isValid(value) ? new ObjectId(value) : null;
}

export async function listServices(activeOnly = false): Promise<Service[]> {
  const db = await getDb();
  const docs = await db
    .collection("services")
    .find(activeOnly ? { active: true } : {})
    .sort({ order: 1, title: 1 })
    .toArray();

  return docs.map((doc) => ({
    id: idOf(doc),
    title: String(doc.title ?? ""),
    category: String(doc.category ?? ""),
    description: String(doc.description ?? ""),
    price: Number(doc.price ?? 0),
    duration: Number(doc.duration ?? 0),
    popular: Boolean(doc.popular),
    order: Number(doc.order ?? 0),
    active: doc.active !== false,
  }));
}

export async function listStaff(activeOnly = false): Promise<Staff[]> {
  const db = await getDb();
  const docs = await db
    .collection("staff")
    .find(activeOnly ? { active: true } : {})
    .sort({ order: 1, name: 1 })
    .toArray();

  return docs.map((doc) => ({
    id: idOf(doc),
    name: String(doc.name ?? ""),
    role: String(doc.role ?? ""),
    photo: String(doc.photo ?? ""),
    experience: String(doc.experience ?? ""),
    bio: String(doc.bio ?? ""),
    specialties: Array.isArray(doc.specialties)
      ? doc.specialties.map(String)
      : [],
    order: Number(doc.order ?? 0),
    active: doc.active !== false,
  }));
}

export async function listPortfolio(
  activeOnly = false,
): Promise<PortfolioItem[]> {
  const db = await getDb();
  const docs = await db
    .collection("portfolio")
    .find(activeOnly ? { active: true } : {})
    .sort({ order: 1, title: 1 })
    .toArray();

  return docs.map((doc) => ({
    id: idOf(doc),
    title: String(doc.title ?? ""),
    tag: String(doc.tag ?? ""),
    image: String(doc.image ?? ""),
    description: String(doc.description ?? ""),
    stylist: String(doc.stylist ?? ""),
    order: Number(doc.order ?? 0),
    active: doc.active !== false,
  }));
}

function mapAppointment(doc: Record<string, unknown>): Appointment {
  const createdAt =
    doc.createdAt instanceof Date
      ? doc.createdAt.toISOString()
      : doc.createdAt
        ? new Date(String(doc.createdAt)).toISOString()
        : "";

  return {
    id: idOf(doc),
    name: String(doc.name ?? ""),
    phone: String(doc.phone ?? ""),
    serviceId: String(doc.serviceId ?? ""),
    serviceTitle: String(doc.serviceTitle ?? ""),
    stylistId: String(doc.stylistId ?? ""),
    stylistName: String(doc.stylistName ?? ""),
    date: String(doc.date ?? ""),
    time: String(doc.time ?? ""),
    comment: String(doc.comment ?? ""),
    status: (doc.status ?? "new") as AppointmentStatus,
    createdAt,
  };
}

function activeFilter() {
  return {
    status: { $in: [...ACTIVE_APPOINTMENT_STATUSES] },
    date: { $gte: todayISO() },
  };
}

export async function getClientAppointment(
  clientId: string,
): Promise<Appointment | null> {
  const db = await getDb();
  const doc = await db.collection("appointments").findOne(
    { ...activeFilter(), clientId },
    { sort: { date: 1, time: 1 } },
  );

  return doc ? mapAppointment(doc) : null;
}

export async function findActiveAppointmentByPhone(
  phone: string,
): Promise<Appointment | null> {
  const key = phoneKey(phone);
  const db = await getDb();
  const collection = db.collection("appointments");

  let doc = await collection.findOne(
    { ...activeFilter(), phoneKey: key },
    { sort: { date: 1, time: 1 } },
  );

  // Записи, созданные до появления phoneKey, ищем по нормализованному номеру.
  if (!doc) {
    const legacy = await collection
      .find({ ...activeFilter(), phoneKey: { $exists: false } })
      .sort({ date: 1, time: 1 })
      .toArray();
    doc = legacy.find((item) => phoneKey(String(item.phone ?? "")) === key) ?? null;
  }

  return doc ? mapAppointment(doc) : null;
}

export async function listAppointments(
  status?: AppointmentStatus,
): Promise<Appointment[]> {
  const db = await getDb();
  const docs = await db
    .collection("appointments")
    .find(status ? { status } : {})
    .sort({ createdAt: -1 })
    .limit(200)
    .toArray();

  return docs.map(mapAppointment);
}

export async function listUpcomingAppointments(
  limit = 6,
): Promise<Appointment[]> {
  const db = await getDb();
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  const today = new Date(now.getTime() - offset).toISOString().slice(0, 10);
  const docs = await db
    .collection("appointments")
    .find({
      date: { $gte: today },
      status: { $in: ["new", "confirmed"] },
    })
    .sort({ date: 1, time: 1 })
    .limit(limit)
    .toArray();

  return docs.map(mapAppointment);
}

export async function getSettings(): Promise<Settings> {
  const db = await getDb();
  const doc = await db.collection("settings").findOne({ _id: "site" as never });
  if (!doc) return DEFAULT_SETTINGS;

  return {
    phone: String(doc.phone ?? DEFAULT_SETTINGS.phone),
    phoneHref: String(doc.phoneHref ?? DEFAULT_SETTINGS.phoneHref),
    address: String(doc.address ?? DEFAULT_SETTINGS.address),
    email: String(doc.email ?? DEFAULT_SETTINGS.email),
    hours: String(doc.hours ?? DEFAULT_SETTINGS.hours),
    dayOffLabel: String(doc.dayOffLabel ?? DEFAULT_SETTINGS.dayOffLabel),
    workingDays: Array.isArray(doc.workingDays)
      ? doc.workingDays.map(Number)
      : DEFAULT_SETTINGS.workingDays,
    socials: {
      instagram: String(doc.socials?.instagram ?? ""),
      telegram: String(doc.socials?.telegram ?? ""),
      vk: String(doc.socials?.vk ?? ""),
    },
  };
}

export async function getAdminStats() {
  const db = await getDb();
  const [newAppointments, services, staff, works, totalAppointments] =
    await Promise.all([
      db.collection("appointments").countDocuments({ status: "new" }),
      db.collection("services").countDocuments(),
      db.collection("staff").countDocuments(),
      db.collection("portfolio").countDocuments(),
      db.collection("appointments").countDocuments(),
    ]);

  return { newAppointments, services, staff, works, totalAppointments };
}
