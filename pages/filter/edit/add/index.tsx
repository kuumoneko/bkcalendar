import { useOrientationMode } from "@/hooks/display";
import { SubjectInfo } from "@/types";
import { DayTime, formatDate, getDayOfWeek, getWeekNumber } from "@/types/day";
import mongodb from "@/utils/data/databsae";
import deepEqual from "@/utils/object";
import { useEffect, useState } from "react";

export default function Page() {
    const user_mode = useOrientationMode();
    const [data, setdata] = useState<any>({});

    const [teacher, setteacher] = useState("");

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
    const [date, setdate] = useState({
        date: 0,
        month: 0,
        year: 0,
    });

    const [Stage, setStage] = useState("");
    const [room, setroom] = useState("");

    const [building, setbuilding] = useState("");

    useEffect(() => {
        const temp = new URL(window.location.href).searchParams.get("data");
        if (temp) {
            const temping = JSON.parse(temp);
            setdata(temping);
            setteacher(temping.teacher);
            setlessonStart(temping.lesson.split(" - ")[0] ?? "");
            setlessonEnd(temping.lesson.split(" - ")[1] ?? "");

            setTimeEnd(temping.endTime);
            setTimeStart(temping.startTime);

            setroom(temping.room.split("-")[1]);
            setStage(temping.room.split("-")[0]);
            setbuilding(temping.building);

            const datee = new Date(temping.dates[0]);
            setdate({
                date: datee.getDate(),
                month: datee.getMonth() + 1,
                year: datee.getFullYear(),
            });
        }
    }, []);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="flex flex-col h-[10%] text-2xl font-bold">
                <span>{data.subject}</span>
            </div>
            <div className="flex flex-col h-[30%] w-[50%]">
                <div className="grid grid-cols-2 w-full">
                    <span className="flex flex-row items-center justify-center">
                        Giảng viên
                    </span>
                    <span className="flex flex-row items-center justify-center">
                        {data.teacher}
                    </span>
                </div>
                <div className="grid grid-cols-2 w-full">
                    <span className="flex flex-row items-center justify-center">
                        Lớp
                    </span>
                    <span className="flex flex-row items-center justify-center">
                        {data.class}
                    </span>
                </div>
                <div className="grid grid-cols-2 w-full">
                    <span className="flex flex-row items-center justify-center">
                        Thời gian
                    </span>
                    <span className="flex flex-row items-center justify-center">{`${
                        data.startTime
                    } - ${data.endTime} ${
                        data?.lesson === "" ? "" : `(${data.lesson})`
                    }`}</span>
                </div>
                <div className="grid grid-cols-2 w-full">
                    <span className="flex flex-row items-center justify-center">
                        Ngày
                    </span>
                    <div className="flex flex-row items-center justify-center">
                        {data?.dates?.length > 0 && (
                            <select className="bg-slate-500 text-slate-800 px-2 rounded-xl w-[150px]">
                                {data.dates.map((item: string) => {
                                    return <option>{item}</option>;
                                })}
                            </select>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-2 w-full">
                    <span className="flex flex-row items-center justify-center">
                        Phòng
                    </span>
                    <span className="flex flex-row items-center justify-center">
                        {`${
                            data.room?.includes("NHATHIDAU")
                                ? "NHATHIDAU"
                                : data.room
                        } ${data.building?.includes("1") ? "CS1" : "CS2"}`}
                    </span>
                </div>
            </div>
            <div
                className={`flex flex-col h-[20%] ${
                    user_mode === "col" ? "w-[75%]" : "w-[35%]"
                } items-center justify-center`}
            >
                <div className="w-full flex flex-row items-center justify-center">
                    <span>Fix</span>
                </div>
                <div className="w-full grid grid-cols-2 mb-2">
                    <label htmlFor="teacher">Giảng viên</label>
                    <input
                        type="text"
                        id="teacher"
                        value={teacher ?? ""}
                        onChange={(e) => {
                            setteacher(e.target.value);
                        }}
                        className="bg-slate-500 text-slate-800 px-2 rounded-xl"
                    />
                </div>
                <div className="w-full grid grid-cols-2 mb-2">
                    <label htmlFor="class">Tiết</label>
                    <div>
                        {lessonStart !== "" && lessonEnd !== "" ? (
                            <>
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
                                    className="bg-slate-500 text-slate-800 px-2 rounded-xl w-[80px]"
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
                                    className="bg-slate-500 text-slate-800 px-2 rounded-xl w-[80px]"
                                    maxLength={5}
                                />
                            </>
                        )}
                    </div>
                </div>
                <div className="w-full grid grid-cols-2 mb-2">
                    <label htmlFor="class">Ngày</label>
                    <div>
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
                </div>
                <div className="w-full grid grid-cols-2 mb-2">
                    <label htmlFor="class">Toà</label>
                    <div>
                        {"CS "}
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
                </div>
            </div>
            <div className="h-[10%] w-[50%] flex flex-row items-center justify-center gap-24">
                <div
                    className="flex flex-col items-center bg-red-500 hover:bg-red-400 hover:cursor-pointer w-[65px] rounded-2xl"
                    onClick={() => {
                        async function run() {
                            if (data === undefined) {
                                return;
                            }
                            const { username } = JSON.parse(
                                localStorage.getItem("user") as string
                            );

                            const filter_temp: SubjectInfo[] = await mongodb(
                                "filter",
                                "get",
                                {
                                    username,
                                }
                            );

                            const indexx = filter_temp.findIndex(
                                (item: any) => {
                                    if (deepEqual(item, data)) {
                                        return true;
                                    }
                                }
                            );

                            filter_temp.splice(indexx, 1);
                            const res = await mongodb("filter", "post", {
                                username,
                                data: filter_temp,
                            });
                            if (res.matchedCount > 0) {
                                alert("Xóa bộ lọc thành công");
                            }
                        }
                        run();
                    }}
                >
                    Xoá
                </div>
                <div
                    className="flex flex-col items-center bg-sky-700 hover:bg-sky-600 hover:cursor-pointer w-[65px] rounded-2xl"
                    onClick={() => {
                        async function run() {
                            const new_subject = {
                                building: `${building}`,
                                class: data.class,
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
                                    DayTime[lessonEnd as keyof typeof DayTime]
                                        .endTime,
                                lesson: `${lessonStart} - ${lessonEnd}`,
                                room: `${Stage}-${room}`,
                                startTime:
                                    DayTime[lessonStart as keyof typeof DayTime]
                                        .startTime,
                                subject: data.subject,
                                teacher: teacher,
                                weeks: [
                                    getWeekNumber(
                                        new Date(
                                            `${date.year}-${date.month}-${date.date}`
                                        )
                                    ),
                                ],
                            };

                            if (!deepEqual(new_subject, data)) {
                                const { username } = JSON.parse(
                                    localStorage.getItem("user") as string
                                );

                                const filter_temp = await mongodb(
                                    "filter",
                                    "get",
                                    {
                                        username,
                                    }
                                );

                                const indexx = filter_temp.findIndex(
                                    (item: any) => {
                                        if (deepEqual(item, data)) {
                                            return true;
                                        }
                                    }
                                );

                                filter_temp.splice(indexx, 1);
                                filter_temp.push(new_subject);

                                const res = await mongodb("filter", "post", {
                                    username,
                                    data: filter_temp,
                                });
                                if (res.matchedCount > 0) {
                                    alert("Sửa bộ lọc thành công");
                                }
                            }
                        }
                        run();
                    }}
                >
                    Lưu
                </div>
            </div>
        </div>
    );
}
