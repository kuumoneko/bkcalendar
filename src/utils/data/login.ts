import create_app from "@/utils/data/hcmut/app/login";
import create_login from "@/utils/data/hcmut/sso/index";
import login_user from "@/utils/data/hcmut/sso/login";
import get_token from "@/utils/data/hcmut/app/user";
import get_student_data from "@/utils/data/hcmut/api/student";
import { handle_error } from "../error";
import login_db from "./databsae/login/login";
import get_student from "./databsae/user/get";
import update_student from "./databsae/user/update";
import get_semester from "./hcmut/api/semester";

export default async function logining(username: string, password: string) {
    const { JSESSIONID, ltValue, executionValue } =
        await create_login();

    try {
        const res = await login_user(
            JSESSIONID || "",
            ltValue || "",
            executionValue || "",
            username,
            password
        );

        if (res === "INVALID_CREDENTIALS") {
            throw new Error("Tài khoản hoặc mật khẩu không đúng");
        }

        const { SESSION } = await create_app(res as string);
        let token = await get_token(SESSION as string);

        if (token === "ok") {
            const result = await login_db(username, password);
            if (result) {
                localStorage.setItem("offline", "true");
            }
            else {
                throw new Error("Đăng nhập thất bại. Web trường bị sập và database không có thông tin tài khoản của bạn. Vui lòng thử lại sau.");
            }
        }

        let database = await get_student(username);
        let user;
        if (token !== "ok") {
            user = await get_student_data(token as string);
            const semester = await get_semester(token as string);
            const this_semester = semester.find(
                (item: any) => item.isCurrent === true
            );

            if (user.name) {
                database = {
                    _id: database._id,
                    username: username,
                    ...user,
                    semester: this_semester.code
                }
                const updating = await update_student(database);

                user = {
                    ...user,
                    semester: this_semester.code,
                    username: username
                };
            }
        }
        else {
            const { _id, username, ...data } = database;
            user = {
                ...data
            }
            token = _id + username;
        }

        localStorage.setItem("session", SESSION as string);
        localStorage.setItem("token", token as string);
        localStorage.setItem("user", JSON.stringify(user));

        // 120 minutes
        const expires = new Date().getTime() + 2 * 60 * 60 * 1000;
        localStorage.setItem("expires", expires.toString());

        window.location.href = "/";
    } catch (e: any) {
        handle_error(e);
    }
}