import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";

export const CLIENT_COOKIE = "kapriz_client";

const CLIENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const CLIENT_ID_PATTERN = /^[A-Za-z0-9_-]{32}$/;

export function createClientId(): string {
  return randomBytes(24).toString("base64url");
}

export async function getClientId(): Promise<string | null> {
  const store = await cookies();
  const value = store.get(CLIENT_COOKIE)?.value;

  return value && CLIENT_ID_PATTERN.test(value) ? value : null;
}

export async function rememberClientId(clientId: string): Promise<void> {
  const store = await cookies();

  store.set(CLIENT_COOKIE, clientId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CLIENT_COOKIE_MAX_AGE,
  });
}
