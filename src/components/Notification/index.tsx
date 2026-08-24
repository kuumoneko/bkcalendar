"use client";

import { useEffect, useState } from "react";

interface NotiItem {
    id: string;
    message: string;
    type: "error" | "info";
}

export default function Notification() {
    const [notis, set_notis] = useState<NotiItem[]>([]);

    useEffect(() => {
        function on_noti(event: Event) {
            const detail = (event as CustomEvent<NotiItem>).detail;
            set_notis((prev) => [...prev, detail]);
            setTimeout(() => {
                set_notis((prev) => prev.filter((n) => n.id !== detail.id));
            }, 6000);
        }
        window.addEventListener("bk-noti", on_noti);
        return () => window.removeEventListener("bk-noti", on_noti);
    }, []);

    if (notis.length === 0) {
        return null;
    }

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80 max-w-[90vw]">
            {notis.map((noti) => (
                <div
                    key={noti.id}
                    className={`flex items-start justify-between gap-2 rounded-3xl p-3 text-white shadow-lg border ${
                        noti.type === "error"
                            ? "bg-red-900/95 border-red-700"
                            : "bg-slate-700/95 border-slate-600"
                    }`}
                >
                    <span className="text-sm break-words">{noti.message}</span>
                    <button
                        className="text-slate-300 hover:text-white shrink-0 cursor-pointer"
                        onClick={() =>
                            set_notis((prev) =>
                                prev.filter((n) => n.id !== noti.id),
                            )
                        }
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
}
