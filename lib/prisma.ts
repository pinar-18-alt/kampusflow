import { PrismaClient } from "@prisma/client";

/**
 * Tek PrismaClient örneği — geliştirmede HMR, üretimde (Vercel dahil) aynı isolate
 * içinde bağlantı sızıntısını azaltmak için globalThis üzerinde tutulur.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

globalForPrisma.prisma = prisma;
