import fetch_data from "@/utils/fetch";

export interface SemesterInfo {
    code: number;
    nameVi: string;
    nameEn: string;
    isCurrent: boolean;
}

export function pick_current_and_next(semesters: SemesterInfo[]): SemesterInfo[] {
    const sorted = [...semesters]
        .filter((s) => s.code < 99990)
        .sort((a, b) => b.code - a.code);
    if (sorted.length === 0) {
        return [];
    }
    const current = sorted.find((s) => s.isCurrent) ?? sorted[0];
    const year = Math.floor(current.code / 10);
    const term = current.code % 10;
    const nextCode = term >= 3 ? (year + 1) * 10 + 1 : current.code + 1;
    const next = sorted.find((s) => s.code === nextCode);
    return next ? [next, current] : [current];
}

/**
 * Get all semesters sorted by code descending (newest first)
 */
export default async function get_web_semester(): Promise<SemesterInfo[]> {
    try {
        const res = await fetch_data(
            ("/api/mybk/api/semester"),
            {
                "Content-Type": "application/json"
            }
        );
        return res;
    }
    catch (e: any) {
        throw new Error(e);
    }
}