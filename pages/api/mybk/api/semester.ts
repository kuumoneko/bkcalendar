import { NextApiRequest, NextApiResponse } from "next";
import isDown from "../../isDown";

/**
 * Get Semester - returns full list sorted by code descending (newest first)
 */
export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
    try {
        const response = await fetch(`https://mybk.hcmut.edu.vn/api/v1/semester-year/short?null`, {
            method: "GET",
        });

        if (isDown(response.status)) {
            throw new Error("EAI_AGAIN");
        }

        try {
            const { data, code }: { data: any[], code: string } = await response.json();
            if (code === "401") {
                return res.status(200).json({ ok: false, data: "Unauthorized" })
            }
            const currentYear = new Date().getFullYear();
            const semesters = data
                .map((item: any) => ({
                    code: item.code,
                    nameVi: item.nameVi,
                    nameEn: item.nameEn,
                    isCurrent: item.isCurrent,
                }))
                .filter((item: any) => {
                    const year = Math.floor(item.code / 10);
                    return year >= currentYear - 2 && year <= currentYear + 2;
                })
                .sort((a: any, b: any) => b.code - a.code);
            res.status(200).json({ ok: true, data: semesters })
        }
        catch (e) {
            throw new Error("Unknown error at endpoint /api/mybk/api/semester");
        }
    }
    catch (e: any) {
        res.status(200).json({ data: e.message, ok: false });
    }
}