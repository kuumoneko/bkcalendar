import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { authorization } = JSON.parse(req.body)
        const response = await fetch("https://mybk.hcmut.edu.vn/api/v1/student/get-student-info?null", {
            method: "GET",
            headers: {
                authorization: authorization,
            }
        })

        const { data, code } = await response.json()
        console.log(data)
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
            res.status(500).json({ message: "" });
        }
        else {
            res.status(200).json(result);
        }
    }
    else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}