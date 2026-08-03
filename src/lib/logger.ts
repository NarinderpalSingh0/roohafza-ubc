type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const MIN_LEVEL: LogLevel = import.meta.env.DEV ? "debug" : "warn";

function shouldLog(level: LogLevel): boolean {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[MIN_LEVEL];
}

function formatMessage(_level: LogLevel, namespace: string, message: string): string {
  const prefix = namespace ? `[${namespace}]` : "";
  return `${prefix} ${message}`;
}

export const logger = {
  debug(namespace: string, message: string, ...args: unknown[]): void {
    if (shouldLog("debug")) {
      console.debug(formatMessage("debug", namespace, message), ...args);
    }
  },
  info(namespace: string, message: string, ...args: unknown[]): void {
    if (shouldLog("info")) {
      console.info(formatMessage("info", namespace, message), ...args);
    }
  },
  warn(namespace: string, message: string, ...args: unknown[]): void {
    if (shouldLog("warn")) {
      console.warn(formatMessage("warn", namespace, message), ...args);
    }
  },
  error(namespace: string, message: string, ...args: unknown[]): void {
    if (shouldLog("error")) {
      console.error(formatMessage("error", namespace, message), ...args);
    }
  },
} as const;
