"use server";

import { revalidatePath } from "next/cache";
import { requireAdministrator } from "@/features/authentication/services/authorization.service";
import { prisma } from "@/lib/db/prisma";
import { PrismaUserRepository } from "../repositories/prisma-user.repository";
import {
  updateUserRoleSchema,
  updateUserStatusSchema,
} from "../validators/user-admin.validator";
import { UserAdminService } from "./user-admin.service";

function createService() {
  return new UserAdminService(new PrismaUserRepository(prisma));
}

export async function updateUserStatus(formData: FormData) {
  const actor = await requireAdministrator();
  const input = updateUserStatusSchema.parse(Object.fromEntries(formData));
  await createService().changeStatus(actor.id, input.userId, input.status);
  revalidatePath("/usuarios");
}

export async function updateUserRole(formData: FormData) {
  const actor = await requireAdministrator();
  const input = updateUserRoleSchema.parse(Object.fromEntries(formData));
  await createService().changeRole(actor.id, input.userId, input.role);
  revalidatePath("/usuarios");
}
