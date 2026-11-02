import Image from "next/image";
import Link from "next/link";
import { ConfirmButton } from "@/components/admin/confirm-button";
import {
  createPortfolio,
  deletePortfolio,
  updatePortfolio,
} from "@/lib/admin-actions";
import { PORTFOLIO_TAGS } from "@/lib/constants";
import { listPortfolio } from "@/lib/data";

export default async function AdminPortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{
    edit?: string;
    saved?: string;
    error?: string;
  }>;
}) {
  const params = await searchParams;
  const works = await listPortfolio();
  const editing = params.edit
    ? works.find((work) => work.id === params.edit)
    : undefined;

  return (
    <div className="admin-content">
      <header className="admin-page-head">
        <div>
          <h1>Портфолио</h1>
          <p>
            {works.length} работ. Первые девять попадают в карусель на главной,
            все активные — на страницу «Портфолио».
          </p>
        </div>
        <div className="admin-head-actions">
          <Link
            href="/portfolio"
            className="btn btn-outline btn-sm"
            target="_blank"
          >
            На сайте ↗
          </Link>
          {!editing && (
            <a href="#work-form" className="btn btn-dark btn-sm">
              + Добавить работу
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
          Работа сохранена.
        </p>
      )}

      <div className="admin-grid-2">
        <section className="admin-card">
          <div className="admin-card-head">
            <h2>Работы</h2>
            <span className="admin-card-count">
              {works.filter((work) => work.active).length} на сайте
            </span>
          </div>
          <div className="admin-list">
            {works.map((work) => (
              <div className="admin-list-item" key={work.id}>
                <span className="admin-thumb">
                  <Image
                    src={work.image}
                    alt={work.title}
                    fill
                    sizes="52px"
                  />
                </span>
                <div>
                  <div className="admin-item-title">
                    {work.title}
                    {!work.active && (
                      <span className="admin-inactive">скрыта</span>
                    )}
                  </div>
                  <div className="admin-item-meta">
                    {work.tag}
                    {work.stylist ? ` · ${work.stylist}` : ""}
                  </div>
                </div>
                <div className="admin-list-actions">
                  <Link
                    href={`/admin/portfolio?edit=${work.id}#work-form`}
                    className="mini-btn"
                  >
                    Изменить
                  </Link>
                  <form action={deletePortfolio}>
                    <input type="hidden" name="id" value={work.id} />
                    <ConfirmButton message={`Удалить работу «${work.title}»?`}>
                      Удалить
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            ))}
            {works.length === 0 && (
              <div className="admin-empty">
                Портфолио пусто. Добавьте первую работу.
              </div>
            )}
          </div>
        </section>

        <section className="admin-card admin-form-card" id="work-form">
          <div className="admin-card-head">
            <h2>{editing ? "Редактировать работу" : "Новая работа"}</h2>
            {editing && (
              <Link href="/admin/portfolio#work-form" className="mini-btn">
                Отмена
              </Link>
            )}
          </div>
          <div className="admin-card-body">
            <form
              className="admin-form"
              action={editing ? updatePortfolio : createPortfolio}
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
                  placeholder="Мягкие кудри и розовый свет"
                  required
                />
              </div>

              <div className="admin-form-row">
                <div className="field">
                  <label htmlFor="tag">Категория</label>
                  <select
                    id="tag"
                    name="tag"
                    className="select"
                    defaultValue={editing?.tag ?? PORTFOLIO_TAGS[0]}
                  >
                    {PORTFOLIO_TAGS.map((tag) => (
                      <option value={tag} key={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="stylist">Мастер</label>
                  <input
                    id="stylist"
                    name="stylist"
                    className="input"
                    defaultValue={editing?.stylist ?? ""}
                    placeholder="Алиса Ветрова"
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="image">
                  Изображение <span className="req">*</span>
                </label>
                <input
                  id="image"
                  name="image"
                  className="input"
                  defaultValue={editing?.image ?? "/images/hairstyle-1.png"}
                  placeholder="/images/hairstyle-1.png"
                  required
                />
                <span className="form-hint">
                  Путь из <code>public/images</code> или ссылка на изображение.
                </span>
              </div>

              {editing && (
                <div className="admin-image-preview">
                  <Image
                    src={editing.image}
                    alt={editing.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 320px"
                  />
                </div>
              )}

              <div className="field">
                <label htmlFor="description">Подпись</label>
                <textarea
                  id="description"
                  name="description"
                  className="textarea"
                  defaultValue={editing?.description ?? ""}
                  placeholder="Пара слов об образе"
                />
              </div>

              <div className="admin-form-row">
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
                <div className="field">
                  <label>Видимость</label>
                  <label className="admin-switch">
                    <input
                      type="checkbox"
                      name="active"
                      defaultChecked={editing?.active ?? true}
                    />
                    <span>Показывать на сайте</span>
                  </label>
                </div>
              </div>

              <button type="submit" className="btn btn-dark btn-sm">
                {editing ? "Сохранить изменения" : "Добавить работу"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
