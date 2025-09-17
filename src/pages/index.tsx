import UI from "@/components/UI";
import check from "@/utils/hcmut/app";
import { useEffect, useState } from "react";
import Day from "./day";

export default function Home() {
    const [is_good, set_good] = useState<boolean | null>(null);

    useEffect(() => {
        async function run() {
            const res = await check();
            const is_offline = Boolean(
                localStorage.getItem("offline") ?? "false"
            );
            const schedule = JSON.parse(
                localStorage.getItem("schedule") ?? "[]"
            );

            if (res !== "ok") {
                if (schedule.length > 0) {
                    localStorage.setItem("offline", "true");
                    set_good(true);
                    return;
                }

                localStorage.setItem("error", "EAI_AGAIN");
                return (window.location.href = "/error");
            } else {
                const user = JSON.parse(
                    localStorage.getItem("user") ?? `{"name":null}`
                );
                if (user.name === null) {
                    return (window.location.href = "/login");
                }

                if (is_offline && schedule.length === 0) {
                    alert(
                        "There is no saved schedule, so you need to login again"
                    );
                    return (window.location.href = "/login");
                }

                set_good(true);
            }
        }
        run();
    }, []);
    return <UI>{is_good && <Day />}</UI>;
}
