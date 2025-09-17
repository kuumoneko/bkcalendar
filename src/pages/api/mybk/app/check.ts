import { NextApiRequest, NextApiResponse } from "next";

/**
 * Check if web is down?
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            let url = "https://mybk.hcmut.edu.vn/app/login?type=cas";

            let tryCount = 1;
            while (tryCount < 4 && !url.includes("401")) {
                const response = await fetch(url, {
                    method: "GET", signal: AbortSignal.timeout(4500)
                });

                url = response.headers.get("Location") || "";

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
                            return res.status(200).json({ error: { code: "EAI_AGAIN" }, ok: false });
                        }
                        else {
                            return res.status(200).json({ error: { code: response.statusText }, ok: false });
                        }
                    }
                }
                tryCount += 1;
            }

            if (url.includes("401")) {
                return res.status(200).json({ error: { code: "EAI_AGAIN" }, ok: false });
            }

            if (tryCount > 3) {
                return res.status(200).json({ ok: true });
            }
        }
        catch (e: any) {
            if (String(e).includes("signal timed out")) {
                return res.status(200).json({ error: { code: "EAI_AGAIN" }, ok: false });
            }

            return res.status(200).json({ error: { code: e.cause.code }, ok: false });
        }
    }
    else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).json({ ok: false, error: { code: 405 } });
    }
}