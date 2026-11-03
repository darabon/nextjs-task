export type Service = {
  id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  popular: boolean;
  order: number;
  active: boolean;
};

export type Staff = {
  id: string;
  name: string;
  role: string;
  photo: string;
  experience: string;
  bio: string;
  specialties: string[];
  order: number;
  active: boolean;
};

export type PortfolioItem = {
  id: string;
  title: string;
  tag: string;
  image: string;
  description: string;
  stylist: string;
  order: number;
  active: boolean;
};

export type AppointmentStatus = "new" | "confirmed" | "done" | "cancelled";

export type Appointment = {
  id: string;
  name: string;
  phone: string;
  serviceId: string;
  serviceTitle: string;
  stylistId: string;
  stylistName: string;
  date: string;
  time: string;
  comment: string;
  status: AppointmentStatus;
  createdAt: string;
};

export type Settings = {
  phone: string;
  phoneHref: string;
  address: string;
  email: string;
  hours: string;
  dayOffLabel: string;
  workingDays: number[];
  socials: {
    instagram: string;
    telegram: string;
    vk: string;
  };
};

export type BookingState = {
  status: "idle" | "error";
  message?: string;
};
