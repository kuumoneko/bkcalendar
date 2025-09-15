import Sidebar_Bottom from "./bottom/index.tsx";
import Sidebar_Top from "./top/index.tsx";

export default function Sidebar_Row() {
    return (
        <div
            className={`flex flex-col h-[100%] w-[15%] max-w-[250px]  items-start justify-evenly`}
        >
            <Sidebar_Top />
            <Sidebar_Bottom />
        </div>
    );
}
