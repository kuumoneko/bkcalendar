import { NextApiRequest, NextApiResponse } from "next";

/**
 * Check if web is down?
 */
export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
    try {
        let url = "https://mybk.hcmut.edu.vn/app/login?type=cas";

        let tryCount = 1;
        while (tryCount < 4 && !url.includes("401")) {
            const response = await fetch(url, {
                method: "GET", signal: AbortSignal.timeout(10 * 1000)
            });

            url = response.headers.get("Location") || "";
            tryCount += 1;

            if (url === "") {
                return res.status(200).json({ ok: true });
            }
            else {
                if (response.ok) {
                    return res.status(200).json({ ok: true });
                }
                else {
                    const responseCode = response.status;

                    if (responseCode === 408) {
                        return res.status(200).json({ data: "EAI_AGAIN", ok: false });
                    }
                    else {
                        return res.status(200).json({ data: response.statusText, ok: false });
                    }
                }
            }
        }

        if (url.includes("401")) {
            return res.status(200).json({ data: "EAI_AGAIN", ok: false });
        }

        if (tryCount > 3) {
            return res.status(200).json({ ok: true, data: "ok" });
        }
    }
    catch (e: any) {
        return res.status(200).json({ data: e.message, ok: false });
    }
}