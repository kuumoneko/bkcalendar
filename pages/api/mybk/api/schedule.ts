import { NextApiRequest, NextApiResponse } from "next";
import { isValid, parse_body } from "../../data";
import isDown from "../../isDown";

/**
 * Get Schedule
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { authorization, semester_id, student_id } = parse_body(req.body)


        if (!isValid(semester_id) || !isValid(student_id) || !isValid(authorization)) {
            return res.status(200).json({ data: "Invalid request data", ok: false })
        }
        const response = await fetch(`https://mybk.hcmut.edu.vn/api/v1/student/schedule?studentId=${student_id}&semesterYear=${semester_id}&null`, {
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
            res.status(200).json({ ok: true, data: data })
        }
        catch (e) {
            throw new Error("Unknown error at endpoint /api/mybk/api/schedule");
        }
    }
    catch (e: any) {
        res.status(200).json({ data: e.mesage, ok: false });
    }
}