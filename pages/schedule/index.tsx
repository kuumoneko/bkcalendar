import Logout from "@/utils/logout";
import full_schedule from "@/utils/data/schedule";
import { useEffect, useState } from "react";
import { convertDateFormat, getnow } from "@/utils/day";
import Loading from "@/components/Loading";
import { handle_error } from "@/utils/error";
import { FullScheduleByWeek, SubjectInfo } from "@/types";
import { useOrientationMode } from "@/hooks/display";

export default function Schedule() {
    const [schedule_all, setschedule] = useState<FullScheduleByWeek | null>(
        null
    );
    const this_week = getnow().week;
    const [week, setweek] = useState(0);
    useEffect(() => {
        async function run() {
            try {
                let schedule: SubjectInfo[];
                try {
                    schedule = await full_schedule();
                } catch (e: any) {
                    handle_error(e);
                    return;
                }

                function getFirstDayOfWeek(date = new Date()) {
                    const dayOfWeek = date.getDay();
                    const diff =
                        date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
                    return new Date(date.setDate(diff));
                }

                const first_day_of_week = getFirstDayOfWeek();
                first_day_of_week.setHours(0, 0, 0, 0);

                const daysOfWeek = [
                    "Chủ Nhật",
                    "Thứ Hai",
                    "Thứ Ba",
                    "Thứ Tư",
                    "Thứ Năm",
                    "Thứ Sáu",
                    "Thứ Bảy",
                ];

                const getWeekNumber = (d: Date): number => {
                    d = new Date(
                        Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
                    );
                    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
                    const yearStart = new Date(
                        Date.UTC(d.getUTCFullYear(), 0, 1)
                    );
                    const weekNo = Math.ceil(
                        ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
                    );
                    return weekNo;
                };

                const datesByWeek = schedule
                    .sort((a: SubjectInfo, b: SubjectInfo) => {
                        const daysOrder = [
                            "Thứ Hai",
                            "Thứ Ba",
                            "Thứ Tư",
                            "Thứ Năm",
                            "Thứ Sáu",
                            "Thứ Bảy",
                            "Chủ Nhật",
                            "--",
                        ];

                        const dayA = Array.isArray(a.dates)
                            ? a.dates[0]
                            : a.dates;
                        const dayB = Array.isArray(b.dates)
                            ? b.dates[0]
                            : b.dates;

                        const indexA = daysOrder.indexOf(
                            dayA === "--"
                                ? "--"
                                : daysOfWeek[new Date(dayA).getDay()]
                        );
                        const indexB = daysOrder.indexOf(
                            dayB === "--"
                                ? "--"
                                : daysOfWeek[new Date(dayB).getDay()]
                        );

                        return indexA - indexB;
                    })
                    .reduce((acc: FullScheduleByWeek, subject: SubjectInfo) => {
                        if (subject?.dates === "--") {
                            subject?.weeks.forEach((week: number) => {
                                const weekKey = `Tuần ${week}`;

                                if (!acc[weekKey]) {
                                    return;
                                }

                                if (!acc[weekKey]["--"]) {
                                    acc[weekKey]["--"] = {
                                        day: "--",
                                        subjects: [],
                                    };
                                }
                                acc[weekKey]["--"].subjects.push(subject);
                            });
                        } else {
                            (subject?.dates as string[]).forEach(
                                (dateStr: string) => {
                                    const date = new Date(dateStr);
                                    if (date < first_day_of_week) return;

                                    const weekNumber = getWeekNumber(date);
                                    const weekKey = `Tuần ${weekNumber}`;
                                    const dayName = daysOfWeek[date.getDay()];

                                    if (!acc[weekKey]) acc[weekKey] = {};
                                    if (!acc[weekKey][dateStr]) {
                                        acc[weekKey][dateStr] = {
                                            day: dayName,
                                            subjects: [],
                                        };
                                    }

                                    acc[weekKey][dateStr].subjects.push(
                                        subject
                                    );
                                }
                            );
                        }

                        return acc;
                    }, {});

                setweek(this_week);
                setschedule(datesByWeek);
            } catch (e) {
                if (e === "ECONNRESET") {
                    Logout();
                    window.location.href = "/login";
                }
            }
        }
        run();
    }, []);

    const [week_schedule, set_week_schedule] = useState<any>({});
    useEffect(() => {
        if (!week) {
            return;
        }
        const the_week =
            (schedule_all as FullScheduleByWeek)[`Tuần ${week}`] ?? {};
        set_week_schedule(the_week);
    }, [week]);

    const mode = useOrientationMode();

    return (
        <div className="w-full h-[95%]">
            <div
                className={`flex flex-row items-center justify-center w-[100%] ${
                    mode === "col" ? "h-[75%]" : "h-full"
                } mt-4`}
            >
                {schedule_all && week ? (
                    <div className="schedule flex flex-col w-[100%] h-[100%] items-center">
                        <div className="flex flex-row h-[5%] w-[50%] items-center justify-between">
                            <div
                                className="head hover:cursor-pointer"
                                onClick={() => {
                                    if (week - 1 < this_week) {
                                        return;
                                    }
                                    setweek(week - 1);
                                }}
                            >
                                Tuần trước
                            </div>
                            <div className="head">Tuần {week}</div>
                            <div
                                className="head hover:cursor-pointer"
                                onClick={() => {
                                    setweek(week + 1);
                                }}
                            >
                                Tuần sau
                            </div>
                        </div>
                        {Object.keys(week_schedule).length > 0 && (
                            <div
                                className={`h-[100%] ${
                                    mode === "row"
                                        ? "max-h-[1000px]"
                                        : "max-h-[750px]"
                                } w-[90%] flex flex-col items-center justify-start  overflow-y-scroll [&::-webkit-scrollbar]:hidden`}
                            >
                                {Object.keys(week_schedule).map(
                                    (key: string) => {
                                        const day = week_schedule[key];
                                        return (
                                            <div
                                                className={`${key} flex flex-col h-auto w-[100%] items-center justify-between mt-3 bg-slate-700 rounded-4xl`}
                                            >
                                                <div className="day flex flex-row items-start justify-center mt-3 text-2xl">
                                                    <span>
                                                        {day.day === "--"
                                                            ? "Không xác định"
                                                            : convertDateFormat(
                                                                  key
                                                              )}
                                                    </span>
                                                </div>
                                                <div
                                                    className={`subject w-[100%] pb-4 mt-3 bg-slate-600 rounded-4xl ${
                                                        day.subjects.length > 2
                                                            ? "grid grid-cols-3"
                                                            : "flex flex-row items-center justify-evenly"
                                                    }`}
                                                >
                                                    {(
                                                        day.subjects as SubjectInfo[]
                                                    )
                                                        .sort(
                                                            (
                                                                a: SubjectInfo,
                                                                b: SubjectInfo
                                                            ) => {
                                                                const [h1, m1] =
                                                                    a.startTime
                                                                        .split(
                                                                            ":"
                                                                        )
                                                                        .map(
                                                                            Number
                                                                        );
                                                                const [h2, m2] =
                                                                    b.startTime
                                                                        .split(
                                                                            ":"
                                                                        )
                                                                        .map(
                                                                            Number
                                                                        );

                                                                const d1 =
                                                                    new Date(
                                                                        0,
                                                                        0,
                                                                        0,
                                                                        h1,
                                                                        m1
                                                                    );
                                                                const d2 =
                                                                    new Date(
                                                                        0,
                                                                        0,
                                                                        0,
                                                                        h2,
                                                                        m2
                                                                    );

                                                                return (
                                                                    d1.getTime() -
                                                                    d2.getTime()
                                                                );
                                                            }
                                                        )
                                                        .map(
                                                            (
                                                                subject: SubjectInfo
                                                            ) => {
                                                                return (
                                                                    <div
                                                                        className={`${subject?.subject} flex flex-col items-center justify-center mt-2`}
                                                                    >
                                                                        <div className="text-center">
                                                                            {
                                                                                subject?.subject
                                                                            }
                                                                        </div>
                                                                        <div className="text-center">
                                                                            {subject?.teacher?.includes(
                                                                                "Chưa biết"
                                                                            )
                                                                                ? "Chưa biết"
                                                                                : subject?.teacher}
                                                                        </div>
                                                                        <div className="text-center">
                                                                            {
                                                                                subject?.room
                                                                            }
                                                                        </div>
                                                                        <div className="text-center">
                                                                            {day.day ===
                                                                            "--"
                                                                                ? "--"
                                                                                : `${subject?.startTime} - ${subject?.endTime}`}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                        )}
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <Loading mode="Đang tải thời khóa biểu" />
                )}
            </div>
        </div>
    );
}
