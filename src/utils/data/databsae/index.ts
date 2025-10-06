import { handle_error } from "@/utils/error";
import fetch_data from "@/utils/fetch";

export default async function mongodb(doc: "password" | "user" | "filter" | "schedule" | "exam", mode: "post" | "get", data: any) {
    try {
        const res = await fetch_data(`/api/mongodb/hcmut`, {
            "Content-Type": "application/json"
        }, {
            doc, mode, data: JSON.stringify(data)
        })
        return res;
    }
    catch (e: any) {
        handle_error(e.message);
    }
}