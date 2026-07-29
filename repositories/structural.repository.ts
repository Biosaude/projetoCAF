import type { PrismaClient } from "@prisma/client";

/** Server-side base that makes Prisma dependency injection explicit. */
export abstract class PrismaRepository {
  protected constructor(protected readonly db: PrismaClient) {}
}
