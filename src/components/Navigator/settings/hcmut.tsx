"use client";
import { useEffect, useState } from "react";
import Hcmut_Logo from "../../Logo/index";
import Logout from "../../../utils/logout";

export default function Hcmut() {
    const [user, setuser] = useState<any>(null);

    useEffect(() => {
        setuser(JSON.parse(localStorage.getItem("user") ?? `{"name":null}`));
    }, []);

    const [logout, setlogout] = useState(false);

    useEffect(() => {
        async function run() {
            if (!logout || user === null) {
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
                {!user?.name ? (
                    <div
                        className="cursor-default"
                        onClick={() => {
                            window.location.href = "/login";
                        }}
                    >
                        <span className=" w-[140px] border-solid rounded-[50px] bg-white py-[5px] px-[10px] flex flex-row ml-4 hover:cursor-pointer hover:bg-slate-200">
                            <Hcmut_Logo height={25} width={25} />
                            <span className="text-black ml-2 mt-0.5">
                                Đăng nhập
                            </span>
                        </span>
                    </div>
                ) : (
                    <span
                        className="cursor-default flex flex-row-reverse items-center ml-4 bg-slate-50 rounded-3xl px-[10px] py-[5px] text-slate-500 hover:cursor-pointer hover:bg-slate-400 hover:text-slate-800"
                        onClick={() => {
                            setlogout(true);
                        }}
                    >
                        Đăng xuất
                    </span>
                )}
            </span>
        </div>
    );
}
