import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const response = await fetch("https://mybk.hcmut.edu.vn/app/login?type=cas", {
                method: "GET"
            })

            if (response.ok) {
                res.status(200).json({ ok: true });
            }
            else {
                // get response code
                const responseCode = response.status;

                if (responseCode === 408) {
                    res.status(200).json({ error: { code: "EAI_AGAIN" }, ok: false });
                }
                else {
                    res.status(200).json({ error: { code: response.statusText }, ok: false });
                }
            }
        }
        catch (e: any) {
            res.status(200).json({ error: { code: e.cause.code }, ok: false });
        }
    }
    else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).json({ ok: false, error: { code: 405 } });
    }
}