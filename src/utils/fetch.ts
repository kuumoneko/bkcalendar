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
        let res: Response;
        try {
            res = await fetch(fetch_url, {
                method: "GET",
                headers: headers,
            })
        }
        catch (e) {
            return [];
        }

        const { ok, data } = await res.json();
        if (ok) {
            return data ?? "ok";
        }
        else {
            if (data === "Unauthorized") {
                Logout();
                alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.")
                window.location.href = "/login";
            }
            if (data === "INVALID_CREDENTIALS") {
                alert("Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại.")
            }
            else if (res.status === 304) {
                return "ok"
            }
            else {
                handle_error(data)
            }
        }
    }
    catch (e: any) {
        handle_error(e)
    }
}