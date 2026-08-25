import { NextApiRequest, NextApiResponse } from "next";
import isDown from "../../isDown";
import { pick_current_and_next } from "@/utils/data/hcmut/api/semester";
import { logWarn, logError } from "@/lib/logger";

/**
 * Get Semester - returns current and next semester sorted by code descending (newest first)
 */
export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
    try {
        const response = await fetch(`https://mybk.hcmut.edu.vn/api/v1/semester-year/short?null`, {
            method: "GET",
            signal: AbortSignal.timeout(8000),
        });

        if (isDown(response.status)) {
            logWarn("myBK semester API is down", "semester", undefined, { status: response.status });
            throw new Error("EAI_AGAIN");
        }

        try {
            const { data, code }: { data: any[], code: string } = await response.json();
            if (code === "401") {
                return res.status(200).json({ ok: false, data: "Unauthorized" })
            }
            const semesters = data.map((item: any) => ({
                code: item.code,
                nameVi: item.nameVi,
                nameEn: item.nameEn,
                isCurrent: item.isCurrent,
            }));
            res.status(200).json({ ok: true, data: pick_current_and_next(semesters) })
        }
        catch (e) {
            throw new Error("Unknown error at endpoint /api/mybk/api/semester");
        }
    }
    catch (e: any) {
        logError("Semester API error", "semester", undefined, { error: e.message });
        res.status(200).json({ data: e.message, ok: false });
    }
}