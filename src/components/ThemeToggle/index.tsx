"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { get_current_theme, toggle_theme, ThemeMode } from "@/utils/theme";

export default function ThemeToggle() {
    const [theme, set_theme] = useState<ThemeMode>("dark");

    useEffect(() => {
        set_theme(get_current_theme());
    }, []);

    return (
        <div
            className="cursor-default flex items-center justify-center ml-4 bg-slate-800 rounded-3xl px-2.5 py-1.25 text-slate-100 hover:cursor-pointer hover:bg-slate-400 hover:text-slate-800"
            onClick={() => set_theme(toggle_theme())}
        >
            <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} />
        </div>
    );
}
