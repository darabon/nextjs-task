export const WEEKDAYS = [
  { n: 1, short: "Пн", full: "Понедельник" },
  { n: 2, short: "Вт", full: "Вторник" },
  { n: 3, short: "Ср", full: "Среда" },
  { n: 4, short: "Чт", full: "Четверг" },
  { n: 5, short: "Пт", full: "Пятница" },
  { n: 6, short: "Сб", full: "Суббота" },
  { n: 0, short: "Вс", full: "Воскресенье" },
] as const;

export const SERVICE_CATEGORIES = [
  "Стрижки",
  "Окрашивание",
  "Укладки",
  "Уход",
] as const;

export const PORTFOLIO_TAGS = ["Стрижка", "Окрашивание", "Укладка"] as const;

export const STATUS_LABELS = {
  new: "Новая",
  confirmed: "Подтверждена",
  done: "Выполнена",
  cancelled: "Отменена",
} as const;

export const STATUS_ORDER = ["new", "confirmed", "done", "cancelled"] as const;

export const NAV_LINKS = [
  { href: "/team", label: "Наши сотрудники" },
  { href: "/prices", label: "Каталог цен" },
  { href: "/portfolio", label: "Портфолио" },
] as const;
