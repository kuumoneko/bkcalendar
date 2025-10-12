import fetch_data from "@/utils/fetch";

/**
 * Get all semester
 */
export default async function get_web_semester(): Promise<string> {
    try {
        const res = await fetch_data(
            ("/api/mybk/api/semester"),
            {
                "Content-Type": "application/json"
            }
        );
        return res;
    }
    catch (e: any) {
        throw new Error(e);
    }
}