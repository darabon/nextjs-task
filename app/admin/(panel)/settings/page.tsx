import Link from "next/link";
import { PixelHeart } from "@/components/decor";
import { saveSettings } from "@/lib/admin-actions";
import { WEEKDAYS } from "@/lib/constants";
import { getSettings } from "@/lib/data";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  const settings = await getSettings();

  return (
    <div className="admin-content">
      <header className="admin-page-head">
        <div>
          <h1>Расписание и контакты</h1>
          <p>
            Эти данные видны в шапке, футере, на главной и в форме записи.
            Выходные дни блокируют запись на сайте.
          </p>
        </div>
        <Link href="/" className="btn btn-outline btn-sm" target="_blank">
          Посмотреть сайт ↗
        </Link>
      </header>

      {params.error && (
        <p className="admin-note error" role="alert">
          {params.error}
        </p>
      )}
      {params.saved && (
        <p className="admin-note" role="status">
          Настройки сохранены.
        </p>
      )}

      <div className="admin-grid-2">
        <section className="admin-card">
          <div className="admin-card-head">
            <h2>Настройки сайта</h2>
            <PixelHeart size={20} color="#f08fb3" />
          </div>
          <div className="admin-card-body">
            <form className="admin-form" action={saveSettings}>
              <div className="admin-form-section">
                <h3>Контакты</h3>
                <div className="admin-form-row">
                  <div className="field">
                    <label htmlFor="phone">
                      Телефон <span className="req">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      className="input"
                      defaultValue={settings.phone}
                      placeholder="+7 (921) 555-14-08"
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="phoneHref">Ссылка телефона</label>
                    <input
                      id="phoneHref"
                      name="phoneHref"
                      className="input"
                      defaultValue={settings.phoneHref}
                      placeholder="tel:+79215551408"
                    />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="email">
                    Email <span className="req">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="input"
                    defaultValue={settings.email}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="address">
                    Адрес <span className="req">*</span>
                  </label>
                  <input
                    id="address"
                    name="address"
                    className="input"
                    defaultValue={settings.address}
                    required
                  />
                </div>
              </div>

              <div className="admin-form-section">
                <h3>График</h3>
                <div className="admin-form-row">
                  <div className="field">
                    <label htmlFor="hours">Часы работы</label>
                    <input
                      id="hours"
                      name="hours"
                      className="input"
                      defaultValue={settings.hours}
                      placeholder="Пн–Сб, 10:00–21:00"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="dayOffLabel">Подпись выходного</label>
                    <input
                      id="dayOffLabel"
                      name="dayOffLabel"
                      className="input"
                      defaultValue={settings.dayOffLabel}
                      placeholder="Вс — выходной"
                    />
                  </div>
                </div>

                <div className="field">
                  <label>Рабочие дни</label>
                  <div className="admin-days">
                    {WEEKDAYS.map((day) => (
                      <label className="admin-day" key={day.n}>
                        <input
                          type="checkbox"
                          name="workingDays"
                          value={day.n}
                          defaultChecked={settings.workingDays.includes(day.n)}
                        />
                        {day.full}
                      </label>
                    ))}
                  </div>
                  <span className="form-hint">
                    В нерабочие дни форма записи не даст выбрать дату.
                  </span>
                </div>
              </div>

              <div className="admin-form-section">
                <h3>Соцсети</h3>
                <div className="field">
                  <label htmlFor="instagram">Instagram</label>
                  <input
                    id="instagram"
                    name="instagram"
                    className="input"
                    defaultValue={settings.socials.instagram}
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div className="admin-form-row">
                  <div className="field">
                    <label htmlFor="telegram">Telegram</label>
                    <input
                      id="telegram"
                      name="telegram"
                      className="input"
                      defaultValue={settings.socials.telegram}
                      placeholder="https://t.me/..."
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="vk">VK</label>
                    <input
                      id="vk"
                      name="vk"
                      className="input"
                      defaultValue={settings.socials.vk}
                      placeholder="https://vk.com/..."
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-dark btn-sm">
                Сохранить настройки
              </button>
            </form>
          </div>
        </section>

        <aside className="admin-stack">
          <section className="admin-card">
            <div className="admin-card-head">
              <h2>Как это выглядит</h2>
            </div>
            <div className="admin-card-body">
              <div className="admin-preview">
                <span className="admin-preview-label">Контакты на сайте</span>
                <strong>{settings.phone}</strong>
                <p>{settings.address}</p>
                <p>{settings.email}</p>
              </div>
              <div className="admin-preview">
                <span className="admin-preview-label">Расписание</span>
                <strong>{settings.hours}</strong>
                <p>{settings.dayOffLabel}</p>
              </div>
            </div>
          </section>

          <section className="admin-card">
            <div className="admin-card-head">
              <h2>Подсказка</h2>
            </div>
            <div className="admin-card-body admin-help">
              <p>
                Телефон и адрес подставляются в шапку, футер, страницу записи и
                блок «Где мы». Если меняете номер — обновите и ссылку
                <code> tel: </code>, чтобы кнопка звонка работала.
              </p>
              <p>
                Пока на сайте есть только демо-записи — их можно удалить в
                разделе «Записи».
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
