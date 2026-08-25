import Loading from "@/components/Loading";
import { useOrientationMode } from "@/hooks/display";
import get_logs, { LogFilter } from "@/utils/data/logs";
import { useEffect, useState } from "react";

const LEVEL_COLORS: Record<string, string> = {
    DEBUG: "text-slate-400",
    INFO: "text-blue-400",
    WARN: "text-yellow-400",
    ERROR: "text-red-400",
};

export default function Logs() {
    const mode = useOrientationMode();
    const [logs, setLogs] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(50);
    const [loading, setLoading] = useState(true);

    const [filterLevel, setFilterLevel] = useState("");
    const [filterUsername, setFilterUsername] = useState("");
    const [filterContext, setFilterContext] = useState("");
    const [filterDateFrom, setFilterDateFrom] = useState("");
    const [filterDateTo, setFilterDateTo] = useState("");

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    async function fetchLogs(p: number, filters?: LogFilter) {
        setLoading(true);
        const res = await get_logs({
            level: (filters?.level ?? filterLevel) || undefined,
            username: (filters?.username ?? filterUsername) || undefined,
            context: (filters?.context ?? filterContext) || undefined,
            dateFrom: (filters?.dateFrom ?? filterDateFrom) || undefined,
            dateTo: (filters?.dateTo ?? filterDateTo) || undefined,
            page: p,
            pageSize,
        });
        if (res && res.logs) {
            setLogs(res.logs);
            setTotal(res.total);
            setPage(res.page);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchLogs(1);
    }, []);

    function handleSearch() {
        fetchLogs(1, {
            level: filterLevel || undefined,
            username: filterUsername || undefined,
            context: filterContext || undefined,
            dateFrom: filterDateFrom || undefined,
            dateTo: filterDateTo || undefined,
        });
    }

    function formatTime(ts: string) {
        const d = new Date(ts);
        const pad = (n: number) => n.toString().padStart(2, "0");
        return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }

    return (
        <div className={`flex flex-col items-center mt-10 w-full px-4 h-full overflow-hidden ${mode === "row" ? "ml-10" : ""}`}>
            <h1 className="text-xl font-bold text-slate-300 mb-4">Nhật ký</h1>

            <div className="flex flex-wrap gap-2 mb-4 w-full max-w-5xl">
                <select
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                    className="bg-slate-700 text-slate-300 border border-slate-600 rounded-xl px-3 py-1.5 text-sm"
                >
                    <option value="">Tất cả cấp độ</option>
                    <option value="DEBUG">DEBUG</option>
                    <option value="INFO">INFO</option>
                    <option value="WARN">WARN</option>
                    <option value="ERROR">ERROR</option>
                </select>

                <input
                    type="text"
                    placeholder="Username"
                    value={filterUsername}
                    onChange={(e) => setFilterUsername(e.target.value)}
                    className="bg-slate-700 text-slate-300 border border-slate-600 rounded-xl px-3 py-1.5 text-sm w-36"
                />

                <select
                    value={filterContext}
                    onChange={(e) => setFilterContext(e.target.value)}
                    className="bg-slate-700 text-slate-300 border border-slate-600 rounded-xl px-3 py-1.5 text-sm"
                >
                    <option value="">Tất cả ngữ cảnh</option>
                    <option value="login">login</option>
                    <option value="mongodb">mongodb</option>
                    <option value="allowlist">allowlist</option>
                    <option value="student">student</option>
                    <option value="schedule">schedule</option>
                    <option value="exam">exam</option>
                    <option value="semester">semester</option>
                    <option value="logs">logs</option>
                </select>

                <input
                    type="date"
                    value={filterDateFrom}
                    onChange={(e) => setFilterDateFrom(e.target.value)}
                    className="bg-slate-700 text-slate-300 border border-slate-600 rounded-xl px-3 py-1.5 text-sm"
                />
                <input
                    type="date"
                    value={filterDateTo}
                    onChange={(e) => setFilterDateTo(e.target.value)}
                    className="bg-slate-700 text-slate-300 border border-slate-600 rounded-xl px-3 py-1.5 text-sm"
                />

                <button
                    onClick={handleSearch}
                    className="bg-indigo-500 text-white rounded-xl px-4 py-1.5 text-sm hover:bg-indigo-400 cursor-pointer"
                >
                    Tìm
                </button>
            </div>

            <div className="flex-1 w-full max-w-5xl overflow-y-scroll">
                {loading ? (
                    <Loading mode="Đang tải nhật ký" />
                ) : logs.length === 0 ? (
                    <div className="text-slate-400 text-center mt-10">Không có nhật ký</div>
                ) : (
                    <>
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="bg-slate-600 text-slate-300 border border-slate-500 px-3 py-2">Thời gian</th>
                                    <th className="bg-slate-700 text-slate-300 border border-slate-500 px-3 py-2">Cấp độ</th>
                                    <th className="bg-slate-600 text-slate-300 border border-slate-500 px-3 py-2">Ngữ cảnh</th>
                                    <th className="bg-slate-700 text-slate-300 border border-slate-500 px-3 py-2">Người dùng</th>
                                    <th className="bg-slate-600 text-slate-300 border border-slate-500 px-3 py-2">Thông điệp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log: any, i: number) => (
                                    <tr key={log._id ?? i} className="hover:bg-slate-800">
                                        <td className="border border-slate-600 px-3 py-2 text-slate-400 whitespace-nowrap">
                                            {formatTime(log.timestamp)}
                                        </td>
                                        <td className={`border border-slate-600 px-3 py-2 font-bold ${LEVEL_COLORS[log.level] ?? "text-slate-300"}`}>
                                            {log.level}
                                        </td>
                                        <td className="border border-slate-600 px-3 py-2 text-slate-400">
                                            {log.context ?? "-"}
                                        </td>
                                        <td className="border border-slate-600 px-3 py-2 text-slate-400">
                                            {log.username ?? "-"}
                                        </td>
                                        <td className="border border-slate-600 px-3 py-2 text-slate-300 max-w-xs truncate">
                                            {log.message}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex items-center justify-center gap-4 mt-4 text-slate-400 text-sm">
                            <button
                                onClick={() => fetchLogs(page - 1)}
                                disabled={page <= 1}
                                className="px-3 py-1 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                                ‹
                            </button>
                            <span>Trang {page} / {totalPages} ({total} bản ghi)</span>
                            <button
                                onClick={() => fetchLogs(page + 1)}
                                disabled={page >= totalPages}
                                className="px-3 py-1 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                                ›
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
