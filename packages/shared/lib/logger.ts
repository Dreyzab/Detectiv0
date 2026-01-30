export type LogLevel = "info" | "warn" | "error" | "debug";

export type LogChannel = "system" | "game" | "vn" | "store" | "net";

export interface LogMetadata {
    sessionId?: string;
    userId?: string;
    [key: string]: unknown;
}

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    channel: LogChannel;
    message: string;
    meta?: LogMetadata;
}

const STORAGE_KEY = "game_logs";
const MAX_LOGS = 1000;

class Logger {
    private static instance: Logger;
    private metadata: LogMetadata = {};
    private logs: LogEntry[] = [];

    private constructor() {
        this.loadLogs();
    }

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    setMetadata(meta: LogMetadata) {
        this.metadata = { ...this.metadata, ...meta };
    }

    private getStorage() {
        try {
            if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) {
                return (globalThis as any).localStorage;
            }
        } catch (e) {
            return null;
        }
        return null;
    }

    private loadLogs() {
        try {
            const storage = this.getStorage();
            if (storage) {
                const stored = storage.getItem(STORAGE_KEY);
                if (stored) {
                    this.logs = JSON.parse(stored);
                }
            }
        } catch (e) {
            console.error("Failed to load logs", e);
        }
    }

    private saveLog(entry: LogEntry) {
        this.logs.push(entry);
        if (this.logs.length > MAX_LOGS) {
            this.logs = this.logs.slice(-MAX_LOGS);
        }

        try {
            const storage = this.getStorage();
            if (storage) {
                storage.setItem(STORAGE_KEY, JSON.stringify(this.logs));
            }
        } catch (e) {
            // ignore quota errors etc
        }
    }

    private getStyle(channel: LogChannel): string {
        switch (channel) {
            case "vn": return "color: #a855f7; font-weight: bold;"; // Purple
            case "net": return "color: #3b82f6; font-weight: bold;"; // Blue
            case "store": return "color: #9ca3af; font-weight: bold;"; // Gray
            case "system": return "color: #22c55e; font-weight: bold;"; // Green
            case "game": default: return "color: inherit; font-weight: bold;";
        }
    }

    private log(level: LogLevel, channel: LogChannel, message: string, meta?: LogMetadata) {
        const timestamp = new Date().toISOString();
        const entry: LogEntry = { timestamp, level, channel, message, meta };
        this.saveLog(entry);

        const combinedMeta = { ...this.metadata, ...meta };
        const hasMeta = Object.keys(combinedMeta).length > 0;

        const style = this.getStyle(channel);
        const prefix = `%c[${channel.toUpperCase()}]`;

        // Filter based on env if needed, for now we log all in dev
        if (process.env.NODE_ENV === 'production' && level === 'debug') return;

        switch (level) {
            case "info":
                console.log(`${prefix} ${message}`, style, hasMeta ? combinedMeta : "");
                break;
            case "warn":
                console.warn(`${prefix} ${message}`, style, hasMeta ? combinedMeta : "");
                break;
            case "error":
                console.error(`${prefix} ${message}`, style, hasMeta ? combinedMeta : "");
                break;
            case "debug":
                console.debug(`${prefix} ${message}`, style, hasMeta ? combinedMeta : "");
                break;
        }
    }

    // Standard methods default to 'game' channel if not specified via specialized methods
    info(message: string, meta?: LogMetadata, channel: LogChannel = "game") {
        this.log("info", channel, message, meta);
    }

    warn(message: string, meta?: LogMetadata, channel: LogChannel = "game") {
        this.log("warn", channel, message, meta);
    }

    error(message: string, meta?: LogMetadata, channel: LogChannel = "game") {
        this.log("error", channel, message, meta);
    }

    debug(message: string, meta?: LogMetadata, channel: LogChannel = "game") {
        this.log("debug", channel, message, meta);
    }

    // Specialized Channel Methods
    vn(message: string, meta?: LogMetadata) {
        this.info(message, meta, "vn");
    }

    net(message: string, meta?: LogMetadata) {
        this.info(message, meta, "net");
    }

    store(message: string, meta?: LogMetadata) {
        // debug level for store to avoid noise
        this.debug(message, meta, "store");
    }

    system(message: string, meta?: LogMetadata) {
        this.info(message, meta, "system");
    }

    getLogs() {
        return this.logs;
    }

    clearLogs() {
        this.logs = [];
        const storage = this.getStorage();
        if (storage) storage.removeItem(STORAGE_KEY);
    }
}

export const logger = Logger.getInstance();
