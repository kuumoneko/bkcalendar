import Hcmut_Logo from "@/components/Logo";
import UI from "@/components/UI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { handle_error } from "@/utils/error";
import { useOrientationMode } from "@/hooks/display";
import create_app from "@/utils/hcmut/app/login";
import create_login from "@/utils/hcmut/sso/index";
import login_user from "@/utils/hcmut/sso/login";
import get_token from "@/utils/hcmut/app/user";
import get_student_data from "@/utils/hcmut/api/student";

export default function Login() {
    const [username, serusername] = useState("");
    const [password, serpassword] = useState("");
    const [hidden, sethidden] = useState(true);
    const [login, setlogin] = useState(false);

    useEffect(() => {
        if (!login) {
            return;
        }
        async function run() {
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

                const { SESSION } = await create_app(res as string);
                const token = await get_token(SESSION as string);

                if (token === "ok") {
                    handle_error("EAI_AGAIN");
                }

                const user = await get_student_data(token as string);

                localStorage.setItem("session", SESSION as string);
                localStorage.setItem("token", token as string);
                localStorage.setItem("user", JSON.stringify(user));

                const expires = new Date().getTime() + 60 * 60 * 1000;
                localStorage.setItem("expires", expires.toString());

                window.location.href = "/";
                setlogin(false);
            } catch (e: any) {
                handle_error(e);
            }
        }
        run();
    }, [login]);

    const mode = useOrientationMode();

    return (
        <UI>
            <div
                className={`login ml-15 mt-${mode === "row" ? 10 : 15} ${
                    mode === "col" && "mt-6"
                } flex flex-col items-center h-[100%] w-[80%]`}
            >
                <h1 className="text-3xl w-[100%] font-bold text-center mb-5 border-b-2 pb-3 flex flex-row items-center justify-center">
                    <Hcmut_Logo height={40} width={40} />
                    Đăng nhập bằng tài khoản HCMUT
                </h1>
                <div className="login_form flex flex-col">
                    <form className="flex flex-col cursor-default select-none">
                        <div className="flex flex-col w-[100%]">
                            <label htmlFor="username">Tên tài khoản:</label>
                            <input
                                className="text-slate-800 w-[95%] bg-slate-500 rounded-2xl px-4"
                                type="text"
                                name="username"
                                id="username"
                                value={username}
                                onChange={(e) => serusername(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col w-[100%] mt-1">
                            <label htmlFor="password">Mật khẩu:</label>
                            <div className="flex flex-row ">
                                <input
                                    className="text-slate-800 w-[95%] mr-[5px] bg-slate-500 rounded-2xl px-4"
                                    type={hidden ? "password" : "text"}
                                    name="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => {
                                        serpassword(e.target.value);
                                    }}
                                />
                                <div>
                                    <FontAwesomeIcon
                                        icon={hidden ? faEye : faEyeSlash}
                                        onClick={() => {
                                            sethidden(!hidden);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row-reverse items-start mt-5 w-[95%]">
                            <div
                                className="ml-10 bg-indigo-500 px-3 py-1.5 rounded-2xl hover:cursor-pointer"
                                onClick={() => {
                                    setlogin(true);
                                }}
                            >
                                Đăng nhập
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </UI>
    );
}
