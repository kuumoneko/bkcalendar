import { DayTime, getWeekNumber } from "@/types/day";
import mongodb from "@/utils/data/databsae";
import { useEffect, useState } from "react";

export default function Page() {
    const [class_code, setclass] = useState("");
    const [teacher, setteacher] = useState("");
    const [subject, setsubject] = useState("");

    const [mode, setmode] = useState<"lesson" | "time">("lesson");
    const [lessonStart, setlessonStart] = useState("");
    const [lessonEnd, setlessonEnd] = useState("");

    useEffect(() => {
        if (lessonStart === "" || lessonEnd === "") {
            return;
        }

        if (Number(lessonStart) > Number(lessonEnd)) {
            alert("Thời gian học không hợp lệ");
            setlessonStart("");
            setlessonEnd("");
            return;
        }
    }, [lessonStart, lessonEnd]);

    const [TimeStart, setTimeStart] = useState("");
    const [TimeEnd, setTimeEnd] = useState("");

    const [dates, setdates] = useState<string[]>([]);
    const [date, setdate] = useState({
        date: "",
        month: 0,
        year: 0,
    });

    const [Stage, setStage] = useState("");
    const [room, setroom] = useState("");

    const [building, setbuilding] = useState("");

    return (
        <div className="h-full w-full flex flex-col items-center justify-center">
            <span className="text-2xl">Add subject</span>
            <div>
                <div className="mb-3">
                    class{" "}
                    <input
                        type="text"
                        id="class"
                        value={class_code ?? ""}
                        onChange={(e) => {
                            setclass(e.target.value);
                        }}
                        className="bg-slate-500 text-slate-800 px-2 rounded-xl w-15"
                    />
                </div>
                <div className="mb-3">
                    teacher{" "}
                    <input
                        type="text"
                        id="class"
                        value={teacher ?? ""}
                        onChange={(e) => {
                            setteacher(e.target.value);
                        }}
                        className="bg-slate-500 text-slate-800 px-2 rounded-xl w-62.5"
                    />
                </div>
                <div className="mb-3">
                    subject{" "}
                    <input
                        type="text"
                        id="class"
                        value={subject ?? ""}
                        onChange={(e) => {
                            setsubject(e.target.value);
                        }}
                        className="bg-slate-500 text-slate-800 px-2 rounded-xl w-62.5"
                    />
                </div>
                <div className="mb-3">
                    <div>
                        <form>
                            <input
                                type="radio"
                                id="lesson"
                                checked={mode === "lesson"}
                                onChange={() => {
                                    setmode("lesson");
                                }}
                            />
                            <label htmlFor="lesson">Lesson</label>
                            <input
                                type="radio"
                                id="time"
                                checked={mode === "time"}
                                onChange={() => {
                                    setmode("time");
                                }}
                            />
                            <label htmlFor="time">Time</label>
                        </form>
                    </div>
                    <div>
                        {mode === "lesson" ? (
                            <>
                                <input
                                    type="text"
                                    id="class"
                                    value={lessonStart ?? ""}
                                    onChange={(e) => {
                                        setlessonStart(e.target.value);
                                    }}
                                    className="bg-slate-500 text-slate-800 px-2 rounded-xl w-10"
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
                                    className="bg-slate-500 text-slate-800 px-2 rounded-xl w-10"
                                    maxLength={2}
                                />
                                <span>{` (${
                                    DayTime[lessonStart as keyof typeof DayTime]
                                        .startTime ?? ""
                                } - ${
                                    DayTime[lessonEnd as keyof typeof DayTime]
                                        .endTime ?? ""
                                })`}</span>
                            </>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    id="class"
                                    value={TimeStart ?? ""}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (!value.includes(":")) {
                                            setTimeStart(`${value}:00`);
                                        } else {
                                            setTimeStart(value);
                                        }
                                    }}
                                    className="bg-slate-500 text-slate-800 px-2 rounded-xl w-20"
                                    maxLength={5}
                                />
                                {" - "}
                                <input
                                    type="text"
                                    id="class"
                                    value={TimeEnd ?? ""}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (!value.includes(":")) {
                                            setTimeEnd(`${value}:00`);
                                        } else {
                                            setTimeEnd(value);
                                        }
                                    }}
                                    className="bg-slate-500 text-slate-800 px-2 rounded-xl w-20"
                                    maxLength={5}
                                />
                            </>
                        )}
                    </div>
                </div>
                <div>
                    dates
                    <div className="flex flex-row">
                        <input
                            type="text"
                            id="class"
                            value={date.year ?? ""}
                            onChange={(e) => {
                                setdate({
                                    ...date,
                                    year: Number(e.target.value),
                                });
                            }}
                            className="bg-slate-500 text-slate-800 px-2 rounded-xl w-15"
                            maxLength={4}
                        />
                        {" - "}
                        <input
                            type="text"
                            id="class"
                            value={date.month ?? ""}
                            onChange={(e) => {
                                setdate({
                                    ...date,
                                    month: Number(e.target.value),
                                });
                            }}
                            className="bg-slate-500 text-slate-800 px-2 rounded-xl w-10"
                            maxLength={2}
                        />
                        {" - "}
                        <input
                            type="text"
                            id="class"
                            value={date.date ?? ""}
                            onChange={(e) => {
                                setdate({
                                    ...date,
                                    date: e.target.value,
                                });
                            }}
                            className="bg-slate-500 text-slate-800 px-2 rounded-xl w-37.5"
                        />

                        <div
                            onClick={() => {
                                const temp = `${date.year}-${date.month}-`;
                                const dataa = date.date
                                    .split(",")
                                    .map((item: string) => {
                                        return temp + item;
                                    });

                                const temping = [
                                    ...new Set(dates.concat(dataa)),
                                ];
                                setdates(temping);
                                setdate({
                                    date: "",
                                    month: date.month,
                                    year: date.year,
                                });
                            }}
                        >
                            Add
                        </div>
                    </div>
                    <div>
                        <select
                            onChange={(e) => {
                                setdates(
                                    dates.filter((item: string) => {
                                        return item !== e.target.value;
                                    })
                                );
                            }}
                        >
                            {[""].concat(dates).map((item: string) => {
                                return (
                                    <option
                                        value={item}
                                        className="bg-slate-500 text-slate-800"
                                    >
                                        {item}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>
                <div>
                    location {" CS "}
                    <input
                        type="text"
                        id="class"
                        value={building}
                        onChange={(e) => {
                            setbuilding(e.target.value);
                        }}
                        className="bg-slate-500 text-slate-800 px-2 rounded-xl w-6.25"
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
                        className="bg-slate-500 text-slate-800 px-2 rounded-xl w-10"
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
                        className="bg-slate-500 text-slate-800 px-2 rounded-xl w-12.5"
                        maxLength={3}
                    />
                </div>
                <div
                    onClick={() => {
                        const data = {
                            class: class_code,
                            teacher: teacher,
                            subject: subject,
                            lesson:
                                mode === "lesson"
                                    ? `${lessonStart} - ${lessonEnd}`
                                    : "",
                            dates: dates,
                            startTime:
                                mode === "time"
                                    ? TimeStart
                                    : DayTime[
                                          lessonStart as keyof typeof DayTime
                                      ].startTime,
                            endTime:
                                mode === "time"
                                    ? TimeEnd
                                    : DayTime[lessonEnd as keyof typeof DayTime]
                                          .endTime,
                            room: `${Stage}-${room}`,
                            building: `CS ${building}`,
                            weeks: dates.map((item: string) => {
                                return getWeekNumber(new Date(item));
                            }),
                        };

                        async function run() {
                            const { username, semester } = JSON.parse(
                                localStorage.getItem("user") as string
                            );
                            let filter_temp = await mongodb("filter", "get", {
                                username,
                            });
                            filter_temp.push({
                                data,
                                semester,
                            });
                            filter_temp = filter_temp.filter(
                                (item: any) => item.semester === semester
                            );

                            const res = await mongodb("filter", "post", {
                                username,
                                data: filter_temp,
                            });
                            if (res.matchedCount > 0) {
                                alert("Thêm môn học thành công");
                            }
                        }
                        run();
                    }}
                    className="hover:cursor-pointer"
                >
                    Lưu
                </div>
            </div>
        </div>
    );
}
