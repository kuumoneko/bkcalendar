import fetch_data from "@/utils/fetch";

/**
 * Get student data
 */
export default async function get_web_student(authorization: string) {
    try {
        const res = await fetch_data(
            "/api/mybk/api/student",
            {
                "Content-Type": "application/json"
            },
            {
                authorization: authorization,
            },
        );

        return res;
    } catch (e: any) { console.error(e); throw new Error(e) }
}