import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/unit/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      include: [
        "features/authentication/**/*.{ts,tsx}",
        "features/users/**/*.{ts,tsx}",
        "features/audit/**/*.{ts,tsx}",
        "auth.ts",
        "middleware.ts",
        "scripts/lib/promote-admin.mjs",
      ],
      exclude: ["**/*.d.ts", "**/index.ts"],
      thresholds: {
        statements: 70,
        branches: 65,
        functions: 70,
        lines: 70,
      },
    },
  },
});
