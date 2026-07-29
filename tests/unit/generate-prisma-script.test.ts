import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("script de geração do Prisma", () => {
  it("mantém a variável de produção e usa fallback somente quando ela não existe", () => {
    const source = readFileSync(
      resolve(process.cwd(), "scripts/generate-prisma.mjs"),
      "utf8",
    );

    expect(source).toContain(
      "DATABASE_URL: process.env.DATABASE_URL ?? buildTimeDatabaseUrl",
    );
    expect(source).not.toContain("process.env.DATABASE_URL =");
  });
});
