import fetch_data from "@/utils/fetch";

export interface SemesterInfo {
    code: number;
    nameVi: string;
    nameEn: string;
    isCurrent: boolean;
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