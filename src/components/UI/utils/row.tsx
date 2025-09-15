import { ReactNode } from "react";
import Nav from "../../Navigator";
import Sidebar from "../../Sidebar/row";

interface WrapperProps {
    children?: ReactNode;
}

const Row: React.FC<WrapperProps> = ({ children }) => {
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

export default Row;
