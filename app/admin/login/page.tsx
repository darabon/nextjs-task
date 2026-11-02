import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { loginAction } from "@/app/admin/actions";
import { Bow, PixelHeart, Sparkle } from "@/components/decor";
import { Logo } from "@/components/logo";
import { getAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Вход",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const admin = await getAdmin();
  if (admin) redirect("/admin");
  const params = await searchParams;

  return (
    <div className="login-page">
      <Bow className="login-decor login-decor-bow decor-sway" variant="pink" />
      <Sparkle
        className="login-decor login-decor-sparkle decor-twinkle"
        color="#f08fb3"
        size={90}
      />
      <PixelHeart
        className="login-decor login-decor-heart decor-float"
        color="#b83a72"
        size={64}
      />

      <div className="login-card">
        <Logo />
        <h1>С возвращением!</h1>
        <p>
          Вход в админ-панель «каприз». Здесь живут записи, услуги, мастера и
          расписание.
        </p>

        <form className="login-form" action={loginAction}>
          {params.error && (
            <p className="form-error" role="alert">
              Неверный логин или пароль.
            </p>
          )}
          <div className="field">
            <label htmlFor="login">Логин</label>
            <input
              id="login"
              name="login"
              className="input"
              autoComplete="username"
              defaultValue="admin"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              name="password"
              type="password"
              className="input"
              autoComplete="current-password"
              required
            />
          </div>
          <button type="submit" className="btn btn-dark" style={{ marginTop: 8 }}>
            Войти
          </button>
        </form>

        <Link href="/" className="login-back">
          ← Вернуться на сайт
        </Link>
      </div>

      <style>{`
        .login-decor-bow { left: 7%; top: 10%; width: 160px; height: auto; }
        .login-decor-sparkle { right: 10%; top: 14%; width: 90px; }
        .login-decor-heart { right: 16%; bottom: 10%; width: 64px; }
      `}</style>
    </div>
  );
}
