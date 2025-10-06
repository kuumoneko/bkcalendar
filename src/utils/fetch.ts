import { handle_error } from "./error";
import Logout from "./logout";

/**
 * fetch data from api
 */
export default async function fetch_data(
    url: string,
    headers?: HeadersInit,
    body?: any): Promise<any> {
    try {

        if (url.length === 0) {
            throw new Error("URL is empty");
        }
        let fetch_url = url;
        if (body) {
            if (!url.includes("mongodb")) {
                fetch_url += "?" + new URLSearchParams(body as Record<string, string>)
            }
            else {
                fetch_url += `?doc=${body.doc}&mode=${body.mode}`;
                fetch_url += `&data=${encodeURIComponent(JSON.stringify(body.data))}`
            }
        }
        let res: any;
        try {
            res = await fetch(fetch_url, {
                method: "GET",
                headers: headers,
            })
        }
        catch (e) {
            throw new Error("EAI_AGAIN");
        }

        const { ok, data } = await res.json();
        console.log(ok, data)
        if (ok) {
            return data ?? "ok";
        }
        else {
            if (data === "Unauthorized") {
                Logout();
                alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.")
                window.location.href = "/login";
            }
            handle_error(data)
        }
    }
    catch (e: any) {
        handle_error(e)
    }
}