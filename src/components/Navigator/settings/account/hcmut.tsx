"use client";
import { useEffect, useState } from "react";
import Hcmut_Logo from "../../../Logo/index";
import Logout from "../../../../utils/logout";

export default function Hcmut() {
    const [user, setuser] = useState(
        JSON.parse(localStorage.getItem("user") ?? `{"name":null}`)
    );

    const [logout, setlogout] = useState(false);

    useEffect(() => {
        async function run() {
            if (!logout) {
                return;
            }

            Logout();
            setuser({ name: null });
            localStorage.setItem("user", JSON.stringify({ name: null }));
            setlogout(false);
        }
        run();
    }, [logout]);

    return (
        <div>
            <span className="flex flex-row justify-between items-center">
                <span className="flex flex-row items-center">
                    <Hcmut_Logo height={20} width={20} />
                    <span className="text-lg font-semibold text-gray-200 ml-2">
                        Tài khoản HCMUT:
                    </span>
                </span>

                {!user.name ? (
                    <div
                        className="cursor-default"
                        onClick={() => {
                            window.location.href = "/login";
                        }}
                    >
                        <span className=" w-[140px] border-solid rounded-[50px] bg-white py-[5px] px-[10px] flex flex-row">
                            <Hcmut_Logo height={25} width={25} />
                            <span className="text-black ml-2 mt-0.5">
                                Đăng nhập
                            </span>
                        </span>
                    </div>
                ) : (
                    <div className="flex flex-row-reverse items-center justify-center">
                        <span className="pl-[5px]">{user.name}</span>
                    </div>
                )}
            </span>
            {user.name && (
                <span
                    className="cursor-default flex flex-row-reverse items-center"
                    onClick={() => {
                        setlogout(true);
                    }}
                >
                    log out
                </span>
            )}
        </div>
    );
}
