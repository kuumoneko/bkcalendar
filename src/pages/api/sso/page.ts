import getELement from "@/utils/hcmut/getvalue";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Create SSO login page
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {

        try {
            const response = await fetch(
                `https://sso.hcmut.edu.vn/cas/login?service=https%3A%2F%2Fmybk.hcmut.edu.vn%2Fapp%2Flogin%2Fcas`,
                {
                    method: "GET",
                    mode: "cors",
                    credentials: "include"
                },
            );
            const html = await response.text();

            const ltValue = getELement(html, "", "lt");

            const executionValue = getELement(html, "", "execution");

            const setCookieHeader = response.headers.get("set-cookie");
            const value1 = setCookieHeader
                ? setCookieHeader.split(";")[0].split("=")[1]
                : null;

            res.status(200).json({ ok: true, data: { ltValue, executionValue, JSESSIONID: value1 } })
        } catch (e: any) {
            res.status(200).json({ error: { code: e.cause.code }, ok: false });
        }

    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).json({ ok: false, error: { code: 405 } })
    }
}
