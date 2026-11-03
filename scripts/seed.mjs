import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";
const dbName = process.env.MONGODB_DB ?? "kapriz";

function isoDaysFromNow(days) {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  const target = new Date(now.getTime() + days * 86_400_000 - offset);
  return target.toISOString().slice(0, 10);
}

const staff = [
  {
    name: "Алиса Ветрова",
    role: "Стилист-колорист",
    photo: "/images/team-alisa.jpg",
    experience: "8 лет",
    bio: "Сложный блонд, мягкие переходы и цвет, который не хочется прятать под шапкой. Сначала слушает, потом колдует.",
    specialties: ["Блонд", "AirTouch", "Уход"],
    order: 1,
    active: true,
  },
  {
    name: "Марго Соколова",
    role: "Барбер-стилист",
    photo: "/images/team-margo.jpg",
    experience: "6 лет",
    bio: "Короткие формы, чёлки и текстура, которой легко управлять утром. Верит, что хорошая стрижка — это про свободу.",
    specialties: ["Стрижки", "Текстура", "Укладки"],
    order: 2,
    active: true,
  },
  {
    name: "Тимур Белов",
    role: "Стилист-универсал",
    photo: "/images/team-timur.jpg",
    experience: "9 лет",
    bio: "Одинаково уверенно работает с классикой и экспериментами. Любит точные линии и честные пропорции.",
    specialties: ["Классика", "Фейд", "Стайлинг"],
    order: 3,
    active: true,
  },
  {
    name: "Ника Орлова",
    role: "Стилист по укладкам",
    photo: "/images/team-nika.jpg",
    experience: "5 лет",
    bio: "Локоны, объём и причёски для важных вечеров. Умеет сделать так, чтобы всё держалось до последнего танца.",
    specialties: ["Локоны", "Вечерние причёски", "Свадебный образ"],
    order: 4,
    active: true,
  },
];

const services = [
  {
    title: "Женская стрижка",
    category: "Стрижки",
    description:
      "Консультация, мытьё, стрижка и лёгкая укладка. Форма, с которой хочется жить каждый день.",
    price: 4200,
    duration: 60,
    popular: true,
    order: 1,
    active: true,
  },
  {
    title: "Мужская стрижка",
    category: "Стрижки",
    description:
      "Классика или современная форма, окантовка и стайлинг. Без лишнего пафоса и неловких пауз.",
    price: 2800,
    duration: 45,
    popular: false,
    order: 2,
    active: true,
  },
  {
    title: "Стрижка «под ножницы»",
    category: "Стрижки",
    description:
      "Точная работа ножницами без машинки: мягкая форма, живая текстура и аккуратные концы.",
    price: 3600,
    duration: 50,
    popular: false,
    order: 3,
    active: true,
  },
  {
    title: "Детская стрижка",
    category: "Стрижки",
    description:
      "Первая стрижка без слёз — с мультиком, зеркалом и терпением. Для гостей до 10 лет.",
    price: 2200,
    duration: 40,
    popular: false,
    order: 4,
    active: true,
  },
  {
    title: "Чёлка",
    category: "Стрижки",
    description:
      "Обновить чёлку между визитами — быстро и без записи на полную стрижку.",
    price: 900,
    duration: 20,
    popular: false,
    order: 5,
    active: true,
  },
  {
    title: "Стрижка + укладка",
    category: "Стрижки",
    description:
      "Полный образ за один визит: стрижка и укладка, с которой можно сразу пойти на встречу.",
    price: 5900,
    duration: 90,
    popular: true,
    order: 6,
    active: true,
  },
  {
    title: "Тонирование",
    category: "Окрашивание",
    description:
      "Свежий оттенок и блеск без глубокого вмешательства. Отлично для первого окрашивания.",
    price: 4500,
    duration: 90,
    popular: false,
    order: 7,
    active: true,
  },
  {
    title: "Полное окрашивание",
    category: "Окрашивание",
    description:
      "Цвет в один тон или с мягкими переходами. Включает консультацию и уход после окрашивания.",
    price: 7200,
    duration: 150,
    popular: false,
    order: 8,
    active: true,
  },
  {
    title: "AirTouch / мелирование",
    category: "Окрашивание",
    description:
      "Воздушные переходы, блики и объём. Для тех, кто хочет блонд, но боится «жёстких» полос.",
    price: 8900,
    duration: 180,
    popular: true,
    order: 9,
    active: true,
  },
  {
    title: "Фантазийный цвет",
    category: "Окрашивание",
    description:
      "Розовый, лавандовый, мятный — любой оттенок, который хочется попробовать. Цена зависит от длины.",
    price: 9500,
    duration: 180,
    popular: false,
    order: 10,
    active: true,
  },
  {
    title: "Укладка «как из Pinterest»",
    category: "Укладки",
    description:
      "Мягкие волны, текстурные пряди и лёгкий беспорядок. Идеально для фото и свиданий.",
    price: 2500,
    duration: 45,
    popular: true,
    order: 11,
    active: true,
  },
  {
    title: "Локоны",
    category: "Укладки",
    description:
      "От романтичных спиралей до крупных волн. Держится вечер и ещё немного утра.",
    price: 3200,
    duration: 60,
    popular: false,
    order: 12,
    active: true,
  },
  {
    title: "Вечерняя причёска",
    category: "Укладки",
    description:
      "Пучки, косы и сложные формы для особого события. Обсудим референс заранее.",
    price: 4800,
    duration: 90,
    popular: false,
    order: 13,
    active: true,
  },
  {
    title: "Ботокс для волос",
    category: "Уход",
    description:
      "Увлажнение, гладкость и блеск без утяжеления. Волосы выглядят ухоженными даже без укладки.",
    price: 5200,
    duration: 120,
    popular: false,
    order: 14,
    active: true,
  },
  {
    title: "Кератиновое выпрямление",
    category: "Уход",
    description:
      "Дисциплина для непослушных волос: меньше пуха, больше блеска. Результат — до трёх месяцев.",
    price: 8900,
    duration: 180,
    popular: false,
    order: 15,
    active: true,
  },
  {
    title: "СПА-уход для кожи головы",
    category: "Уход",
    description:
      "Скраб, массаж и маска. Небольшой ритуал, после которого голова правда отдыхает.",
    price: 2400,
    duration: 45,
    popular: false,
    order: 16,
    active: true,
  },
];

