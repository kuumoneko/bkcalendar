"use client";
import UI from "@/components/UI";
import { useEffect,  useState } from "react";
import Table from "../components/table/index";
import Logout from "@/utils/logout";
import full_schedule from "@/utils/schdule";
import { handle_error } from "@/utils/error";
import { SubjectInfo } from "../types/index";
import { useOrientationMode } from "@/hooks/display";

/**
 * Convert Date to yyyy-mm-dd
 */
function parseDay(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const monthPadded = String(month).padStart(2, "0"); // to mm
    const dayPadded = String(day).padStart(2, "0"); // to dd
    return `${year}-${monthPadded}-${dayPadded}`;
}

/**
 * Convert yyyy-mm-dd to date month year in vietnamese
 */
function parseDaytoVietnamese(date: string): string {
    const [year, month, day] = date.split("-");
    return `Ngày ${Number(day)} tháng ${Number(month)} năm ${year}`;
}

/**
 * Create Schedule by day
 */
function create_day_schedule(date: string, schedule: SubjectInfo[]) {
    return schedule.filter((subject) => {
        if (typeof subject.dates === "string") {
            return subject.dates === date;
        }
        return subject.dates.includes(date);
    });
}

export default function Home() {
    const [today_sche, set_today_sche] = useState<SubjectInfo[]>([]);
    const [closestDay, setClosestDay] = useState<string | null>(null);
    const [closestDaySche, setClosestDaySche] = useState<SubjectInfo[]>([]);

    const today = parseDay(new Date());

    useEffect(() => {
        async function run() {
            try {
                let schedule: SubjectInfo[] = JSON.parse(
                    localStorage.getItem("schedule") ?? "[]"
                );
                try {
                    schedule = await full_schedule();
                    if (
                        (schedule as unknown as string) === "notlogin" &&
                        schedule.length < 1
                    ) {
                        Logout();
                        window.location.href = "/login";
                        return;
                    }
                } catch (e: any) {
                    const temp = localStorage.getItem("schdule") ?? "[]";
                    schedule = JSON.parse(temp);
                    if (schedule.length === 0) {
                        handle_error(e);
                        return;
                    }
                }

                const today_subject = create_day_schedule(today, schedule);
                set_today_sche(today_subject);

                const allDates: any[] = [
                    ...new Set(schedule.flatMap((s: any) => s.dates)),
                ];

                const closestFutureDateString = allDates
                    .filter((dateStr: string) => dateStr > today)
                    .sort()[0];

                if (closestFutureDateString) {
                    setClosestDay(closestFutureDateString);
                    const closestDaySubjects = create_day_schedule(
                        closestFutureDateString,
                        schedule
                    );
                    setClosestDaySche(closestDaySubjects);
                }
            } catch (e) {
                if (e === "ECONNRESET") {
                    Logout();
                    window.location.href = "/login";
                }
            }
        }
        run();
    }, [today]);

    const mode = useOrientationMode();

    return (
        <UI>
            <div
                className={`flex flex-col items-center mt-10 ${
                    mode === "row" && "ml-10"
                } w-[100%] max-x-[1500px]`}
            >
                <div className="flex flex-col items-center justify-center w-[100%]">
                    <h1>Hôm nay là {parseDaytoVietnamese(today)}</h1>
                    {today_sche.length > 0 ? (
                        <Table subjects={today_sche} />
                    ) : (
                        <p className="mt-4">Hôm nay không có môn học.</p>
                    )}
                </div>
                {closestDay && closestDaySche.length > 0 && (
                    <div className="flex flex-col items-center justify-center w-[100%] mt-8">
                        <h1>
                            Ngày học tiếp theo là{" "}
                            {parseDaytoVietnamese(closestDay)}
                        </h1>
                        {closestDaySche.length > 0 && (
                            <Table subjects={closestDaySche} />
                        )}
                    </div>
                )}
            </div>
        </UI>
    );
}
