import { NextApiRequest, NextApiResponse } from "next";
import parse_body, { isValid } from "../../data";

/**
 * Get Student Infomation
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            const { authorization } = parse_body(req.body);
            if (!isValid(authorization)) {
                return res.status(200).json({ error: { code: "Invalid request data" }, ok: false })
            }
            const response = await fetch("https://mybk.hcmut.edu.vn/api/v1/student/get-student-info?null", {
                method: "GET",
                headers: {
                    authorization: authorization,
                }
            })

            const { data, code } = await response.json()
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

            if (Number(code) !== 200) {
                res.status(200).json({ error: data, ok: false });
            }
            else {
                res.status(200).json({ ok: true, data: result });
            }
        }
        catch (e: any) {
            console.error(e)
            res.status(200).json({ error: { code: "EAI_AGAIN" }, ok: false });
        }
    }
    else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).json({ ok: false, error: { code: 405 } });
    }
}