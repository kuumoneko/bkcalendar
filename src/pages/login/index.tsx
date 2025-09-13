import Hcmut_Logo from "@/components/Logo";
import UI from "@/components/UI";

import create_app from "@/utils/hcmut/create/app";
import create_login from "@/utils/hcmut/create/login";

import login_user from "@/utils/hcmut/auth/login";
import get_token from "@/utils/hcmut/auth/user";

import get_student_data from "@/utils/hcmut/data/student";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";

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

            const res = await login_user(
                JSESSIONID || "",
                ltValue || "",
                executionValue || "",
                username,
                password
            );

            const { SESSION } = await create_app(res as string);
            const token = await get_token(SESSION as string);
            const user = await get_student_data(token as string);
            // console.log(user);
            localStorage.setItem("session", SESSION as string);
            localStorage.setItem("token", token as string);

            // console.log(user);
            localStorage.setItem("user", JSON.stringify(user));

            const expires = new Date().getTime() + 60 * 60 * 1000;
            localStorage.setItem("expires", expires.toString());

            window.location.href = "/";
            setlogin(false);
        }
        run();
    }, [login]);

    return (
        <UI>
            <div className="login ml-10 mt-10 flex flex-col items-center h-[100%] w-[80%]">
                <h1 className="text-3xl w-[100%] font-bold text-center mb-5 border-b-2 pb-3 flex flex-row items-center justify-center">
                    <Hcmut_Logo height={40} width={40} />
                    Login with HCMUT Account
                </h1>
                <div className="login_form flex flex-col">
                    <span>
                        Enter username and password to login with HCMUT Account
                    </span>
                    <form className="flex flex-col cursor-default select-none">
                        <div className="flex flex-col w-[100%]">
                            <label htmlFor="username">Username:</label>
                            <input
                                className="text-slate-800 w-[95%] bg-slate-500 rounded-2xl px-4"
                                type="text"
                                name="username"
                                id="username"
                                value={username}
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="off"
                                onChange={(e) => serusername(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col w-[100%]">
                            <label htmlFor="password">Pasword:</label>
                            <div className="flex flex-row ">
                                <input
                                    className="text-slate-800 w-[95%] mr-[5px] bg-slate-500 rounded-2xl px-4"
                                    type={hidden ? "password" : "text"}
                                    name="password"
                                    id="password"
                                    value={password}
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="off"
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
                                className="ml-10"
                                onClick={() => {
                                    setlogin(true);
                                }}
                            >
                                Login
                            </div>
                            <div>Clear</div>
                        </div>
                    </form>
                </div>
            </div>
        </UI>
    );
}
