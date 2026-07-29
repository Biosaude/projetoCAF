import type { PrismaClient } from "@prisma/client";

export function parsePromotionArgs(argv: string[]): { email: string };
export function promoteAdministrator(
  client: PrismaClient,
  email: string,
): Promise<string>;
