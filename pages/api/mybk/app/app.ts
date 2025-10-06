import getELement from "@/utils/data/hcmut/getvalue";
import { NextApiRequest, NextApiResponse } from "next";
import { isValid } from "../../data";

/**
 * Get auth token from mybk/app
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const searchParams = new URL("http://localhost:3000" + req.url).searchParams;
        const SESSION = searchParams.get("SESSION") ?? "";
        if (!isValid(SESSION)) {
            return res.status(200).json({ data: "Invalid request data", ok: false })
        }
        const response = await fetch("https://mybk.hcmut.edu.vn/app/", {
            method: "GET",
            headers: {
                cookie: `SESSION=${SESSION}`,
            }
        })

        if (!response.ok) {
            if ([408, 504, 503, 500].includes(response.status)) {
                throw new Error("EAI_AGAIN");
            }
            throw new Error(response.statusText ?? "Unknown error");
        }

        try {
            const html = await response.text()
            const TokenValue = getELement(html, "hid_Token");
            res.status(200).json({
                ok: true,
                data: TokenValue
            });
        }
        catch (e) {
            throw new Error("Unknown error at end point /api/mybk/app/app");
        }
    }
    catch (e: any) {
        res.status(200).json({ data: e.message, ok: false });
    }
}