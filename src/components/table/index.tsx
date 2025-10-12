import { SubjectInfo } from "@/types/index";
import { useState } from "react";

export default function Table({
    subjects,
    mode,
}: {
    subjects: SubjectInfo[];
    mode?: string;
}) {

    return (
        <table className="w-full text-center mt-5 rounded-3xl min-w-[500px]">
            <thead>
                <tr className="h-[50px]">
                    <th className="bg-slate-600 border-2 w-[15%] min-w-[150px]">
                        Môn học
                    </th>
                    <th className="bg-slate-700 border-2 w-[20%] min-w-[150px]">
                        Giảng viên
                    </th>
                    <th className="bg-slate-600 border-2 w-[5%] min-w-[50px]">
                        Lớp
                    </th>
                    <th className="bg-slate-700 border-2 w-[15%] min-w-[50px]">
                        Thời gian
                    </th>
                    <th className="bg-slate-600 border-2">Phòng</th>
                </tr>
            </thead>
            <tbody>
                {subjects.map((subject: SubjectInfo, index: number) => {
                    const [hover, sethover] = useState(false);

                    return (
                        <tr
                            key={index}
                            className="h-[50px]"
                            onMouseEnter={() => {
                                if (mode === "filter") sethover(true);
                            }}
                            onMouseLeave={() => {
                                if (mode === "filter") sethover(false);
                            }}
                            onMouseDown={() => {
                                if (mode === "filter" && hover) {
                                    window.location.href = `/filter/edit/add?data=${encodeURIComponent(
                                        JSON.stringify(subject)
                                    )}`;
                                }
                            }}
                        >
                            <td
                                className={
                                    "border-2 " +
                                    `${hover ? "bg-slate-500" : "bg-slate-600"}`
                                }
                            >
                                {subject.subject}
                            </td>
                            <td
                                className={
                                    "border-2 " +
                                    `${hover ? "bg-slate-600" : "bg-slate-700"}`
                                }
                            >
                                {subject.teacher.includes("Chưa biết")
                                    ? "Chưa biết"
                                    : subject.teacher}
                            </td>
                            <td
                                className={
                                    "border-2 " +
                                    `${hover ? "bg-slate-500" : "bg-slate-600"}`
                                }
                            >
                                {subject.class}
                            </td>
                            <td
                                className={
                                    "border-2 flex flex-col " +
                                    `${hover ? "bg-slate-600" : "bg-slate-700"}`
                                }
                            >
                                <span>{subject.startTime}</span>
                                <span>{subject.endTime}</span>
                            </td>
                            <td
                                className={
                                    "border-2 " +
                                    `${hover ? "bg-slate-500" : "bg-slate-600"}`
                                }
                            >
                                <div className="flex flex-col">
                                    <span>
                                        {subject.room.includes("NHATHIDAU")
                                            ? "NHATHIDAU"
                                            : subject.room}
                                    </span>
                                    <span>
                                        {subject.building.includes("1")
                                            ? "CS1"
                                            : "CS2"}
                                    </span>
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
