import Loading from "@/components/Loading";
import { ExamInfo } from "@/types";
import get_full_exam from "@/utils/data/exam";
import { useEffect, useState } from "react";

export default function Exam_Schedule() {
    const [data, setdata] = useState<any[]>([]);
    useEffect(() => {
        async function run() {
            const res = await get_full_exam();
            const temp = res
                .sort((a: ExamInfo, b: ExamInfo) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateA.getTime() - dateB.getTime();
                })
                .filter((item: ExamInfo) => {
                    return new Date(item.date).getTime() > Date.now();
                });
            setdata(temp);
        }
        run();
    }, []);
    return (
        <div className="h-full w-full flex flex-col justify-center items-center">
            <span>Lịch thi</span>
            <div className="w-[90%]">
                {data.length > 0 ? (
                    <table className="w-full text-center mt-5 rounded-3xl min-w-125">
                        <thead>
                            <tr className="h-12.5">
                                <th className="bg-slate-600 border-2 w-[30%] min-w-37.5">
                                    Môn thi
                                </th>
                                <th className="bg-slate-700 border-2 w-[20%] min-w-37.5">
                                    Lớp
                                </th>
                                <th className="bg-slate-600 border-2 w-[15%] min-w-12.5">
                                    Ngày
                                </th>
                                <th className="bg-slate-700 border-2 w-[10%] min-w-12.5">
                                    Bắt đầu
                                </th>
                                <th className="bg-slate-600 border-2 w-[10%] min-w-12.5">
                                    Thời gian thi
                                </th>
                                <th className="bg-slate-700 border-2 w-[20%] min-w-12.5">
                                    Phòng thi
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(
                                (item: {
                                    subject: string;
                                    date: string;
                                    building: string;
                                    room: string;
                                    startTime: string;
                                    duration: string;
                                    class: string;
                                }) => {
                                    return (
                                        <tr
                                            key={item.subject}
                                            className="h-12.5"
                                        >
                                            <td
                                                className={
                                                    "border-2 bg-slate-600"
                                                }
                                            >
                                                {item.subject}
                                            </td>
                                            <td
                                                className={
                                                    "border-2 bg-slate-700"
                                                }
                                            >
                                                {item.class}
                                            </td>
                                            <td
                                                className={
                                                    "border-2 bg-slate-600"
                                                }
                                            >
                                                {item.date}
                                            </td>
                                            <td
                                                className={
                                                    "border-2 bg-slate-700"
                                                }
                                            >
                                                {item.startTime}
                                            </td>
                                            <td
                                                className={
                                                    "border-2 bg-slate-600"
                                                }
                                            >
                                                {item.duration}
                                            </td>
                                            <td
                                                className={
                                                    "border-2 bg-slate-700"
                                                }
                                            >
                                                {item.building.includes("DiAn")
                                                    ? "CS2 - "
                                                    : "CS1 - "}
                                                {item.room}
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                ) : data.length === 0 ? (
                    <div>
                        <span>Không có lịch thi</span>
                    </div>
                ) : (
                    <Loading mode="Đang tải lịch thi" />
                )}
            </div>
        </div>
    );
}
