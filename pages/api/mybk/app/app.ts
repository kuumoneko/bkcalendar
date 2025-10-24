import getELement from "@/utils/data/hcmut/getvalue";
import { isValid } from "../../data";

/**
 * Get auth token from mybk/app
 */
export default async function create_app(SESSION: string) {
    try {
        if (!isValid(SESSION)) {
            return ""
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
            return TokenValue
        }
        catch (e) {
            throw new Error("Unknown error at end point /api/mybk/app/app");
        }
    }
    catch (e: any) {
        return ""
    }
}