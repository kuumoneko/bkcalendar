import Sidebar_Bottom from "./bottom";
import Sidebar_Top from "./top";

export default function Sidebar({ mode }: { mode: "row" | "col" }) {
    const { height, width } = {
        height: mode === "col" ? "25" : "100",
        width: mode === "col" ? "100" : "15",
    };
    return (
        <div
            className={`flex flex-col h-[${height}%] w-[${width}%] items-start justify-evenly mb-2`}
        >
            <Sidebar_Top mode={mode} />
            <Sidebar_Bottom mode={mode} />
        </div>
    );
}
