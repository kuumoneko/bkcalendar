import fetch_data from "@/utils/fetch";

/**
 * Create sso login page
 */
export default async function create_login() {
    try {
        const res = await fetch_data(
            `/api/sso/page`,
        );
        return res;
    }
    catch (e: any) {
        throw new Error(e);
    }
}