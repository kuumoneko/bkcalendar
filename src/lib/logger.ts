import Mongo_client_Component from "./mongodb";
import { waitUntil } from "@vercel/functions";

const LOG_COLLECTION = "logs";
const TTL_SECONDS = 2592000; // 30 days

type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

interface LogEntry {
    level: LogLevel;
    message: string;
    context?: string;
    username?: string;
    meta?: any;
    timestamp: Date;
}

let indexEnsured = false;

async function ensureTTLIndex() {
    if (indexEnsured) return;
    try {
        const client = await Mongo_client_Component();
        await client.connect();
        const collection = client.db("hcmut").collection(LOG_COLLECTION);
        await collection.createIndex(
            { timestamp: 1 },
            { expireAfterSeconds: TTL_SECONDS, background: true }
        );
        indexEnsured = true;
    } catch {
        // index creation failed — non-critical, logs will still work but won't auto-expire
    }
}

function write(entry: LogEntry) {
    waitUntil(
        ensureTTLIndex()
            .then(() => Mongo_client_Component())
            .then((client) => client.connect())
            .then((client) => {
                const collection = client.db("hcmut").collection(LOG_COLLECTION);
                return collection.insertOne(entry);
            })
            .catch((e) => {
                console.error("[logger] Failed to write log to MongoDB:", e.message);
            })
    );
}

export function logDebug(message: string, context?: string, username?: string, meta?: any) {
    write({ level: "DEBUG", message, context, username, meta, timestamp: new Date() });
}

export function logInfo(message: string, context?: string, username?: string, meta?: any) {
    write({ level: "INFO", message, context, username, meta, timestamp: new Date() });
}

export function logWarn(message: string, context?: string, username?: string, meta?: any) {
    write({ level: "WARN", message, context, username, meta, timestamp: new Date() });
}

export function logError(message: string, context?: string, username?: string, meta?: any) {
    write({ level: "ERROR", message, context, username, meta, timestamp: new Date() });
}
