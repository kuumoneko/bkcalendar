import Loading from "@/components/Loading";
import get_full_exam from "@/utils/data/exam";
import { useEffect, useState } from "react";

export default function Exam_Schedule() {
    const [data, setdata] = useState<any[]>([]);
    useEffect(() => {
        async function run() {
            const res = await get_full_exam();
            setdata(res);
        }
        run();
    }, []);
    return (
        <div className="h-full w-full flex flex-col justify-center items-center">
            <span>EXAM</span>
            <div className="w-[90%]">
                {data.length > 0 ? (
                    <table className="w-full text-center mt-5 rounded-3xl min-w-[500px]">
                        <thead>
                            <tr className="h-[50px]">
                                <th className="bg-slate-600 border-2 w-[30%] min-w-[150px]">
                                    Môn thi
                                </th>
                                <th className="bg-slate-700 border-2 w-[20%] min-w-[150px]">
                                    Lớp
                                </th>
                                <th className="bg-slate-600 border-2 w-[15%] min-w-[50px]">
                                    Ngày
                                </th>
                                <th className="bg-slate-700 border-2 w-[10%] min-w-[50px]">
                                    Bắt đầu
                                </th>
                                <th className="bg-slate-600 border-2 w-[10%] min-w-[50px]">
                                    Thời gian thi
                                </th>
                                <th className="bg-slate-700 border-2 w-[20%] min-w-[50px]">
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
                                            className="h-[50px]"
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
                ) : (
                    <Loading mode="Loading Exam schedule" />
                )}
            </div>
        </div>
    );
}
