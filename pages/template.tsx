import Footer from "@/components/Footer";
import Nav from "@/components/Navigator";
import Sidebar from "@/components/Sidebar";
import { useOrientationMode } from "@/hooks/display";
import get_web_semester from "@/utils/data/hcmut/api/semester";
import check from "@/utils/data/hcmut/app";
import { useEffect } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
    const mode = useOrientationMode();

    useEffect(() => {
        const hasVisited = sessionStorage.getItem("hasVisited") ?? false;

        if (!hasVisited) {
            sessionStorage.setItem("hasVisited", "true");
            localStorage.setItem("offline", "false");
            localStorage.setItem("error", "");
            localStorage.setItem("user", `{"name":null}`);
            alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
            window.location.href = "/login";
        }

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
                const this_semester = await get_web_semester();
                localStorage.setItem("semester", this_semester);

                if (
                    temp.name === null &&
                    !url.includes("login") &&
                    !url.includes("error")
                ) {
                    if (!window.location.href.includes("login"))
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
}
