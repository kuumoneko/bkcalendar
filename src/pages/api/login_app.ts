import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { ticket } = JSON.parse(req.body);
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

        res.status(200).json({ SESSION: value })
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}