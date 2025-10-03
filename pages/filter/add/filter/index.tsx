import { SubjectInfo } from "@/types";
import { DayTime, formatDate, getDayOfWeek, getWeekNumber } from "@/types/day";
import get_filter from "@/utils/data/databsae/filter/get";
import update_filter from "@/utils/data/databsae/filter/update,";
import { ChangeEvent, useEffect, useState } from "react";

export default function Page() {
    const [data, setdata] = useState<SubjectInfo>();

    useEffect(() => {
        const temp = localStorage.getItem("data") as string;
        if (temp) {
            const data = JSON.parse(temp);
            setdata(data);
            setdates(data.dates);
        }
    }, []);

    const [mode, setmode] = useState<"lesson" | "filter">("lesson");

    const [selections, setselections] = useState<string[]>([]);
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { checked, id } = e.target;
        if (checked) {
            setselections([...selections, id]);
        } else {
            setselections(selections.filter((item) => item !== id));
        }
    };

    const [filter, setfilter] = useState<any>({});
    const [dates, setdates] = useState<string[]>([""]);

    const [lessonStart, setlessonStart] = useState("");
    const [lessonEnd, setlessonEnd] = useState("");
    const [date, setdate] = useState({
        date: 0,
        month: 0,
        year: 0,
    });

    const [Stage, setStage] = useState("");
    const [room, setroom] = useState("");

    const [building, setbuilding] = useState("");

    return (
        <div className="h-full w-full flex flex-col items-center justify-center">
            <span className="text-2xl">Add filter</span>
            <div className="flex flex-row gap-3">
                <div className="flex flex-row gap-2">
                    <input
                        type="radio"
                        id="lesson"
                        checked={mode === "lesson"}
                        onChange={() => {
                            setmode("lesson");
                        }}
                    />
                    <label htmlFor="lesson">Lesson</label>
                </div>
                <div className="flex flex-row gap-2">
                    <input
                        type="radio"
                        id="filter"
                        checked={mode === "filter"}
                        onChange={() => {
                            setmode("filter");
                        }}
                    />
                    <label htmlFor="filter">filter</label>
                </div>
            </div>
            <div>
                {mode === "filter" && (
                    <div>
                        <div>
                            <input
                                type="checkbox"
                                onChange={handleChange}
                                name=""
                                id="subject"
                                checked={selections.includes("subject")}
                            />

                            <label htmlFor="subject">
                                {"Subject "}
                                {data?.subject}
                            </label>
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                onChange={handleChange}
                                name=""
                                id="teacher"
                                checked={selections.includes("teacher")}
                            />
                            <label htmlFor="teacher">
                                {"Teacher "}
                                {data?.teacher.includes("Chưa biết")
                                    ? "Chưa biết"
                                    : data?.teacher}
                            </label>{" "}
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                onChange={handleChange}
                                name=""
                                id="time"
                                checked={selections.includes("time")}
                            />
                            <label htmlFor="time">
                                {"Lesson "}
                                {data?.lesson} ({data?.startTime} -{" "}
                                {data?.endTime})
                            </label>
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                onChange={handleChange}
                                name=""
                                id="date"
                                checked={selections.includes("date")}
                            />
                            <label htmlFor="date">
                                {"Date "}
                                <select
                                    className="bg-slate-600 text-slate-800"
                                    disabled={!selections.includes("date")}
                                >
                                    {[""]
                                        .concat(data?.dates as string[])
                                        .map((item: string) => {
                                            return (
                                                <option
                                                    className="bg-slate-600 text-slate-50"
                                                    value={item}
                                                >
                                                    {item}
                                                </option>
                                            );
                                        })}
                                </select>
                            </label>
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                onChange={handleChange}
                                name=""
                                id="location"
                                checked={selections.includes("location")}
                            />
                            <label htmlFor="location">
                                {"Location "}
                                {data?.room.includes("NHATHIDAU")
                                    ? "NHATHIDAU"
                                    : data?.room}{" "}
                                {data?.building.includes("1") ? "CS1" : "CS2"}
                            </label>
                        </div>
                    </div>
                )}
            </div>
            <div>
                {mode === "filter" ? (
                    <div>
                        {selections.includes("subject") && (
                            <div>
                                subject{" "}
                                <input
                                    type="text"
                                    className="bg-slate-600 text-slate-300 rounded-2xl px-2"
                                    onChange={(e) => {
                                        setfilter({
                                            ...filter,
                                            subject: e.target.value,
                                        });
                                    }}
                                />
                            </div>
                        )}
                        {selections.includes("teacher") && (
                            <div>
                                teacher{" "}
                                <input
                                    type="text"
                                    className="bg-slate-600 text-slate-300 rounded-2xl px-2"
                                    onChange={(e) => {
                                        setfilter({
                                            ...filter,
                                            teacher: e.target.value,
                                        });
                                    }}
                                />
                            </div>
                        )}
                        {selections.includes("time") && (
                            <div>
                                time{" "}
                                <input
                                    type="text"
                                    className="bg-slate-600 text-slate-300 rounded-2xl px-2"
                                    onChange={(e) => {
                                        setfilter({
                                            ...filter,
                                            time: e.target.value,
                                        });
                                    }}
                                />
                            </div>
                        )}
                        {selections.includes("date") && (
                            <div>
                                date{" "}
                                <input
                                    type="text"
                                    className="bg-slate-600 text-slate-300 rounded-2xl px-2"
                                    onChange={(e) => {
                                        setfilter({
                                            ...filter,
                                            date: e.target.value,
                                        });
                                    }}
                                />
                            </div>
                        )}
                        {selections.includes("location") && (
                            <div>
                                location{" "}
                                <input
                                    type="text"
                                    className="bg-slate-600 text-slate-300 rounded-2xl px-2"
                                    onChange={(e) => {
                                        setfilter({
                                            ...filter,
                                            location: e.target.value,
                                        });
                                    }}
                                />
                            </div>
                        )}

                        {selections.length > 0 && (
                            <div
                                onClick={() => {
                                    const keys = Object.keys(filter);
                                    if (keys.length < 1 || data === undefined)
                                        return;

                                    const pre: any = {};
                                    keys.forEach((item) => {
                                        pre[item] =
                                            data[item as keyof typeof data];
                                    });


                                    const aft = filter;

                                    async function run() {
                                        const user: any = JSON.parse(
                                            localStorage.getItem(
                                                "user"
                                            ) as string
                                        );

                                        const {
                                            data: filter_temp,
                                            _id: filter_id,
                                        } = await get_filter(user.username);

                                        filter_temp.push({
                                            pre: {
                                                ...pre,
                                                class: data?.class ?? "",
                                            },
                                            aft: aft,
                                        });
                                        await update_filter({
                                            _id: filter_id,
                                            data: filter_temp,
                                            username: user.username,
                                        });
                                    }
                                    run();
                                }}
                            >
                                Submit
                            </div>
                        )}
                    </div>
                ) : (
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
                                DayTime[lessonStart as keyof typeof DayTime]
                                    .startTime ?? ""
                            } - ${
                                DayTime[lessonEnd as keyof typeof DayTime]
                                    .endTime ?? ""
                            })`}</span>
                        </div>
                        <div>
                            Date{" "}
                            <input
                                type="text"
                                id="class"
                                value={date.date ?? ""}
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
                                value={date.month ?? ""}
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
                                value={date.year ?? ""}
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
                                            date.year,
                                            date.month,
                                            date.date
                                        ),
                                    ],
                                    dayOfWeek: getDayOfWeek(
                                        date.year,
                                        date.month,
                                        date.date
                                    ),
                                    endTime:
                                        DayTime[
                                            lessonEnd as keyof typeof DayTime
                                        ].endTime,
                                    lesson: `${lessonStart} - ${lessonEnd}`,
                                    room: `${Stage}-${room}`,
                                    startTime:
                                        DayTime[
                                            lessonStart as keyof typeof DayTime
                                        ].startTime,
                                    subject: data?.subject ?? "",
                                    teacher: data?.teacher ?? "",
                                    weeks: [
                                        getWeekNumber(
                                            new Date(
                                                `${date.year}-${date.month}-${date.date}`
                                            )
                                        ),
                                    ],
                                };

                                async function run() {
                                    const user: any = JSON.parse(
                                        localStorage.getItem("user") as string
                                    );

                                    const {
                                        data: filter_temp,
                                        _id: filter_id,
                                    } = await get_filter(user.username);

                                    filter_temp.push({
                                        pre: { class: data?.class ?? "" },
                                        aft: new_subject,
                                    });


                                    await update_filter({
                                        _id: filter_id,
                                        data: filter_temp,
                                        username: user.username,
                                    });
                                }
                                run();
                            }}
                        >
                            submit
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
