import { prisma } from "@/lib/db/prisma";
import { PrismaAuthenticationRepository } from "../repositories/prisma-authentication.repository";

/** Composition root for server-side authentication infrastructure. */
export const authenticationRepository = new PrismaAuthenticationRepository(
  prisma,
);
