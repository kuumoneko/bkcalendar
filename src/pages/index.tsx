"use client";
import UI from "@/components/UI";
import { useEffect, useState } from "react";
import Table, { Subject } from "../utils/table.tsx";
import Logout from "@/utils/logout.ts";
import full_schedule from "@/utils/schdule.ts";

const parseDay = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    // convert to yyyy-mm-dd
    const monthPadded = String(month).padStart(2, "0");
    const dayPadded = String(day).padStart(2, "0");
    return `${year}-${monthPadded}-${dayPadded}`;
};

// function to change yyyy-mm-dd to date month year in vietnamese
const parseDaytoVietnamese = (date: string) => {
    const [year, month, day] = date.split("-");
    return `Ngày ${Number(day)} tháng ${Number(month)} năm ${year}`;
};

const create_day_schedule = (date: string, schedule: Subject[]) => {
    return schedule.filter((subject) => {
        if (typeof subject.dates === "string") {
            return subject.dates === date;
        }
        return subject.dates.includes(date);
    });
};

export default function Home() {
    const [today_sche, set_today_sche] = useState<Subject[]>([]);
    const [closestDay, setClosestDay] = useState<string | null>(null);
    const [closestDaySche, setClosestDaySche] = useState<Subject[]>([]);

    const today = parseDay(new Date());

    useEffect(() => {
        async function run() {
            try {
                const schedule = await full_schedule();

                // find the subject that has in today
                const today_subject = create_day_schedule(today, schedule);
                set_today_sche(today_subject);

                // Find the closest day with subjects after today
                const allDates: any[] = [
                    ...new Set(schedule.flatMap((s: any) => s.dates)),
                ];

                const closestFutureDateString = allDates
                    .filter((dateStr: string) => dateStr > today) // string comparison works for YYYY-MM-DD
                    .sort()[0]; // sort alphabetically which is chronologically for YYYY-MM-DD

                if (closestFutureDateString) {
                    setClosestDay(closestFutureDateString);
                    const closestDaySubjects = create_day_schedule(
                        closestFutureDateString,
                        schedule
                    );
                    setClosestDaySche(closestDaySubjects);
                }
            } catch (e) {
                console.log(e);
                if (e === "ECONNRESET") {
                    Logout();
                    window.location.href = "/login";
                }
            }
        }
        run();
    }, [today]);

    return (
        <UI>
            <div className="flex flex-col items-center mt-10 ml-10 w-[100%] max-x-[1500px]">
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
