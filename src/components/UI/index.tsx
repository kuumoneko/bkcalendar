import { ReactNode, useEffect } from "react";
import Nav from "../Navigator";
import check from "@/utils/hcmut/app";
import { useOrientationMode } from "@/hooks/display";
import Footer from "../Footer";
import Sidebar from "../Sidebar";

interface WrapperProps {
    children?: ReactNode;
}

const UI: React.FC<WrapperProps> = ({ children }) => {
    const mode = useOrientationMode();

    useEffect(() => {
        async function run() {
            const isOffline = Boolean(
                localStorage.getItem("offline") ?? "false"
            );
            if (isOffline) return;

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
            <div className="flex flex-col bg-slate-900 h-full w-full items-center justify-start m-0 p-0 select-none cursor-default">
                <Nav />
                <div
                    className={`flex ${
                        mode === "row" ? "flex-row" : "flex-col"
                    } h-[85%] w-[95%] mt-[15px]`}
                >
                    <Sidebar mode={mode} />
                    {children && children}
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default UI;
