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
  } = input;

  const lines = [
    "Новая заявка на подбор репетитора (tRPC):",
    `Имя родителя: ${name}`,
    `Телефон: ${phone}`,
    `Класс: ${grade}`,
    `Предмет: ${subject}`,
    `Цель: ${goal || "—"}`,
    `Частота: ${frequency || "—"}`,
    `Время: ${timeSlots.length > 0 ? timeSlots.join(", ") : "—"}`,
    `Стиль преподавателя: ${style || "—"}`,
    `Комментарий: ${comment || "—"}`,
  ];

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
