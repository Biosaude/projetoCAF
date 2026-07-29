"use server";

import { signIn, signOut } from "@/auth";
import { assertRuntimeEnvironment } from "@/config/env";

export async function loginWithGoogle() {
  assertRuntimeEnvironment();
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function logout() {
  assertRuntimeEnvironment();
  await signOut({ redirectTo: "/login" });
}
