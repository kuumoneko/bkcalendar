import { ReactNode, use, useLayoutEffect, useState } from "react";
import Nav from "../Navigator";
// import Sidebar from "../Sidebar";
import check from "@/utils/hcmut/app";
import Col from "./utils/col";
import Row from "./utils/row";

interface WrapperProps {
    children?: ReactNode;
}

const UI: React.FC<WrapperProps> = ({ children }) => {
    const [mode, setmode] = useState("row");
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

        const running = setInterval(() => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            if (height > width) {
                setmode("col");
            } else {
                setmode("row");
            }
        }, 1000);

        run();

        return () => {
            clearInterval(running);
        };
    }, []);

    return (
        <div className="flex flex-col bg-slate-900 h-screen w-screen items-center justify-center overflow-hidden m-0 p-0 select-none cursor-default">
            {mode === "col" ? (
                <Col>{children && children}</Col>
            ) : (
                <Row>{children && children}</Row>
            )}
        </div>
    );
};

export default UI;
