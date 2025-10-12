"use client";
import { useOrientationMode } from "@/hooks/display";
import Hcmut from "./settings/hcmut";
import { convertDateFormat, getnow } from "@/utils/day";

export default function Nav() {
    const { week } = getnow();
    const mode = useOrientationMode();

    const today =
        mode === "row"
            ? convertDateFormat(
                  new Intl.DateTimeFormat("en-CA").format(new Date())
              )
            : new Intl.DateTimeFormat("en-US", {
                  weekday: "short",
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
              }).format(new Date());

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
            {mode === "row" ? (
                <div>
                    Tuần {week} - {today}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center">
                    <div>Tuần {week}</div>
                    <div>{today}</div>
                </div>
            )}

            <div className="settings flex flex-row justify-between items-center">
                <div className="hover:cursor-pointer hover:bg-slate-400 hover:text-slate-800 px-[10px] py-[5px] text-slate-100 rounded-3xl bg-slate-800" onClick={() => {window.location.href = "/export";}}>
                    Export
                </div>
                <Hcmut />
            </div>
        </div>
    );
}
