import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            const { authorization } = req.body
            const response = await fetch(`https://mybk.hcmut.edu.vn/api/v1/semester-year/short?null`, {
                method: "GET",
                redirect: "manual",
                headers: { authorization: authorization },
            });

            const { data } = await response.json();

            res.status(200).json({ ok: true, data: data })
        }
        catch (e: any) {
            res.status(200).json({ error: { code: e.cause.code }, ok: false });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).json({ ok: false, error: { code: 405 } })
    }
}