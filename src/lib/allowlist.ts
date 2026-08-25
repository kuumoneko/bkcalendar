import Mongo_client_Component from "./mongodb";
import { logDebug, logError } from "./logger";

const DEFAULT_ALLOWED = ["nhat.maikuumo"];

export default async function is_allowed(username: string): Promise<boolean> {
    const client = await Mongo_client_Component();
    await client.connect();

    const collection = client
        .db("hcmut")
        .collection<{ _id: string; usernames: string[] }>("allowed");
    let doc = await collection.findOne({ _id: "allowlist" });
    if (!doc) {
        try {
            await collection.insertOne({
                _id: "allowlist",
                usernames: DEFAULT_ALLOWED,
            });
        }
        catch (e: any) {
            logError("Failed to create default allowlist", "allowlist", undefined, { error: e.message });
        }
        doc = await collection.findOne({ _id: "allowlist" });
    }

    const usernames: string[] = Array.isArray(doc?.usernames)
        ? doc.usernames
        : DEFAULT_ALLOWED;
    const normalized = username.trim().toLowerCase();
    const allowed = usernames.some(
        (entry) =>
            typeof entry === "string" &&
            entry.trim().toLowerCase() === normalized,
    );
    logDebug(`Allowlist check: ${allowed ? "allowed" : "denied"}`, "allowlist", username);
    return allowed;
}
