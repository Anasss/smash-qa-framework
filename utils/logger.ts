type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent';

const LEVELS: Record<LogLevel, number> = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 60,
};

function nowISO() {
  return new Date().toISOString();
}

export class Logger {
  private static globalLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';
  private static json = (process.env.LOG_JSON || '').toLowerCase() === 'true';

  static setLevel(level: LogLevel) {
    this.globalLevel = level;
  }

  static get(scope = 'app') {
    return new ScopedLogger(scope);
  }

  static enableJson(enabled = true) {
    this.json = enabled;
  }

  static shouldLog(level: LogLevel) {
    return LEVELS[level] >= LEVELS[this.globalLevel];
  }

  static emit(scope: string, level: LogLevel, msg: string, meta?: unknown) {
    if (!this.shouldLog(level)) return;
    if (this.json) {
      const payload: Record<string, unknown> = { ts: nowISO(), level, scope, msg };
      if (meta !== undefined) payload.meta = meta;
      console.log(JSON.stringify(payload));
      return;
    }
    const prefix = `[${nowISO()}] [${level.toUpperCase()}] [${scope}]`;
    const line = `${prefix} ${msg}`;
    // eslint-disable-next-line no-console
    (level === 'error' ? console.error : level === 'warn' ? console.warn : console.log)(line, meta ?? '');
  }
}

class ScopedLogger {
  constructor(private scope: string) {}

  child(childScope: string) {
    return new ScopedLogger(`${this.scope}:${childScope}`);
  }

  trace(msg: string, meta?: unknown) {
    Logger.emit(this.scope, 'trace', msg, meta);
  }
  debug(msg: string, meta?: unknown) {
    Logger.emit(this.scope, 'debug', msg, meta);
  }
  info(msg: string, meta?: unknown) {
    Logger.emit(this.scope, 'info', msg, meta);
  }
  warn(msg: string, meta?: unknown) {
    Logger.emit(this.scope, 'warn', msg, meta);
  }
  error(msg: string, meta?: unknown) {
    Logger.emit(this.scope, 'error', msg, meta);
  }
}

export type { LogLevel };
