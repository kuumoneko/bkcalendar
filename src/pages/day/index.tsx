import UI from "@/components/UI";
import { useEffect, useState } from "react";
import Table from "../../components/table/index";
import Logout from "@/utils/logout";
import full_schedule from "@/utils/schdule";
import { handle_error } from "@/utils/error";
import { SubjectInfo } from "../../types/index";
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

export default function Day() {
    const [today_sche, set_today_sche] = useState<SubjectInfo[]>([]);
    const [curr_sub, set_curr_sub] = useState<SubjectInfo | null>(null);
    const [next_sub, set_next_sub] = useState<SubjectInfo[] | null>(null);

    const [closestDay, setClosestDay] = useState<string | null>(null);
    const [closestDaySche, setClosestDaySche] = useState<SubjectInfo[]>([]);

    const today = parseDay(new Date());

    useEffect(() => {
        async function run() {
            try {
                let schedule: SubjectInfo[] = JSON.parse(
                    localStorage.getItem("schedule") ?? "[]"
                );

                const isOffline = Boolean(
                    localStorage.getItem("offline") ?? "false"
                );
                if (!isOffline) {
                    schedule = await full_schedule();
                }

                const today_subject = create_day_schedule(today, schedule);
                set_today_sche(today_subject);

                if (today_subject.length > 0) {
                    const now = new Date();

                    const current_subjects = today_subject.filter(
                        (item: SubjectInfo) => {
                            const { startTime, endTime } = item;

                            const StartHour = Number(startTime.split(":")[0]);
                            const StartMin = Number(startTime.split(":")[1]);
                            const EndHour = Number(endTime.split(":")[0]);
                            const EndMin = Number(endTime.split(":")[1]);

                            const temping = new Date();

                            const start = temping.setHours(
                                StartHour,
                                StartMin,
                                0,
                                0
                            );

                            const end = temping.setHours(EndHour, EndMin, 0, 0);

                            return (
                                start <= now.getTime() && now.getTime() <= end
                            );
                        }
                    );

                    const next_subjects = today_subject.filter(
                        (item: SubjectInfo) => {
                            const { startTime } = item;

                            const StartHour = Number(startTime.split(":")[0]);
                            const StartMin = Number(startTime.split(":")[1]);

                            const temping = new Date();

                            const start = temping.setHours(
                                StartHour,
                                StartMin,
                                0,
                                0
                            );

                            return now.getTime() <= start;
                        }
                    );

                    set_curr_sub(current_subjects[0] ?? null);
                    set_next_sub(next_subjects ?? null);
                }

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
        <div
            className={`flex flex-col items-center mt-10 ${
                mode === "row" && "ml-10"
            } w-[100%] max-x-[1500px]`}
        >
            <h1>Hôm nay là {parseDaytoVietnamese(today)}</h1>
            {today_sche.length > 0 ? (
                <div className="flex flex-col items-center justify-center w-[100%]">
                    {curr_sub && (
                        <div className="flex flex-col items-center justify-center w-[100%] mt-8">
                            <h1>Tiết hiện tại</h1>
                            <Table subjects={[curr_sub]} />
                        </div>
                    )}
                    {next_sub && next_sub.length > 0 && (
                        <div className="flex flex-col items-center justify-center w-[100%] mt-8">
                            <h1>Các tiết tiếp theo</h1>
                            <Table subjects={next_sub} />{" "}
                        </div>
                    )}
                    {!curr_sub && (!next_sub || next_sub.length === 0) && (
                        <div className="flex flex-col items-center justify-center w-[100%] mt-8">
                            Hết tiết roài, xoã đê bạn ơi
                        </div>
                    )}
                </div>
            ) : (
                <p className="mt-4">Hôm nay không có môn học.</p>
            )}

            {closestDay && closestDaySche.length > 0 && (
                <div className="flex flex-col items-center justify-center w-[100%] mt-8">
                    <h1>
                        Ngày học tiếp theo là {parseDaytoVietnamese(closestDay)}
                    </h1>
                    {closestDaySche.length > 0 && (
                        <Table subjects={closestDaySche} />
                    )}
                </div>
            )}
        </div>
    );
}
