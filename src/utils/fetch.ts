import { handle_error } from "./error";

/**
 * fetch data from api
 */
export default async function fetch_data(
    url: string,
    method: "GET" | "POST" = "GET",
    headers?: HeadersInit,
    body?: Object): Promise<any> {
    try {
        if (url.length === 0) {
            throw new Error("URL is empty");
        }

        const res = await fetch(url, {
            method: method,
            headers: headers,
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(5000)
        })

        const { ok, data, error } = await res.json();

        if (ok) {
            if (data) {
                return data;
            }
            else {
                return "ok";
            }
        }
        else {
            console.log(data, error)
        }
    }
    catch (e: any) {
        if (String(e).includes("signal timed out")) {
            handle_error("EAI_AGAIN")
        }
        console.log(e)
        throw new Error(e);
    }
}