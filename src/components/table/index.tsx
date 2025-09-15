import { SubjectInfo } from "@/types/index";

export default function Table({ subjects }: { subjects: SubjectInfo[] }) {
    const lightCol = "bg-slate-700 border-2";
    const darkCol = "bg-slate-800 border-2";

    return (
        <table className="w-full text-center mt-5 rounded-3xl min-w-[500px]">
            <thead>
                <tr className="h-[50px]">
                    <th className={lightCol + " w-[15%] min-w-[150px]"}>
                        Môn học
                    </th>
                    <th className={darkCol + " w-[20%] min-w-[150px]"}>
                        Giảng viên
                    </th>
                    <th className={lightCol + " w-[5%] min-w-[50px]"}>Lớp</th>
                    <th className={darkCol + " w-[15%] min-w-[50px]"}>
                        Thời gian
                    </th>
                    <th className={lightCol}>Phòng</th>
                </tr>
            </thead>
            <tbody>
                {subjects.map((subject: SubjectInfo, index: number) => {
                    return (
                        <tr key={index} className="h-[50px]">
                            <td className={lightCol}>{subject.subject}</td>
                            <td className={darkCol}>
                                {subject.teacher.includes("Chưa biết")
                                    ? "Chưa biết"
                                    : subject.teacher}
                            </td>
                            <td className={lightCol}>{subject.class}</td>
                            <td className={darkCol + " flex flex-col"}>
                                <span>{subject.startTime}</span>
                                <span>{subject.endTime}</span>
                            </td>
                            <td className={lightCol}>
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
