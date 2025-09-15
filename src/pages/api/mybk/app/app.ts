import getELement from "@/utils/hcmut/getvalue";
import { NextApiRequest, NextApiResponse } from "next";
import parse_body from "../../data";

/**
 * Get auth token from mybk/app
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            const { SESSION } = parse_body(req.body)

            const response = await fetch("https://mybk.hcmut.edu.vn/app/", {
                method: "GET",
                headers: {
                    cookie: `SESSION=${SESSION}`,
                }
            })

            const html = await response.text()

            const TokenValue = getELement(html, "hid_Token");
            res.status(200).json({
                ok: true,
                data: TokenValue
            });
        }
        catch (e: any) {
            res.status(200).json({ error: { code: e.cause.code }, ok: false });
        }
    }
    else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).json({ ok: false, error: { code: 405 } })
    }
}