"use client";
import { useEffect, useState } from "react";
import Hcmut_Logo from "../../../Logo/index.tsx";
import Logout from "../../../../utils/logout.ts";
// import { Data, fetch_data } from "../../../../utils/fetch.ts";

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
                        HCMUT Account:
                    </span>
                </span>

                {!user.name ? (
                    <div
                        className="cursor-default"
                        onClick={() => {
                            window.location.href = "/login";
                        }}
                    >
                        <span className="border-solid rounded-[50px] bg-white py-[5px] px-[10px] text-black flex flex-row">
                            <Hcmut_Logo height={20} width={20} />
                            Log in
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
