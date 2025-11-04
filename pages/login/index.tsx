import Hcmut_Logo from "@/components/Logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { handle_error } from "@/utils/error";
import { useOrientationMode } from "@/hooks/display";
import logining from "@/utils/data/login";
import { convert } from "@/lib/pass";

export default function Login() {
    useEffect(() => {
        const user = JSON.parse(
            localStorage.getItem("user") ?? `{"name":null}`
        );
        if (user.name !== null) {
            alert("Bạn đã đăng nhập trước đó.");
            window.location.href = "/";
        }
    }, []);

    const [username, serusername] = useState("");
    const [password, serpassword] = useState("");
    const [hidden, sethidden] = useState(true);
    const [login, setlogin] = useState(false);

    useEffect(() => {
        if (!login) {
            return;
        }
        if (username.length === 0 || password.length === 0) {
            alert("Vui lòng nhập tài khoản và mật khẩu");
            return setlogin(false);
        }
        async function run() {
            try {
                await logining(username, convert(password));
                setlogin(false);
            } catch (e: any) {
                handle_error(e);
            }
        }
        run();
    }, [login]);

    const mode = useOrientationMode();

    return (
        <>
            <div
                className={`login ml-15 ${
                    mode === "row" ? "mt-10" : "mt-6"
                } flex flex-col items-center h-full w-[80%]`}
            >
                <h1 className="text-3xl w-full font-bold text-center mb-5 border-b-2 pb-3 flex flex-row items-center justify-center">
                    <Hcmut_Logo height={40} width={40} />
                    Đăng nhập bằng tài khoản HCMUT
                </h1>
                <div className="login_form flex flex-col">
                    <form className="flex flex-col cursor-default select-none">
                        <div className="flex flex-col w-full">
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
                        <div className="flex flex-col w-full mt-1">
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
                                {!login ? (
                                    <span>Đăng nhập</span>
                                ) : (
                                    <span>Đang đăng nhập...</span>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
