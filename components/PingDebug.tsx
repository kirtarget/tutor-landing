// components/PingDebug.tsx
"use client";

import { trpc } from "@/trpc/client";

export function PingDebug() {
  const { data, isLoading, error } = trpc.ping.useQuery();

  if (isLoading) return <div className="text-xs text-slate-500">Загрузка…</div>;
  if (error)
    return (
      <div className="text-xs text-red-600">
        Ошибка tRPC: {error.message}
      </div>
    );

  return (
    <div className="text-xs text-emerald-600">
      tRPC работает, ответ сервера: {data}
    </div>
  );
}
