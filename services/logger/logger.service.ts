type LogLevel = "debug" | "info" | "warn" | "error";
export interface Logger {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(
    message: string,
    error?: unknown,
    context?: Record<string, unknown>,
  ): void;
}
class StructuredLogger implements Logger {
  private write(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
  ) {
    const entry = JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      ...context,
    });
    if (level === "error") console.error(entry);
    else if (level === "warn") console.warn(entry);
    else console.info(entry);
  }
  debug(message: string, context?: Record<string, unknown>) {
    if (process.env.LOG_LEVEL === "debug")
      this.write("debug", message, context);
  }
  info(message: string, context?: Record<string, unknown>) {
    this.write("info", message, context);
  }
  warn(message: string, context?: Record<string, unknown>) {
    this.write("warn", message, context);
  }
  error(message: string, error?: unknown, context?: Record<string, unknown>) {
    this.write("error", message, {
      ...context,
      error:
        error instanceof Error
          ? { name: error.name, message: error.message }
          : error,
    });
  }
}
export const logger: Logger = new StructuredLogger();
