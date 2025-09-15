import Sidebar_Bottom from "./bottom/index.tsx";
import Sidebar_Top from "./top/index.tsx";

export default function Sidebar() {
    return (
        <div
            className={`flex flex-col h-[25%] w-[100%] items-start justify-evenly`}
        >
            <Sidebar_Top />
            <Sidebar_Bottom />
        </div>
    );
}
