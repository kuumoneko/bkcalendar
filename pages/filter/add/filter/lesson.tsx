import { DayTime, formatDate, getDayOfWeek, getWeekNumber } from "@/types/day";
import mongodb from "@/utils/data/databsae";

export default function lesson({
    data,
    lessonStart,
    setlessonStart,
    lessonEnd,
    setlessonEnd,
    date,
    setdate,
    building,
    setbuilding,
    Stage,
    setStage,
    room,
    setroom,
}: {
    data: any;
    lessonStart: string;
    setlessonStart: (value: string) => void;
    lessonEnd: string;
    setlessonEnd: (value: string) => void;
    date: {
        date: number;
        month: number;
        year: number;
    };
    setdate: (value: { date: number; month: number; year: number }) => void;
    building: string;
    setbuilding: (value: string) => void;
    Stage: string;
    setStage: (value: string) => void;
    room: string;
    setroom: (value: string) => void;
}) {
    return (
        <div>
            <div>
                {" "}
                <div>Subject: {data?.subject}</div>
                <div>
                    {"Teacher "}
                    {data?.teacher.includes("Chưa biết")
                        ? "Chưa biết"
                        : data?.teacher}
                </div>
                Leasson{" "}
                <input
                    type="text"
                    id="class"
                    value={lessonStart ?? ""}
                    onChange={(e) => {
                        setlessonStart(e.target.value);
                    }}
                    className="bg-slate-500 text-slate-800 px-2 rounded-xl w-[40px]"
                    maxLength={2}
                />
                {" - "}
                <input
                    type="text"
                    id="class"
                    value={lessonEnd ?? ""}
                    onChange={(e) => {
                        setlessonEnd(e.target.value);
                    }}
                    className="bg-slate-500 text-slate-800 px-2 rounded-xl w-[40px]"
                    maxLength={2}
                />
                <span>{` (${
                    DayTime[lessonStart as keyof typeof DayTime]?.startTime ??
                    ""
                } - ${
                    DayTime[lessonEnd as keyof typeof DayTime]?.endTime ?? ""
                })`}</span>
            </div>
            <div>
                Date{" "}
                <input
                    type="text"
                    id="class"
                    value={date?.date ?? ""}
                    onChange={(e) => {
                        setdate({
                            ...date,
                            date: Number(e.target.value),
                        });
                    }}
                    className="bg-slate-500 text-slate-800 px-2 rounded-xl w-[40px]"
                    maxLength={2}
                />
                {" - "}
                <input
                    type="text"
                    id="class"
                    value={date?.month ?? ""}
                    onChange={(e) => {
                        setdate({
                            ...date,
                            month: Number(e.target.value),
                        });
                    }}
                    className="bg-slate-500 text-slate-800 px-2 rounded-xl w-[40px]"
                    maxLength={2}
                />
                {" - "}
                <input
                    type="text"
                    id="class"
                    value={date?.year ?? ""}
                    onChange={(e) => {
                        setdate({
                            ...date,
                            year: Number(e.target.value),
                        });
                    }}
                    className="bg-slate-500 text-slate-800 px-2 rounded-xl w-[60px]"
                    maxLength={4}
                />
            </div>
            <div>
                Location
                {" CS "}
                <input
                    type="text"
                    id="class"
                    value={building?.includes("1") ? "1" : "2"}
                    onChange={(e) => {
                        setbuilding(e.target.value);
                    }}
                    className="bg-slate-500 text-slate-800 px-2 rounded-xl w-[25px]"
                    maxLength={1}
                />
                {" - "}
                <input
                    type="text"
                    id="class"
                    value={Stage ?? ""}
                    onChange={(e) => {
                        setStage(e.target.value);
                    }}
                    className="bg-slate-500 text-slate-800 px-2 rounded-xl w-[40px]"
                    maxLength={2}
                />
                {" - "}
                <input
                    type="text"
                    id="class"
                    value={room ?? ""}
                    onChange={(e) => {
                        setroom(e.target.value);
                    }}
                    className="bg-slate-500 text-slate-800 px-2 rounded-xl w-[50px]"
                    maxLength={3}
                />
            </div>
            <div
                onClick={() => {
                    const new_subject = {
                        building: `${building}`,
                        class: data?.class ?? "",
                        dates: [
                            formatDate(
                                date?.year ?? 0,
                                date?.month ?? 0,
                                date?.date ?? 0
                            ),
                        ],
                        dayOfWeek: getDayOfWeek(
                            date?.year ?? 0,
                            date?.month ?? 0,
                            date?.date ?? 0
                        ),
                        endTime:
                            DayTime[lessonEnd as keyof typeof DayTime]
                                ?.endTime ?? "",
                        lesson: `${lessonStart} - ${lessonEnd}`,
                        room: `${Stage}-${room}`,
                        startTime:
                            DayTime[lessonStart as keyof typeof DayTime]
                                ?.startTime ?? "",
                        subject: data?.subject ?? "",
                        teacher: data?.teacher ?? "",
                        weeks: [
                            getWeekNumber(
                                new Date(
                                    `${date?.year ?? 0}-${date?.month ?? 0}-${
                                        date?.date ?? 0
                                    }`
                                )
                            ),
                        ],
                    };

                    async function run() {
                        const { username } = JSON.parse(
                            localStorage.getItem("user") as string
                        );

                        const filter_temp = await mongodb("filter", "get", {
                            username,
                        });

                        filter_temp.push(new_subject);

                        await mongodb("filter", "post", {
                            username,
                            data: filter_temp,
                        });
                    }
                    run();
                }}
            >
                submit
            </div>
        </div>
    );
}
