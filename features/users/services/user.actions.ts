"use server";

import { revalidatePath } from "next/cache";
import { requireAdministrator } from "@/features/authentication/services/authorization.service";
import { userAdminService } from "../config/user.dependencies";
import {
  updateUserRoleSchema,
  updateUserStatusSchema,
} from "../validators/user-admin.validator";

export async function updateUserStatus(formData: FormData) {
  const actor = await requireAdministrator();
  const input = updateUserStatusSchema.parse(Object.fromEntries(formData));
  await userAdminService.changeStatus(actor.id, input.userId, input.status);
  revalidatePath("/usuarios");
}

export async function updateUserRole(formData: FormData) {
  const actor = await requireAdministrator();
  const input = updateUserRoleSchema.parse(Object.fromEntries(formData));
  await userAdminService.changeRole(actor.id, input.userId, input.role);
  revalidatePath("/usuarios");
}
