import fetch_data from "@/utils/fetch";

export interface LogFilter {
    level?: string;
    username?: string;
    context?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    pageSize?: number;
}

export default async function get_logs(filters: LogFilter = {}) {
    try {
        const res = await fetch_data(`/api/logs`, {
            "Content-Type": "application/json"
        }, filters);
        return res;
    } catch {
        return { logs: [], total: 0, page: 1, pageSize: 50 };
    }
}
