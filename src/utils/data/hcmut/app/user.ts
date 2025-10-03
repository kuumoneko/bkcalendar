import fetch_data from "@/utils/fetch";

/**
 * Get auth token from mybk/app web
 */
export default async function get_token(SESSION: string) {
    try {
        const res = await fetch_data("/api/mybk/app/app",
            "POST",
            {
                "content-type": "application/json",
            },
            JSON.stringify({
                SESSION: SESSION
            })
        );
        return res;
    }
    catch (e: any) {
        console.error(e);
        throw new Error(e);
    }
}