import { ReactNode, useEffect, useLayoutEffect, useState } from "react";
import Nav from "../Navigator";
import check from "@/utils/hcmut/app";
import Sidebar_Col from "../Sidebar/col";
import Sidebar_Row from "../Sidebar/row";
import { useOrientationMode } from "@/hooks/display";

interface WrapperProps {
    children?: ReactNode;
}

const UI: React.FC<WrapperProps> = ({ children }) => {
    const mode = useOrientationMode();

    useLayoutEffect(() => {
        async function run() {
            const res = await check();

            const url = window.location.href;

            if (res == "ok") {
                const temp = JSON.parse(
                    localStorage.getItem("user") ?? `{"name":null}`
                );
                if (
                    temp.name === null &&
                    !url.includes("login") &&
                    !url.includes("error")
                ) {
                    window.location.href = "/login";
                    return;
                }
            } else {
                if (!url.includes("error")) {
                    window.location.href = "/error";
                }
            }
        }
        run();
    }, []);

    return (
        <div
            className={
                "flex flex-col bg-slate-900 h-screen w-screen items-center justify-center m-0 p-0 select-none cursor-default"
            }
        >
            <div className="flex flex-col bg-slate-900 h-screen w-screen items-center justify-center overflow-y-scroll [&::-webkit-scrollbar]:hidden m-0 p-0 select-none cursor-default">
                <Nav />
                <div className={`flex flex-${mode} h-[90%] w-[95%] mt-[15px]`}>
                    {mode === "col" ? <Sidebar_Col /> : <Sidebar_Row />}
                    {children && children}
                </div>
            </div>
        </div>
    );
};

export default UI;
