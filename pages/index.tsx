import check from "@/utils/data/hcmut/app";
import { useEffect } from "react";
import Day from "./day";

export default function Home() {
    useEffect(() => {
        async function run() {
            const res = await check();
            const is_offline =
                localStorage.getItem("offline") === "false" ? false : true;

            const schedule = JSON.parse(
                localStorage.getItem("schedule") ?? "[]"
            );

            if (res !== "ok") {
                if (schedule.length > 0) {
                    localStorage.setItem("offline", "true");
                    return;
                }

                localStorage.setItem("error", "EAI_AGAIN");
                return (window.location.href = "/error");
            } else {
                const user = JSON.parse(
                    localStorage.getItem("user") ?? `{"name":null}`
                );
                if (
                    user.name === null ||
                    (is_offline && schedule.length === 0)
                ) {
                    return (window.location.href = "/down");
                }
            }
        }
        run();
    }, []);
    return <Day />;
}