const portfolio = [
  {
    title: "Кудри, которые живут своей жизнью",
    tag: "Укладка",
    image: "/images/hairstyle-1.png",
    description: "Мягкие волны и объём без ощущения «чужой» укладки.",
    stylist: "Ника Орлова",
    order: 1,
    active: true,
  },
  {
    title: "Мягкий блонд без боли",
    tag: "Окрашивание",
    image: "/images/hairstyle-2.png",
    description: "Тёплый светлый оттенок с плавным переходом у корней.",
    stylist: "Алиса Ветрова",
    order: 2,
    active: true,
  },
  {
    title: "Коротко и по делу",
    tag: "Стрижка",
    image: "/images/hairstyle-3.png",
    description: "Текстурированная стрижка, которую легко уложить за минуту.",
    stylist: "Марго Соколова",
    order: 3,
    active: true,
  },
  {
    title: "Розовый рассвет на волосах",
    tag: "Окрашивание",
    image: "/images/hairstyle-4.png",
    description: "Нежный розовый, который живёт в волосах, а не на них.",
    stylist: "Алиса Ветрова",
    order: 4,
    active: true,
  },
  {
    title: "Пучок для важного вечера",
    tag: "Укладка",
    image: "/images/hairstyle-5.png",
    description: "Собранные волосы с мягкими прядями у лица.",
    stylist: "Ника Орлова",
    order: 5,
    active: true,
  },
  {
    title: "Классика, но с характером",
    tag: "Стрижка",
    image: "/images/hairstyle-6.png",
    description: "Ровный срез и чёлка, которые не надо спасать укладкой.",
    stylist: "Тимур Белов",
    order: 6,
    active: true,
  },
  {
    title: "Пикси с длинной чёлкой",
    tag: "Стрижка",
    image: "/images/hairstyle-7.png",
    description: "Смелая форма для тех, кто готов к переменам.",
    stylist: "Марго Соколова",
    order: 7,
    active: true,
  },
  {
    title: "Тёплый блонд",
    tag: "Окрашивание",
    image: "/images/hairstyle-8.png",
    description: "Медовые блики и очень мягкий переход у корней.",
    stylist: "Алиса Ветрова",
    order: 8,
    active: true,
  },
  {
    title: "Локоны как из 90-х",
    tag: "Укладка",
    image: "/images/hairstyle-9.png",
    description: "Крупные пряди и лёгкий ретро-настрой.",
    stylist: "Ника Орлова",
    order: 9,
    active: true,
  },
  {
    title: "AirTouch: воздух и свет",
    tag: "Окрашивание",
    image: "/images/work-10.jpg",
    description: "Растяжка цвета без плотных полос у корней.",
    stylist: "Алиса Ветрова",
    order: 10,
    active: true,
  },
  {
    title: "Пикси с чёлкой",
    tag: "Стрижка",
    image: "/images/work-11.jpg",
    description: "Короткая стрижка с характером и мягкой текстурой.",
    stylist: "Марго Соколова",
    order: 11,
    active: true,
  },
  {
    title: "Голливудская волна",
    tag: "Укладка",
    image: "/images/work-12.jpg",
    description: "Глянцевые волны для вечера и поводов.",
    stylist: "Ника Орлова",
    order: 12,
    active: true,
  },
  {
    title: "Цветная прядь для смелых",
    tag: "Окрашивание",
    image: "/images/work-13.jpg",
    description: "Один акцент, который меняет весь образ.",
    stylist: "Алиса Ветрова",
    order: 13,
    active: true,
  },
];

