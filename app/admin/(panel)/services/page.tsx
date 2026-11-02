import Link from "next/link";
import { ConfirmButton } from "@/components/admin/confirm-button";
import {
  createService,
  deleteService,
  updateService,
} from "@/lib/admin-actions";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { listServices } from "@/lib/data";
import { formatDuration, formatPrice } from "@/lib/format";

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: Promise<{
    edit?: string;
    saved?: string;
    error?: string;
  }>;
}) {
  const params = await searchParams;
  const services = await listServices();
  const editing = params.edit
    ? services.find((service) => service.id === params.edit)
    : undefined;

  return (
    <div className="admin-content">
      <header className="admin-page-head">
        <div>
          <h1>Услуги</h1>
          <p>
            Каталог цен: {services.length} позиций. Всё, что здесь включено,
            можно выбрать при записи.
          </p>
        </div>
        <div className="admin-head-actions">
          <Link href="/prices" className="btn btn-outline btn-sm" target="_blank">
            На сайте ↗
          </Link>
          {!editing && (
            <a href="#service-form" className="btn btn-dark btn-sm">
              + Добавить услугу
            </a>
          )}
        </div>
      </header>

      {params.error && (
        <p className="admin-note error" role="alert">
          {params.error}
        </p>
      )}
      {params.saved && (
        <p className="admin-note" role="status">
          Услуга сохранена.
        </p>
      )}

      <div className="admin-grid-2">
        <section className="admin-card">
          <div className="admin-card-head">
            <h2>Каталог</h2>
            <span className="admin-card-count">
              {services.filter((service) => service.active).length} активных
            </span>
          </div>
          <div className="admin-list">
            {services.map((service) => (
              <div className="admin-list-item" key={service.id}>
                <span className="admin-thumb admin-letter" aria-hidden>
                  {service.category.slice(0, 1)}
                </span>
                <div>
                  <div className="admin-item-title">
                    {service.title}
                    {service.popular && (
                      <span className="admin-star" title="Популярная услуга">
                        ★
                      </span>
                    )}
                    {!service.active && (
                      <span className="admin-inactive">скрыта</span>
                    )}
                  </div>
                  <div className="admin-item-meta">
                    {service.category} · {formatDuration(service.duration)} ·{" "}
                    {formatPrice(service.price)}
                  </div>
                </div>
                <div className="admin-list-actions">
                  <Link
                    href={`/admin/services?edit=${service.id}#service-form`}
                    className="mini-btn"
                  >
                    Изменить
                  </Link>
                  <form action={deleteService}>
                    <input type="hidden" name="id" value={service.id} />
                    <ConfirmButton message={`Удалить услугу «${service.title}»?`}>
                      Удалить
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            ))}
            {services.length === 0 && (
              <div className="admin-empty">
                Каталог пуст. Добавьте первую услугу в форме справа.
              </div>
            )}
          </div>
        </section>

        <section className="admin-card admin-form-card" id="service-form">
          <div className="admin-card-head">
            <h2>{editing ? "Редактировать услугу" : "Новая услуга"}</h2>
            {editing && (
              <Link href="/admin/services#service-form" className="mini-btn">
                Отмена
              </Link>
            )}
          </div>
          <div className="admin-card-body">
            <form
              className="admin-form"
              action={editing ? updateService : createService}
            >
              {editing && <input type="hidden" name="id" value={editing.id} />}

              <div className="field">
                <label htmlFor="title">
                  Название <span className="req">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  className="input"
                  defaultValue={editing?.title ?? ""}
                  placeholder="Например, женская стрижка"
                  required
                />
              </div>

              <div className="admin-form-row">
                <div className="field">
                  <label htmlFor="category">Категория</label>
                  <select
                    id="category"
                    name="category"
                    className="select"
                    defaultValue={editing?.category ?? SERVICE_CATEGORIES[0]}
                  >
                    {SERVICE_CATEGORIES.map((category) => (
                      <option value={category} key={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="price">
                    Цена, ₽ <span className="req">*</span>
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="50"
                    className="input"
                    defaultValue={editing?.price ?? 3000}
                    required
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="field">
                  <label htmlFor="duration">Длительность, мин</label>
                  <input
                    id="duration"
                    name="duration"
                    type="number"
                    min="5"
                    max="600"
                    step="5"
                    className="input"
                    defaultValue={editing?.duration ?? 60}
                  />
                </div>
                <div className="field">
                  <label htmlFor="order">Порядок</label>
                  <input
                    id="order"
                    name="order"
                    type="number"
                    min="0"
                    max="999"
                    className="input"
                    defaultValue={editing?.order ?? 0}
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="description">Описание</label>
                <textarea
                  id="description"
                  name="description"
                  className="textarea"
                  defaultValue={editing?.description ?? ""}
                  placeholder="Что входит в услугу и для кого она"
                />
              </div>

              <div className="checkbox-row">
                <label>
                  <input
                    type="checkbox"
                    name="popular"
                    defaultChecked={editing?.popular ?? false}
                  />
                  Популярная
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="active"
                    defaultChecked={editing?.active ?? true}
                  />
                  Показывать на сайте
                </label>
              </div>

              <button type="submit" className="btn btn-dark btn-sm">
                {editing ? "Сохранить изменения" : "Добавить услугу"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
