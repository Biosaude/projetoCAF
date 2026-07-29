import { z } from "zod";
import {
  ROLE_KEYS,
  USER_STATUSES,
} from "@/features/authentication/types/auth.types";

export const updateUserStatusSchema = z.object({
  userId: z.string().cuid(),
  status: z.enum(USER_STATUSES),
});

export const updateUserRoleSchema = z.object({
  userId: z.string().cuid(),
  role: z.enum(ROLE_KEYS),
});
