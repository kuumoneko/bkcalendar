import Logout from "./logout";
import { push_noti } from "./notification";

const PUBLIC_SITE = "https://bkalendar.github.io/";

let going_public = false;

export function is_going_public(): boolean {
    return going_public;
}

export function go_public_site() {
    if (going_public) {
        return;
    }
    going_public = true;
    push_noti(
        "Web này chỉ dành cho chủ sở hữu. Đang chuyển đến bản mở tại bkalendar.github.io (không cần tài khoản myBK)...",
        "error",
    );
    setTimeout(() => {
        window.location.replace(PUBLIC_SITE);
    }, 5000);
    try {
        Logout();
    }
    catch (e) {
        console.error(e);
    }
}
