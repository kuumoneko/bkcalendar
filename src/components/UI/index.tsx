import { ReactNode, use, useLayoutEffect } from "react";
import Nav from "../Navigator";
import Sidebar from "../Sidebar";

interface WrapperProps {
    children?: ReactNode;
}

const UI: React.FC<WrapperProps> = ({ children }) => {
    useLayoutEffect(() => {
        const temp = JSON.parse(
            localStorage.getItem("user") ?? `{"name":null}`
        );
        const url = window.location.href;
        if (temp.name === null && !url.includes("login")) {
            window.location.href = "/login";
            return;
        }
    }, []);
    return (
        <div className="flex flex-col bg-slate-900 h-screen w-screen items-center justify-center overflow-hidden m-0 p-0 select-none cursor-default">
            <Nav />
            <div className="flex flex-row h-[90%] w-[95%] mt-[15px]">
                <Sidebar />
                {children && children}
            </div>
        </div>
    );
};

export default UI;
