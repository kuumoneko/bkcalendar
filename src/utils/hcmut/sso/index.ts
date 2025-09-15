import fetch_data from "@/utils/fetch";

export default async function create_login() {
    try {
        const res = await fetch_data(
            `/api/sso/page`,
            "GET"
        );
        return res;
    }
    catch (e: any) {
        console.error(e)
        throw new Error(e);
    }
}