import get_full_exam from "@/utils/data/exam";
import export_csv from "@/utils/data/export";
import full_schedule from "@/utils/data/schedule";
import { useEffect, useState } from "react";

export default function Export() {
    const [link, setlink] = useState<any>(null);
    useEffect(() => {
        async function run() {
            const schedule = await full_schedule();
            const exam = await get_full_exam();
            const csv = export_csv([...schedule, ...exam]);

            const csv_string = [
                Object.keys(csv[0]).join(","),
                ...csv.map((row: any) => {
                    return Object.values(row).join(",");
                }),
            ].join("\n");

            const blob = new Blob([csv_string], {
                type: "text/csv;charset=utf-8;",
            });

            const url = URL.createObjectURL(blob);
            const download_element = document.createElement("a");
            download_element.href = url;
            download_element.download = "schedule.csv";
            setlink(download_element);
        }
        run();
    }, []);

    const handle_Export = () => {
        if (link === null) {
            alert("File không tồn tại, vui lòng tải lại trang");
            return;
        } else {
            link.click();
            setlink(null);
        }
    };

    return (
        <div className="h-full w-full flex flex-col justify-center items-center">
            <span className="text-4xl">Xuất lịch</span>
            <div>
                File CSV từ trang này có thể được sử dụng để nhập vào Google
                Calendar để tiện theo dõi thời khóa biểu và lịch thi Đảm bảo bạn
                đã bổ sung tất cả các bộ lọc để quá trình xuất được diễn ra
                chính xác
            </div>
            <div>Nhấn vào nút dưới đây để xuất lịch</div>
            <div>
                {link !== null ? (
                    <>File đã sẵn sàng</>
                ) : (
                    <>File chưa sẵn sàng hoặc không tồn tại</>
                )}
            </div>
            <div
                onClick={handle_Export}
                className="px-4 py-2 bg-slate-500 hover:bg-slate-400 hover:cursor-pointer mt-4 rounded-3xl text-slate-800"
            >
                Xuất
            </div>
        </div>
    );
}
