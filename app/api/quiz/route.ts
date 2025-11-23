import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      grade,
      subject,
      goal,
      frequency,
      timeSlots,
      style,
      comment,
    } = body as {
      grade?: string;
      subject?: string;
      goal?: string;
      frequency?: string;
      timeSlots?: string[];
      style?: string;
      comment?: string;
    };

    if (!grade || !subject) {
      return NextResponse.json(
        { ok: false, error: "grade and subject are required" },
        { status: 400 }
      );
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
      return NextResponse.json(
        { ok: false, error: "Server is not configured" },
        { status: 500 }
      );
    }

    const lines = [
      "Новая заявка на подбор репетитора:",
      `Класс: ${grade}`,
      `Предмет: ${subject}`,
      `Цель: ${goal || "—"}`,
      `Частота: ${frequency || "—"}`,
      `Время: ${
        Array.isArray(timeSlots) && timeSlots.length > 0
          ? timeSlots.join(", ")
          : "—"
      }`,
      `Стиль преподавателя: ${style || "—"}`,
      `Комментарий: ${comment || "—"}`,
    ];

    const text = lines.join("\n");

    const tgRes = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
        }),
      }
    );

    if (!tgRes.ok) {
      const errText = await tgRes.text();
      console.error("Telegram error:", errText);
      return NextResponse.json(
        { ok: false, error: "Failed to send to Telegram" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Unexpected error" },
      { status: 500 }
    );
  }
}
