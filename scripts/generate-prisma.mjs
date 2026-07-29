import { spawnSync } from "node:child_process";

const buildTimeDatabaseUrl =
  "postgresql://build:build@127.0.0.1:5432/build?schema=public";

const command = process.platform === "win32" ? "prisma.cmd" : "prisma";
const result = spawnSync(command, ["generate"], {
  env: {
    ...process.env,
    // Prisma validates the datasource while generating the client, although it
    // does not connect to it. A deploy that only renders the empty foundation
    // therefore does not need production database credentials during build.
    DATABASE_URL: process.env.DATABASE_URL ?? buildTimeDatabaseUrl,
  },
  stdio: "inherit",
});

if (result.error) {
  throw result.error;
}

process.exitCode = result.status ?? 1;
