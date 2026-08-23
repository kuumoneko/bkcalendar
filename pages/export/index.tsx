import get_full_exam from "@/utils/data/exam";
import export_ics from "@/utils/data/export_ics";
import full_schedule from "@/utils/data/schedule";
import { useEffect, useState } from "react";

export default function Export() {
    const [ready, setReady] = useState(false);
    const [scheduleData, setScheduleData] = useState<any[]>([]);
    const [examData, setExamData] = useState<any[]>([]);

    useEffect(() => {
        async function run() {
            const schedule = await full_schedule();
            const exam = await get_full_exam();
            setScheduleData(schedule);
            setExamData(exam);
            setReady(true);
        }
        run();
    }, []);

    const handleExport = () => {
        if (!ready) {
            alert("File chưa sẵn sàng, vui lòng thử lại");
            return;
        }

        const icsString = export_ics(scheduleData, examData);
        const blob = new Blob([icsString], {
            type: "text/calendar;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "schedule.ics";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="h-full w-full flex flex-col justify-center items-center">
            <span className="text-4xl">Xuất lịch</span>
            <div className="mt-2">
                File ICS có thể nhập trực tiếp vào Google Calendar, Apple
                Calendar, Outlook và các ứng dụng lịch khác.
            </div>
            <div className="mt-3">
                {ready ? "File đã sẵn sàng" : "Đang tải dữ liệu..."}
            </div>
            <div
                onClick={handleExport}
                className={`px-4 py-2 mt-4 rounded-3xl transition-colors ${
                    ready
                        ? "bg-slate-500 hover:bg-slate-400 hover:cursor-pointer text-slate-800"
                        : "bg-slate-700 text-slate-500 cursor-not-allowed"
                }`}
            >
                Xuất ICS
            </div>
        </div>
    );
}
