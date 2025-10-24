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

        const allErrorCode = Object.keys(Error_code);
        if (allErrorCode.includes(code)) {
            seterror(Error_code[code as keyof typeof Error_code]);
        } else {
            seterror(`Lỗi không xác định, mã lỗi: ${code}`);
        }
    }, []);
    return (
        <>
            <div className="h-full w-full flex flex-col items-center justify-center text-3xl">
                <span>{error}</span>
            </div>
        </>
    );
}
