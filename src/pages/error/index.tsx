import UI from "@/components/UI";
import { useLayoutEffect, useState } from "react";

enum Error_code {
    EAI_AGAIN = "Web trường sập rồi bạn, thử lại sau nhó",
}

export default function ErrorPage() {
    const [error, seterror] = useState("");

    useLayoutEffect(() => {
        const temp = localStorage.getItem("error") ?? "";
        const allErrorCode = Object.keys(Error_code);

        if (allErrorCode.includes(temp)) {
            seterror(Error_code[temp as keyof typeof Error_code]);
        } else {
            seterror(`Lỗi không xác định, code: ${temp}`);
        }
    }, []);

    return (
        <UI>
            <div className="h-[100%] w-[100%] flex flex-col items-center justify-center text-3xl">
                <span>{error}</span>
            </div>
        </UI>
    );
}
