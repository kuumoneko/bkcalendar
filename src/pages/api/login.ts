import getELement from "@/utils/hcmut/getvalue";
import type { NextApiRequest, NextApiResponse } from "next";
import { URLSearchParams } from 'node:url';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { username, password, JSESSIONID, ltValue, executionValue } = JSON.parse(req.body);
        // console.log(username, ' ', password, ' ', JSESSIONID, ' ', ltValue, ' ', executionValue)

        const responese = await fetch(
            "https://sso.hcmut.edu.vn/cas/login?service=https%3A%2F%2Fmybk.hcmut.edu.vn%2Fapp%2Flogin%2Fcas",
            {
                headers: {
                    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                    "accept-language": "en-US,en;q=0.9,en-GB;q=0.8,vi;q=0.7",
                    "cache-control": "max-age=0",
                    "content-type": "application/x-www-form-urlencoded",
                    Host: "sso.hcmut.edu.vn",
                    Origin: "https://sso.hcmut.edu.vn",
                    Referer:
                        "https://sso.hcmut.edu.vn/cas/login?service=https%3A%2F%2Fmybk.hcmut.edu.vn%2Fapp%2Flogin%2Fcas",
                    "sec-ch-ua":
                        '"Chromium";v="140", "Not=A?Brand";v="24", "Microsoft Edge";v="140"',
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": '"Windows"',
                    "sec-fetch-dest": "document",
                    "sec-fetch-mode": "navigate",
                    "sec-fetch-site": "same-origin",
                    "sec-fetch-user": "?1",
                    "upgrade-insecure-requests": "1",
                    cookie: `JSESSIONID=${JSESSIONID}`,
                    origin: "https://mybk.hcmut.edu.vn"
                },
                body: new URLSearchParams({
                    username: username,
                    password: password,
                    lt: ltValue || "",
                    execution: executionValue || "",
                    _eventId: "submit",
                    submit: "Login",
                }),
                method: "POST",
                referrer:
                    "https://sso.hcmut.edu.vn/cas/login?service=https%3A%2F%2Fmybk.hcmut.edu.vn%2Fapp%2Flogin%2Fcas",

                referrerPolicy: "same-origin",
                redirect: "manual",
                mode: "cors",
                credentials: "include",

            }
        );
        // console.log(await responese.text()
        // )

        // console.log(responese.headers.get("location"))
        // return responese.headers.get("location");
        res.status(200).json({ url: responese.headers.get("location") });

    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
