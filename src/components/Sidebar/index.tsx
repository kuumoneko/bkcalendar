import Sidebar_Bottom from "./bottom";
import Sidebar_Top from "./top";

export default function Sidebar({ mode }: { mode: "row" | "col" }) {
    const { height, width } = {
        height: mode === "col" ? "h-[25%]" : "h-full",
        width: mode === "col" ? "w-full" : "w-[15%]",
    };
    return (
        <div
            className={`flex flex-col ${height} ${width} items-start justify-evenly mb-2`}
        >
            <Sidebar_Top mode={mode} />
            <Sidebar_Bottom mode={mode} />
        </div>
    );
}
