import { NextApiRequest, NextApiResponse } from "next";
import isDown from "../../isDown";

/**
 * Get Semester
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
            const semester = data.find((item: any) => { return item.isCurrent === true });
            res.status(200).json({ ok: true, data: semester.code })
        }
        catch (e) {
            throw new Error("Unknown error at endpoint /api/mybk/api/semester");
        }
    }
    catch (e: any) {
        res.status(200).json({ data: e.message, ok: false });
    }
}