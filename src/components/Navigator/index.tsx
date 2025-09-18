"use client";
import Themes from "./settings/offline";
import Hcmut from "./settings/hcmut";

export default function Nav() {
    return (
        <div className="nav bg-slate-700 h-[5%] w-[90%] flex justify-between items-center rounded-full p-6 mt-[10px]">
            <div className="title">
                <span className="cursor-auto select-none text-white">
                    BK Calendar
                </span>
            </div>

            <div className="settings flex flex-row justify-between items-center">
                <Themes />
                <Hcmut />
            </div>
        </div>
    );
}
