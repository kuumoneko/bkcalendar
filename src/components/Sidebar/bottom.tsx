import { useEffect, useState } from "react";

export default function Sidebar_Bottom({ mode }: { mode: "row" | "col" }) {
    const [user, setuser] = useState({
        name: null,
        MSSV: null,
        class: null,
        status: null,
        major: null,
        teachingDep: null,
    });

    useEffect(() => {
        setuser(JSON.parse(localStorage.getItem("user") ?? `{"name":null}`));
    }, []);

    return (
        <div
            className={`w-[100%] h-[${mode === "col" ? "100" : "60"}%] ${
                mode === "row" && "max-x-[250px] "
            } mt-4 bg-slate-700 text-white rounded-3xl p-5 flex flex-col items-center justify-between`}
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
                <div
                    className={`flex flex-${
                        mode === "col" ? "row" : "col"
                    } w-[100%]`}
                >
                    <div
                        className={`flex flex-col w-[${
                            mode === "col" ? "40" : "100"
                        }%]`}
                    >
                        <span className="mb-2">{user.name}</span>
                        <span className="mt-2">MSSV: {user.MSSV}</span>
                        <span className="mt-2">Lớp: {user.class}</span>
                        <span className="mt-2">Tình trạng: {user.status}</span>
                    </div>

                    <div
                        className={`flex flex-col w-[${
                            mode === "col" ? "60" : "100"
                        }%]`}
                    >
                        <span className="mt-4">{user.major}</span>
                        <span className="mt-3">{user.teachingDep}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
