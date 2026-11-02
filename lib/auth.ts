import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "kapriz_admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function secret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "kapriz-dev-secret"
  );
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) {
    timingSafeEqual(left, left);
    return false;
  }
  return timingSafeEqual(left, right);
}

export function createToken(login: string): string {
  const payload = `${login}.${Date.now() + MAX_AGE_SECONDS * 1000}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token: string | undefined): string | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [login, expiresRaw, signature] = parts;
  if (!safeEqual(signature, sign(`${login}.${expiresRaw}`))) return null;
  const expires = Number(expiresRaw);
  if (!Number.isFinite(expires) || expires < Date.now()) return null;
  return login;
}

export async function getAdmin(): Promise<string | null> {
  const store = await cookies();
  return verifyToken(store.get(COOKIE_NAME)?.value);
}

export async function requireAdmin(): Promise<string> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export async function assertAdmin(): Promise<void> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
}

export async function loginAdmin(
  login: string,
  password: string,
): Promise<boolean> {
  const expectedLogin = process.env.ADMIN_LOGIN || "admin";
  const expectedPassword = process.env.ADMIN_PASSWORD || "kapriz2026";
  const valid =
    safeEqual(login, expectedLogin) && safeEqual(password, expectedPassword);
  if (!valid) return false;

  const store = await cookies();
  store.set(COOKIE_NAME, createToken(login), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
  return true;
}

export async function logoutAdmin(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
