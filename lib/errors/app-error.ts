export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode = 500,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = new.target.name;
  }
}
export class ValidationError extends AppError {
  constructor(
    message = "Os dados informados são inválidos.",
    details?: unknown,
  ) {
    super(message, "VALIDATION_ERROR", 422, details);
  }
}
export class UnauthorizedError extends AppError {
  constructor(message = "Autenticação necessária.") {
    super(message, "UNAUTHORIZED", 401);
  }
}
export class NotFoundError extends AppError {
  constructor(resource = "Recurso") {
    super(`${resource} não encontrado.`, "NOT_FOUND", 404);
  }
}
