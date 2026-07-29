import { handlers } from "@/auth";
import { assertRuntimeEnvironment } from "@/config/env";

export const GET = (...args: Parameters<typeof handlers.GET>) => {
  assertRuntimeEnvironment();
  return handlers.GET(...args);
};

export const POST = (...args: Parameters<typeof handlers.POST>) => {
  assertRuntimeEnvironment();
  return handlers.POST(...args);
};
