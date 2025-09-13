export interface Subject {
    subject: string;
    teacher: string;
    class: string;
    lesson: string;
    startTime: string;
    endTime: string;
    dayOfWeek: number;
    weeks: number[];
    room: string;
    building: string;
    dates: string | string[];
}
export default function Table({ subjects }: { subjects: Subject[] }) {
    const lightCol = "bg-slate-700 border-2";
    const darkCol = "bg-slate-800 border-2";

    return (
        <table className="w-full text-center mt-5 rounded-3xl">
            <thead>
                <tr className="h-[50px]">
                    <th className={lightCol}>Môn học</th>
                    <th className={darkCol}>Giảng viên</th>
                    <th className={lightCol}>Lớp</th>
                    <th className={darkCol}>Tiết</th>
                    <th className={lightCol}>Thời gian</th>
                    <th className={darkCol}>Phòng</th>
                    <th className={lightCol}>Địa điểm</th>
                </tr>
            </thead>
            <tbody>
                {subjects.map((subject: Subject, index: number) => {
                    return (
                        <tr key={index} className="h-[50px]">
                            <td className={lightCol}>{subject.subject}</td>
                            <td className={darkCol}>{subject.teacher}</td>
                            <td className={lightCol}>{subject.class}</td>
                            <td className={darkCol}>{subject.lesson}</td>
                            <td className={lightCol}>
                                {subject.startTime} - {subject.endTime}
                            </td>
                            <td className={darkCol}>{subject.room}</td>
                            <td className={lightCol}>{subject.building}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
