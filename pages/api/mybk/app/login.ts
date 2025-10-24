import isDown from "../../isDown";

/**
 * Create login page SESSION
 */
export default async function handler(url: string) {
    try {
        const response = await fetch(url, {
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

            return value as string ?? ""
        }
        catch (e) {
            throw new Error("Unknown error at endpoint /api/mybk/app/login");
        }
    }
    catch (e: any) {
        return e.message;
    }
}