// server/trpc.ts
import "server-only";
import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

// ---- Схема входных данных квиза ----

const quizInputSchema = z.object({
  name: z.string().min(1, "Имя обязательно"),
  phone: z.string().min(5, "Телефон обязателен"),
  grade: z.string().min(1, "Класс обязателен"),
  subject: z.string().min(1, "Предмет обязателен"),
  goal: z.string().optional(),
  frequency: z.string().optional(),
  timeSlots: z.array(z.string()).optional(),
  style: z.string().optional(),
  comment: z.string().optional(),
  notifications: z.array(z.string()).optional(),
  email: z.string().optional(),
  bookingDate: z.string().optional(),
  bookingTime: z.string().optional(),
  bookingStartAt: z.string().optional(),
  tutorName: z.string().optional(),
  tutorPrice: z.number().optional(),
  tutorSubject: z.string().optional(),
  selectedTutorId: z.string().optional(),
});

export type QuizInput = z.infer<typeof quizInputSchema>;

// ---- Утилита отправки в Telegram ----

async function sendQuizToTelegram(input: QuizInput) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    // В проде так делать не стоит, но для MVP лучше не ронять весь API
    console.error(
      "[tRPC submitQuiz] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID env vars. " +
        "Заявка не отправлена в Telegram, но tRPC вернул ok.",
    );
    return; // просто выходим без throw, чтобы ответ tRPC был валидным JSON
  }

  const {
    name,
    phone,
    grade,
    subject,
    goal,
    frequency,
    timeSlots = [],
    style,
    comment,
    notifications = [],
    bookingDate,
    bookingTime,
    bookingStartAt,
    tutorName,
    tutorPrice,
    tutorSubject,
    selectedTutorId,
    email,
  } = input;

  // Расшифровка значений
  const goalLabels: Record<string, string> = {
    grades: "Подтянуть текущие оценки",
    exam: "Подготовка к ОГЭ / ЕГЭ",
    gaps: "Закрыть пробелы по теме",
    other: "Другое",
  };

  const frequencyLabels: Record<string, string> = {
    "1w": "1 раз в неделю",
    "2w": "2 раза в неделю",
    intensive: "Интенсив перед экзаменом",
    "not-sure": "Пока не знаю, нужна рекомендация",
  };

  const timeSlotLabels: Record<string, string> = {
    "weekday-day": "Будни днём",
    "weekday-evening": "Будни вечером",
    weekend: "Выходные",
  };

  const styleLabels: Record<string, string> = {
    calm: "Спокойный, терпеливый",
    strict: "Более строгий, с контролем",
    fast: "Быстрый темп, много практики",
    "dont-know": "Пока не знаю, подберите по ребёнку",
  };

  const lines = [
    "🎓 Новая заявка на подбор репетитора",
    "",
    "👤 Контакты:",
    `   Имя: ${name}`,
    `   Телефон: ${phone}`,
    `   Email: ${email || "—"}`,
    "",
    "📚 Информация об ученике:",
    `   Класс: ${grade}`,
    `   Предмет: ${subject}`,
    "",
    "🎯 Цель занятий:",
    `   ${goal || "—"}`,
    "",
    "📅 Формат занятий:",
    `   Частота: ${frequency ? frequencyLabels[frequency] || frequency : "—"}`,
    `   Удобное время: ${
      timeSlots.length > 0
        ? timeSlots.map((ts) => timeSlotLabels[ts] || ts).join(", ")
        : "—"
    }`,
    "",
    "🗓 Бронирование:",
    `   Дата: ${bookingDate || "—"}`,
    `   Время: ${bookingTime || "—"}`,
    `   ISO: ${bookingStartAt || "—"}`,
    "   Длительность: 30 минут (пробный)",
    "",
    "👨‍🏫 Стиль преподавателя:",
    `   ${style || "—"}`,
  ];

  if (tutorName || tutorPrice) {
    lines.push(
      "",
      "📘 Репетитор:",
      `   ${tutorName || "Не выбран"}`,
      tutorPrice ? `   Цена: ${tutorPrice} ₽` : "   Цена: —",
      tutorSubject ? `   Предмет: ${tutorSubject}` : "",
      selectedTutorId ? `   ID: ${selectedTutorId}` : "",
    );
  }

  if (notifications.length) {
    lines.push("", "🔔 Напоминания:", `   ${notifications.join(", ")}`);
  }

  if (comment) {
    lines.push("", "💬 Комментарий:", `   ${comment}`);
  }

  const text = lines.join("\n");

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
    },
  );

  if (!response.ok) {
    const errText = await response.text().catch(() => "unknown error");
    console.error("[tRPC submitQuiz] Telegram error:", errText);
    throw new Error("Не удалось отправить заявку в Telegram");
  }
}

// ---- Общий роутер приложения ----

export const appRouter = createTRPCRouter({
  // простой healthcheck
  ping: publicProcedure.query(() => "pong"),

  // мутация для квиза
  submitQuiz: publicProcedure
    .input(quizInputSchema)
    .mutation(async ({ input }) => {
      await sendQuizToTelegram(input);
      return { ok: true };
    }),
});

// Тип роутера нужен клиенту tRPC
export type AppRouter = typeof appRouter;
