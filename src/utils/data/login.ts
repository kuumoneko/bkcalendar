import get_student_data from "@/utils/data/hcmut/api/student";
import { handle_error } from "@/utils/error";
import login_db from "@/utils/data/databsae/login";
import mongodb from "@/utils/data/databsae";
import get_web_semester from "./hcmut/api/semester";
import deepEqual from "../object";
import fetch_data from "../fetch";

export default async function logining(username: string, password: string) {

    try {
        let result, token = "";
        await Promise.all([
            login_db(username, password).then((res: any) => {
                result = res;
            }),
            fetch_data("/api/login", {}, {
                username: username,
                password: password
            }).then((res: string) => {
                token = res;
            })
        ])

        if (token === "ok" || token === undefined) {
            if (!result) {
                throw new Error("Đăng nhập thất bại. Web trường bị sập và database không có thông tin tài khoản của bạn. Vui lòng thử lại sau.");
            }
            else {
                localStorage.setItem("token", "");
                localStorage.setItem("offline", "true");
            }
        }
        else {
            mongodb("password", "post", { username: username, password: password });
        }

        const data_promises: any[] = [];

        let database_user: any, database_semester, mybk_user: any, mybk_semester;

        data_promises.push(
            mongodb("user", "get", { username: username }).then((res: any) => {
                const { _id, username, ...data } = res;

                database_user = data;
            })
        )
        if (token !== "ok") {
            data_promises.push(
                get_student_data(token as string).then((res: any) => {
                    mybk_user = res;
                })
            )
            data_promises.push(
                get_web_semester().then((res: string) => {
                    mybk_semester = res
                })
            )
        }

        await Promise.all(data_promises);

        let user;

        if (token !== "ok") {
            if (!deepEqual(mybk_user, database_user)) {
                await mongodb("user", "post", {
                    username: username, data: {
                        ...mybk_user,
                        semester: mybk_semester
                    }
                })
            }
            user = {
                username: username,
                ...mybk_user,
                semester: mybk_semester
            };
        }
        else {
            user = {
                username: username,
                ...database_user,
                semester: database_semester
            };
        }
        localStorage.setItem("token", token as string);
        localStorage.setItem("user", JSON.stringify(user));
        const expires = new Date().getTime() + 2 * 60 * 60 * 1000;
        localStorage.setItem("expires", expires.toString());
        window.location.href = "/";
    } catch (e: any) {
        handle_error(e)
    }
}