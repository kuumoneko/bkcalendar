import { NextApiRequest, NextApiResponse } from "next";
import { isValid } from "../../data";
import isDown from "../../isDown";

/**
 * Create login page SESSION
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const searchParams = new URL("http://localhost:3000" + req.url).searchParams;
        const ticket = searchParams.get("ticket") ?? "";
        if (!isValid(ticket)) {
            return res.status(200).json({ data: "Invalid request data", ok: false })
        }
        const response = await fetch(`https://mybk.hcmut.edu.vn/app/login/cas?ticket=${ticket}`, {
            method: "GET",
            redirect: "manual",
            headers: {
                referer: "https://sso.hcmut.edu.vn/",
            }
        });

        if (isDown(response.status)) {
            throw new Error("EAI_AGAIN");
        }

        try {
            const setCookieHeader = response.headers.get("set-cookie");
            const value = setCookieHeader
                ? setCookieHeader.split(";")[0].split("=")[1]
                : null;

            res.status(200).json({ ok: true, data: value })
        }
        catch (e) {
            throw new Error("Unknown error at endpoint /api/mybk/app/login");
        }
    }
    catch (e: any) {
        res.status(200).json({ data: e.message, ok: false });
    }
}