const settings = {
  _id: "site",
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
  updatedAt: new Date(),
};

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });

try {
  await client.connect();
  const db = client.db(dbName);

  await Promise.all([
    db.collection("services").deleteMany({}),
    db.collection("staff").deleteMany({}),
    db.collection("portfolio").deleteMany({}),
    db.collection("appointments").deleteMany({}),
    db.collection("settings").deleteMany({}),
  ]);

  const staffResult = await db.collection("staff").insertMany(staff);
  const servicesResult = await db.collection("services").insertMany(services);
  await db.collection("portfolio").insertMany(portfolio);
  await db.collection("settings").insertOne(settings);

  const serviceIds = servicesResult.insertedIds;
  const staffIds = staffResult.insertedIds;

  const appointments = [
    {
      name: "Галина Петрова",
      phone: "+7 (985) 111-22-33",
      serviceId: String(serviceIds[8]),
      serviceTitle: services[8].title,
      stylistId: String(staffIds[0]),
      stylistName: staff[0].name,
      date: isoDaysFromNow(1),
      time: "11:00",
      comment: "Хочу холодный блонд, но без резких полос у корней.",
      status: "new",
      createdAt: new Date(Date.now() - 26 * 3_600_000),
    },
    {
      name: "Ева Смирнова",
      phone: "+7 (911) 222-33-44",
      serviceId: String(serviceIds[0]),
      serviceTitle: services[0].title,
      stylistId: String(staffIds[1]),
      stylistName: staff[1].name,
      date: isoDaysFromNow(2),
      time: "15:30",
      comment: "Хочется короткую чёлку, но боюсь. Обсудим на месте.",
      status: "confirmed",
      createdAt: new Date(Date.now() - 50 * 3_600_000),
    },
    {
      name: "Арина Козлова",
      phone: "+7 (921) 333-44-55",
      serviceId: String(serviceIds[10]),
      serviceTitle: services[10].title,
      stylistId: String(staffIds[3]),
      stylistName: staff[3].name,
      date: isoDaysFromNow(3),
      time: "18:00",
      comment: "Свадьба подруги, нужны локоны до утра.",
      status: "new",
      createdAt: new Date(Date.now() - 4 * 3_600_000),
    },
  ];

  await db.collection("appointments").insertMany(
    appointments.map((appointment) => ({
      ...appointment,
      phoneKey: String(appointment.phone).replace(/\D/g, "").slice(-10),
    })),
  );
  await db.collection("appointments").createIndex({ date: 1, time: 1 });
  await db.collection("appointments").createIndex({ status: 1 });
  await db
    .collection("appointments")
    .createIndex({ clientId: 1, status: 1, date: 1 });
  await db
    .collection("appointments")
    .createIndex({ phoneKey: 1, status: 1, date: 1 });

  const [serviceCount, staffCount, workCount, appointmentCount] =
    await Promise.all([
      db.collection("services").countDocuments(),
      db.collection("staff").countDocuments(),
      db.collection("portfolio").countDocuments(),
      db.collection("appointments").countDocuments(),
    ]);

  console.log(`MongoDB: ${uri} / ${dbName}`);
  console.log(
    `Готово: ${serviceCount} услуг, ${staffCount} мастера, ${workCount} работ, ${appointmentCount} записи.`,
  );
  console.log(`Вход в админку: ${process.env.ADMIN_LOGIN ?? "admin"} / ${
    process.env.ADMIN_PASSWORD ?? "kapriz2026"
  }`);
} finally {
  await client.close();
}
