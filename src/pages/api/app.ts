import getELement from "@/utils/hcmut/getvalue";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { SESSION } = JSON.parse(req.body)
        const response = await fetch("https://mybk.hcmut.edu.vn/app/", {
            method: "GET",
            headers: {
                cookie: `SESSION=${SESSION}`,
            }
        })

        const html = await response.text()
        const TokenValue = getELement(html, "hid_Token");
        res.status(200).json({ token: TokenValue });
    }
    else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}