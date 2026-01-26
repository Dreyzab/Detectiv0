export type LogLevel = "info" | "warn" | "error" | "debug";

export interface LogMetadata {
    sessionId?: string;
    userId?: string;
    [key: string]: unknown;
}

class Logger {
    private static instance: Logger;
    private metadata: LogMetadata = {};

    private constructor() { }

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    setMetadata(meta: LogMetadata) {
        this.metadata = { ...this.metadata, ...meta };
    }

    private formatMessage(level: LogLevel, message: string, meta?: LogMetadata) {
        const timestamp = new Date().toISOString();
        const combinedMeta = { ...this.metadata, ...meta };
        return `[${timestamp}] [${level.toUpperCase()}] ${message} ${Object.keys(combinedMeta).length ? JSON.stringify(combinedMeta) : ""
            }`;
    }

    info(message: string, meta?: LogMetadata) {
        console.log(this.formatMessage("info", message, meta));
    }

    warn(message: string, meta?: LogMetadata) {
        console.warn(this.formatMessage("warn", message, meta));
    }

    error(message: string, meta?: LogMetadata) {
        console.error(this.formatMessage("error", message, meta));
    }

    debug(message: string, meta?: LogMetadata) {
        if (process.env.NODE_ENV === "development") {
            console.debug(this.formatMessage("debug", message, meta));
        }
    }
}

export const logger = Logger.getInstance();
