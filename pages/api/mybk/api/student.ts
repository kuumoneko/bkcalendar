import { NextApiRequest, NextApiResponse } from "next";
import { isValid, parse_body } from "../../data";
import isDown from "../../isDown";

/**
 * Get Student Infomation
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { authorization } = parse_body(req.body)
        if (!isValid(authorization)) {
            return res.status(200).json({ data: "Invalid request data", ok: false })
        }

        const response = await fetch("https://mybk.hcmut.edu.vn/api/v1/student/get-student-info?null", {
            method: "GET",
            headers: {
                authorization: authorization,
            }
        })

        if (isDown(response.status)) {
            throw new Error("EAI_AGAIN");
        }

        try {
            const { data, code } = await response.json();
            if (code === "401") {
                return res.status(200).json({ ok: false, data: "Unauthorized" });
            }
            const result = {
                id: data.id,
                name: data.lastName + " " + data.firstName,
                MSSV: data.code,
                class: data.classCode,
                status: data.status.name,
                major: data.major.nameVi,
                teachingDep: data.teachingDep.nameVi,
                trainingType: data.trainingType.nameVi,
                trainingLevel: data.trainingLevel.nameVi,
                trainingForms: data.trainingForms.nameVi,
                semesterStart: data.semesterStart,
                email: data.orgEmail
            }
            return res.status(200).json({ ok: true, data: result });
        }
        catch (e) {
            throw new Error("Unknown error at endpoint /api/mybk/api/student");
        }
    }
    catch (e: any) {
        console.error(e)
        res.status(200).json({ data: e.message, ok: false });
    }
}