// Add this to the first line of your file
"use client";

import { useEffect, useState } from "react";

// Define style mappings outside the component
const containerStyles = {
    row: "h-[60%] max-w-[250px] flex-col",
    col: "h-[100%] flex-row",
};

const userDetailsStyles = {
    row: "flex-col w-[100%]",
    col: "flex-row w-[100%]",
};

const columnOneStyles = {
    row: "w-[100%]",
    col: "w-[40%]",
};

const columnTwoStyles = {
    row: "w-[100%]",
    col: "w-[60%]",
};

export default function Sidebar_Bottom({ mode }: { mode: "row" | "col" }) {
    const [user, setUser] = useState({
        name: null,
        MSSV: null,
        class: null,
        status: null,
        major: null,
        teachingDep: null,
    });

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    return (
        <div
            className={`w-full mt-4 bg-slate-700 text-white rounded-3xl p-5 flex items-center justify-between ${containerStyles[mode]}`}
        >
            {!user.name ? (
                <div>
                    <span>
                        {
                            "Chưa đăng nhập, hãy đăng nhập bằng cách chọn Cài đặt -> Tài khoản HCMUT"
                        }
                    </span>
                </div>
            ) : (
                <div className={`flex ${userDetailsStyles[mode]}`}>
                    <div className={`flex flex-col ${columnOneStyles[mode]}`}>
                        <span className="mb-2">{user.name}</span>
                        <span className="mt-2">MSSV: {user.MSSV}</span>
                        <span className="mt-2">Lớp: {user.class}</span>
                        <span className="mt-2">Tình trạng: {user.status}</span>
                    </div>

                    <div className={`flex flex-col ${columnTwoStyles[mode]}`}>
                        <span className="mt-4">{user.major}</span>
                        <span className="mt-3">{user.teachingDep}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
