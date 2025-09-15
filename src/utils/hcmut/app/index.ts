import fetch_data from "@/utils/fetch";

/**
 * check if web is down?
 */
export default async function check() {
    try {
        const res = await fetch_data("/api/mybk/app/check",
            "GET",
            {
                "content-type": "application/json",
            }
        );
        return res;
    }
    catch (e: any) {
        console.error(e);
        throw new Error(e);
    }
}