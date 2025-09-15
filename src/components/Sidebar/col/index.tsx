import Sidebar_Bottom from "./bottom/index";
import Sidebar_Top from "./top/index";

export default function Sidebar_Col() {
    return (
        <div
            className={`flex flex-col h-[25%] w-[100%] items-start justify-evenly`}
        >
            <Sidebar_Top />
            <Sidebar_Bottom />
        </div>
    );
}
