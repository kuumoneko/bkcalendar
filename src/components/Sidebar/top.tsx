import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendar,
    faCalendarDays,
    faHome,
} from "@fortawesome/free-solid-svg-icons";

function Side_bar_Button({ text, url }: { text: string; url: string }) {
    const Font_Awesome: any = {
        "Trang chủ": faHome,
        "Lịch học": faCalendar,
        "Thời khoá biểu": faCalendarDays,
    };
    return (
        <li
            className="cursor-default select-none h-[50px] w-[200px] rounded-xl flex flex-row items-center justify-start bg-slate-700 pl-[15px] hover:bg-slate-600 hover:cursor-pointer"
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
            className={`w-[100%] ${
                mode === "row" ? "max-w-[250px] h-[17%] p-7" : "h-[40%] p-2"
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
                    <Side_bar_Button text="Trang chủ" url="/" />
                    <Side_bar_Button text="Thời khoá biểu" url="/schedule" />
                </ul>
            </div>
        </div>
    );
}
