import fetch_data from "@/utils/fetch";

/**
 * Create mybk/app SESSION
 */
export default async function create_app(url: string) {
    try {
        const ticket = new URL(url).searchParams.get("ticket")
        const res = await fetch_data(`/api/mybk/app/login`,
            "POST",
            {
                "content-type": "application/json",
            },
            JSON.stringify({
                ticket: ticket
            })
        );
        return {
            SESSION: res,
        };
    }
    catch (e: any) {
        console.error(e)
        throw new Error(e)
    }

}