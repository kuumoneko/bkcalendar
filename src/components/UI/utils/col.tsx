import { ReactNode } from "react";
import Nav from "../../Navigator";
import Sidebar from "../../Sidebar/col";

interface WrapperProps {
    children?: ReactNode;
}

const Col: React.FC<WrapperProps> = ({ children }) => {
    return (
        <div className="flex flex-col bg-slate-900 h-screen w-screen items-center justify-center overflow-hidden m-0 p-0 select-none cursor-default">
            {/* make this can scroll y, hidden it */}
            <div className="overflow-y-scroll [&::-webkit-scrollbar]:hidden h-[100%] w-[100%] flex flex-col items-center">
                <Nav />
                <div className="flex flex-col h-[90%] w-[95%] mt-[15px]">
                    <Sidebar />
                    {children && children}
                </div>
                <div className="h-10"></div>
            </div>
        </div>
    );
};

export default Col;
