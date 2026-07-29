import { describe, expect, it } from "vitest";
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "@/lib/errors";
describe("erros da aplicação", () => {
  it.each([
    [new ValidationError(), 422],
    [new UnauthorizedError(), 401],
    [new NotFoundError("Usuário"), 404],
  ])("associa %s ao status HTTP esperado", (error, status) => {
    expect(error.statusCode).toBe(status);
    expect(error.code).toBeTruthy();
  });
});
