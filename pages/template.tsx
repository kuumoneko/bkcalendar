import Footer from "@/components/Footer";
import Nav from "@/components/Navigator";
import Sidebar from "@/components/Sidebar";
import { useOrientationMode } from "@/hooks/display";
import { useEffect } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
    const mode = useOrientationMode();

    useEffect(() => {
        if (document.referrer === "") {
            localStorage.setItem("offline", "false");
            localStorage.setItem("error", "");
            localStorage.setItem("user", `{"name":null}`);
            window.location.href = "/login";
        }
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
