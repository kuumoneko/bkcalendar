"use client";

import { useEffect, useState } from "react";

const containerStyles = {
    row: "h-[60%] max-w-[250px] flex-col",
    col: "h-full flex-row",
};

const userDetailsStyles = {
    row: "flex-col w-full",
    col: "flex-row w-full",
};

const columnOneStyles = {
    row: "w-full",
    col: "w-[40%]",
};

const columnTwoStyles = {
    row: "w-full",
    col: "w-[60%]",
};

export default function Sidebar_Bottom({ mode }: { mode: "row" | "col" }) {
    const [user, setUser] = useState<any>({
        name: null,
        MSSV: null,
        class: null,
        status: null,
        major: null,
        teachingDep: null,
        semester: "",
        semesters: [],
    });

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    function handleSemesterChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const newSemester = e.target.value;
        const updatedUser = { ...user, semester: newSemester };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        window.location.reload();
    }

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

                    {user.semesters && user.semesters.length > 0 && (
                        <div className="w-full mt-3 flex flex-row items-center">
                            <span className="text-sm whitespace-nowrap mr-2">
                                Học kỳ:
                            </span>
                            <select
                                className="flex-1 bg-slate-800 text-slate-100 text-sm rounded-lg px-2 py-1 cursor-pointer hover:bg-slate-600 outline-none w-full"
                                value={user.semester}
                                onChange={handleSemesterChange}
                            >
                                {user.semesters.map((s: any) => (
                                    <option key={s.code} value={s.code}>
                                        {s.nameVi}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
