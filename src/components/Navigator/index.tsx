"use client";
import Hcmut from "./settings/hcmut";
import { convertDateFormat, getnow } from "@/utils/day";

export default function Nav() {
    const { week } = getnow();
    const today = convertDateFormat(
        new Intl.DateTimeFormat("en-CA").format(new Date())
    );
    return (
        <div className="nav bg-slate-700 h-[5%] w-[90%] flex justify-between items-center rounded-full p-6 mt-[10px]">
            <div
                className="title"
                onClick={() => {
                    window.location.href = "/";
                }}
            >
                <span className="cursor-auto select-none text-white hover:cursor-pointer">
                    BK Calendar
                </span>
            </div>
            <div>
                Tuần {week} - {today}
            </div>

            <div className="settings flex flex-row justify-between items-center">
                <Hcmut />
            </div>
        </div>
    );
}
