import getELement from "@/utils/hcmut/getvalue";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
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

        res.status(200).json({ ltValue, executionValue, JSESSIONID: value1 })

    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
