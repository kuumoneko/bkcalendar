import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
enum Error_code {
    EAI_AGAIN = "Web trường sập rồi bạn, thử lại sau nhó",
}

export default function ErrorPage() {
    const searchParams = useSearchParams();
    const code = searchParams.get("code") ?? "";
    const [error, seterror] = useState("");
    useEffect(() => {
        const isOffline = Boolean(localStorage.getItem("offline") ?? "false");
        if (isOffline) window.location.href = "/";

        const allErrorCode = Object.keys(Error_code);
        if (allErrorCode.includes(code)) {
            seterror(Error_code[code as keyof typeof Error_code]);
        } else {
            seterror(`Undefined error, code: ${code}`);
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
