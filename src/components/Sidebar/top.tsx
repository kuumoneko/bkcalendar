import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendarCheck,
    faCalendarDays,
    faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { useOrientationMode } from "@/hooks/display";

function Side_bar_Button({ text, url }: { text: string; url: string }) {
    const mode = useOrientationMode();
    const Font_Awesome: any = {
        "Lịch thi": faCalendarCheck,
        "Thời khoá biểu": faCalendarDays,
        "Bộ lọc": faFilter,
    };
    return (
        <li
            className={`cursor-default select-none h-[50px] w-[200px] rounded-xl flex flex-row items-center ${
                mode === "col" ? "justify-center " : "justify-start "
            } bg-slate-700 pl-[15px] hover:bg-slate-600 hover:cursor-pointer`}
            onClick={() => {
                window.location.href = url;
            }}
        >
            <FontAwesomeIcon
                icon={Font_Awesome[text]}
                className="text-slate-300 mr-[5px] pb-[5px]"
            />
            <span className="text-neutral-400 no-underline">{text}</span>
        </li>
    );
}

export default function Sidebar_Top({ mode }: { mode: "row" | "col" }) {
    return (
        <div
            className={`w-full ${
                mode === "row" ? "max-w-[250px] h-[22%] p-7" : "h-[40%] p-2"
            } bg-slate-700 text-white rounded-3xl`}
        >
            <div className="navigation">
                <ul
                    className={`list-none p-0 m-0 ${
                        mode === "col"
                            ? "flex flex-row items-center justify-evenly"
                            : ""
                    }`}
                >
                    <Side_bar_Button text="Lịch thi" url="/exam" />
                    <Side_bar_Button text="Thời khoá biểu" url="/schedule" />
                    <Side_bar_Button text="Bộ lọc" url="/filter" />
                </ul>
            </div>
        </div>
    );
}
