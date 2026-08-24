import { handle_error } from "./error";
import Logout from "./logout";
import { push_noti } from "./notification";
import { go_public_site, is_going_public } from "./public_redirect";

const TIMEOUT_HINTS = ["timeout", "abort", "eai_again"];

function is_timeout_message(data: any): boolean {
    return (
        typeof data === "string" &&
        TIMEOUT_HINTS.some((hint) => data.toLowerCase().includes(hint))
    );
}

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
        let res: Response;
        try {
            res = await fetch(fetch_url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(body),
                signal: AbortSignal.timeout(10000),
            })
        }
        catch (e) {
            if (!fetch_url.includes("mongodb")) {
                push_noti(
                    "Máy trường không phản hồi. Đang hiển thị dữ liệu đã lưu.",
                    "error",
                );
            }
            return [];
        }

        const { ok, data } = await res.json();
        if (ok) {
            return data ?? "ok";
        }
        else {
            if (data === "NOT_ALLOWED") {
                go_public_site();
                return [];
            }
            if (data === "Unauthorized") {
                if (!is_going_public()) {
                    Logout();
                    alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.")
                    window.location.href = "/login";
                }
            }
            if (data === "INVALID_CREDENTIALS") {
                alert("Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại.")
            }
            else if (res.status === 304) {
                return "ok"
            }
            else if (is_timeout_message(data)) {
                push_noti(
                    "Máy trường không phản hồi hoặc đang quá tải. Vui lòng thử lại sau.",
                    "error",
                );
                return [];
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