import { useLayoutEffect, useState } from "react";

enum Error_code {
    EAI_AGAIN = "Web trường sập rồi bạn, thử lại sau nhó",
}

export default function ErrorPage() {
    const [error, seterror] = useState("");

    useLayoutEffect(() => {
        const isOffline = Boolean(localStorage.getItem("offline") ?? "false");
        if (isOffline) window.location.href = "/";

        const temp = localStorage.getItem("error") ?? "";
        const allErrorCode = Object.keys(Error_code);

        if (allErrorCode.includes(temp)) {
            seterror(Error_code[temp as keyof typeof Error_code]);

            const tempp = localStorage.getItem("schedule") ?? "[]";
            if (temp === "EAI_AGAIN" && tempp !== "[]") {
                localStorage.setItem("offline", "true");
                localStorage.setItem("error", "");
                window.location.href = "/";
            }
        } else {
            seterror(`Lỗi không xác định, code: ${temp}`);
        }
    }, []);

    return (
        <>
            <div className="h-[100%] w-[100%] flex flex-col items-center justify-center text-3xl">
                <span>{error}</span>
            </div>
        </>
    );
}
