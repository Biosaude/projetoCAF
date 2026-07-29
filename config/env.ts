import { z } from "zod";
const environmentSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  AUTH_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});
export type Environment = z.infer<typeof environmentSchema>;
export function parseEnvironment(input: NodeJS.ProcessEnv): Environment {
  return environmentSchema.parse(input);
}

/**
 * Validates secrets only when a server-side authentication operation runs.
 *
 * Next.js imports the Auth.js configuration while collecting route metadata
 * during `next build`. Validating at module scope makes that compilation depend
 * on production secrets, although no external service is contacted at build
 * time. Runtime entry points must call this function before handling auth.
 */
export function assertRuntimeEnvironment(): Environment {
  return parseEnvironment(process.env);
}
