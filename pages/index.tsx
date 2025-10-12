import check from "@/utils/data/hcmut/app";
import { useEffect } from "react";
import Day from "./day";

export default function Home() {
    useEffect(() => {
        async function run() {
            const res = await check();
            if (res !== "ok") {
                localStorage.setItem("error", "EAI_AGAIN");
                return (window.location.href = "/error");
            } else {
                const user = JSON.parse(
                    localStorage.getItem("user") ?? `{"name":null}`
                );
                if (user.name === null) {
                    return (window.location.href = "/down");
                }
            }
        }
        run();
    }, []);
    return <Day />;
}
