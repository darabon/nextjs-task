import Image from "next/image";
import Link from "next/link";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { createStaff, deleteStaff, updateStaff } from "@/lib/admin-actions";
import { listStaff } from "@/lib/data";

export default async function AdminStaffPage({
  searchParams,
}: {
  searchParams: Promise<{
    edit?: string;
    saved?: string;
    error?: string;
  }>;
}) {
  const params = await searchParams;
  const staff = await listStaff();
  const editing = params.edit
    ? staff.find((person) => person.id === params.edit)
    : undefined;

  return (
    <div className="admin-content">
      <header className="admin-page-head">
        <div>
          <h1>Мастера</h1>
          <p>
            Команда салона: {staff.length}{" "}
            {staff.length === 1 ? "человек" : "человека"}. Карточки показываются
            на странице «Наши сотрудники».
          </p>
        </div>
        <div className="admin-head-actions">
          <Link href="/team" className="btn btn-outline btn-sm" target="_blank">
            На сайте ↗
          </Link>
          {!editing && (
            <a href="#staff-form" className="btn btn-dark btn-sm">
              + Добавить мастера
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
          Карточка мастера сохранена.
        </p>
      )}

      <div className="admin-grid-2">
        <section className="admin-card">
          <div className="admin-card-head">
            <h2>Команда</h2>
            <span className="admin-card-count">
              {staff.filter((person) => person.active).length} на сайте
            </span>
          </div>
          <div className="admin-list">
            {staff.map((person) => (
              <div className="admin-list-item" key={person.id}>
                <span className="admin-thumb">
                  <Image
                    src={person.photo}
                    alt={person.name}
                    fill
                    sizes="52px"
                  />
                </span>
                <div>
                  <div className="admin-item-title">
                    {person.name}
                    {!person.active && (
                      <span className="admin-inactive">скрыт</span>
                    )}
                  </div>
                  <div className="admin-item-meta">
                    {person.role}
                    {person.experience ? ` · опыт ${person.experience}` : ""}
                  </div>
                  <div className="admin-tags">
                    {person.specialties.map((specialty) => (
                      <span key={specialty}>{specialty}</span>
                    ))}
                  </div>
                </div>
                <div className="admin-list-actions">
                  <Link
                    href={`/admin/staff?edit=${person.id}#staff-form`}
                    className="mini-btn"
                  >
                    Изменить
                  </Link>
                  <form action={deleteStaff}>
                    <input type="hidden" name="id" value={person.id} />
                    <ConfirmButton message={`Удалить мастера ${person.name}?`}>
                      Удалить
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            ))}
            {staff.length === 0 && (
              <div className="admin-empty">
                Команда пока не заполнена. Добавьте первого мастера.
              </div>
            )}
          </div>
        </section>

        <section className="admin-card admin-form-card" id="staff-form">
          <div className="admin-card-head">
            <h2>{editing ? "Редактировать мастера" : "Новый мастер"}</h2>
            {editing && (
              <Link href="/admin/staff#staff-form" className="mini-btn">
                Отмена
              </Link>
            )}
          </div>
          <div className="admin-card-body">
            <form
              className="admin-form"
              action={editing ? updateStaff : createStaff}
            >
              {editing && <input type="hidden" name="id" value={editing.id} />}

              <div className="admin-form-row">
                <div className="field">
                  <label htmlFor="name">
                    Имя <span className="req">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    className="input"
                    defaultValue={editing?.name ?? ""}
                    placeholder="Алиса Ветрова"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="role">
                    Роль <span className="req">*</span>
                  </label>
                  <input
                    id="role"
                    name="role"
                    className="input"
                    defaultValue={editing?.role ?? ""}
                    placeholder="Стилист-колорист"
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="photo">Фото — URL или путь</label>
                <input
                  id="photo"
                  name="photo"
                  className="input"
                  defaultValue={editing?.photo ?? "/images/team-alisa.jpg"}
                  placeholder="/images/team-alisa.jpg"
                />
                <span className="form-hint">
                  Локальные файлы лежат в <code>public/images</code>, можно
                  вставить ссылку с Unsplash.
                </span>
              </div>

              <div className="admin-form-row">
                <div className="field">
                  <label htmlFor="experience">Опыт</label>
                  <input
                    id="experience"
                    name="experience"
                    className="input"
                    defaultValue={editing?.experience ?? ""}
                    placeholder="7 лет"
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
                <label htmlFor="bio">О мастере</label>
                <textarea
                  id="bio"
                  name="bio"
                  className="textarea"
                  defaultValue={editing?.bio ?? ""}
                  placeholder="Пара живых предложений о характере и подходе"
                />
              </div>

              <div className="field">
                <label htmlFor="specialties">Специальности</label>
                <input
                  id="specialties"
                  name="specialties"
                  className="input"
                  defaultValue={editing?.specialties.join(", ") ?? ""}
                  placeholder="Блонд, стрижки, укладки"
                />
                <span className="form-hint">Через запятую.</span>
              </div>

              <div className="checkbox-row">
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
                {editing ? "Сохранить изменения" : "Добавить мастера"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
