"use server";

import { redirect } from "next/navigation";
import { loginAdmin, logoutAdmin } from "@/lib/auth";

export async function loginAction(formData: FormData): Promise<void> {
  const login = String(formData.get("login") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const success = await loginAdmin(login, password);
  if (!success) redirect("/admin/login?error=1");
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await logoutAdmin();
  redirect("/admin/login");
}
