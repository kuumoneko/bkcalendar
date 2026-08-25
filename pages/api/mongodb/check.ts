import { Collection } from "mongodb";
import { logInfo, logError } from "@/lib/logger";

export default async function check(collection: Collection, username: string) {
    const results = await collection.countDocuments({
        username: username
    });

    if (results === 0) {
        try {
            await collection.insertOne({
                username: username,
                password: "",
                filter: null,
                schedule: null,
                exam: null,
                data: null
            })
            logInfo("Auto-created user document", "mongodb", username);
        } catch (e: any) {
            logError("Failed to auto-create user document", "mongodb", username, { error: e.message });
        }
    }
}