import fetch_data from "@/utils/fetch";

/**
 * Get all semester
 */
export default async function get_web_semester(authorization: string): Promise<any> {
    try {
        const res = await fetch_data(
            ("/api/mybk/api/semester"),

            "POST",
            {
                "Content-Type": "application/json"
            },
            { authorization: authorization }

        );
        return res;
    }
    catch (e: any) {
        throw new Error(e);
    }
}