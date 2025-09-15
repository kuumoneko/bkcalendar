"use client";
import {  useState } from "react";
import SettingsModal from "./settings/index";
import Themes from "./settings/other/gear";

export default function Nav() {
    const [open, setopen] = useState(false);

    return (
        <div className="nav bg-slate-700 h-[50px] w-[90%] flex justify-between items-center rounded-full p-6 mt-[10px]">
            <div className="title">
                <span className="cursor-auto select-none text-white">
                    BK Calendar
                </span>
            </div>

            <div className="settings">
                <Themes
                    setopen={setopen}
                />

                <SettingsModal isOpen={open} setopen={setopen} />
            </div>
        </div>
    );
}
