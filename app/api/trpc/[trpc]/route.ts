// app/api/trpc/[trpc]/route.ts
import { appRouter } from "@/server/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}), // если контекст не нужен
  });

export { handler as GET, handler as POST };
