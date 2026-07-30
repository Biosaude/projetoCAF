import { prisma } from "@/lib/db/prisma";
import { PrismaUserRepository } from "../repositories/prisma-user.repository";
import { UserAdminService } from "../services/user-admin.service";

/** Composition root for server-side identity management. */
export const userRepository = new PrismaUserRepository(prisma);
export const userAdminService = new UserAdminService(userRepository);
