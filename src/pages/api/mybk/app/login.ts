import { NextApiRequest, NextApiResponse } from "next";
import parse_body from "../../data";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            const { ticket } = parse_body(req.body)
            const response = await fetch(`https://mybk.hcmut.edu.vn/app/login/cas?ticket=${ticket}`, {
                method: "GET",
                redirect: "manual",
                headers: {
                    referer: "https://sso.hcmut.edu.vn/",
                }
            });


            const setCookieHeader = response.headers.get("set-cookie");
            const value = setCookieHeader
                ? setCookieHeader.split(";")[0].split("=")[1]
                : null;

            res.status(200).json({ ok: true, data: value })
        }
        catch (e: any) {
            res.status(200).json({ error: { code: e.cause.code }, ok: false });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).json({ ok: false, error: { code: 405 } })
    }
}