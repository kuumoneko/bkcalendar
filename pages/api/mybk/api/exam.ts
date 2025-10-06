import { NextApiRequest, NextApiResponse } from "next";
import convert, { isValid } from "../../data";
import isDown from "../../isDown";

/**
 * Get Exam
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { authorization, namhoc, mssv, hocky } = convert(new URL("http://localhost:3000" + req.url).searchParams);

        if (!isValid(namhoc) || !isValid(mssv) || !isValid(authorization) || !isValid(hocky)) {
            return res.status(200).json({ data: "Invalid request data", ok: false })
        }

        const response = await fetch(`https://mybk.hcmut.edu.vn/api/thoi-khoa-bieu/lich-thi-sinh-vien/v1?masv=${mssv}&namhoc=${namhoc}&hocky=${hocky}&null`, {
            method: "GET",
            redirect: "manual",
            headers: { authorization: authorization },
        });

        if (isDown(response.status)) {
            throw new Error("EAI_AGAIN");
        }

        try {
            const { data, code } = await response.json();
            if (code === "401") {
                return res.status(200).json({ ok: false, data: "Unauthorized" })
            }
            return res.status(200).json({ ok: true, data: data })
        }
        catch (e) {
            throw new Error("Unknown error at endpoint /api/mybk/api/exam");
        }
    }
    catch (e: any) {
        res.status(200).json({ data: e.message, ok: false });
    }
}