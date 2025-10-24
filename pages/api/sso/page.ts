import getELement from "@/utils/data/hcmut/getvalue";

/**
 * Create SSO login page
 */
export default async function create_login_page() {
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
        const JSESSIONID = setCookieHeader
            ? setCookieHeader.split(";")[0].split("=")[1]
            : null;
        if (!response.ok) {
            if ([408, 504, 503, 500].includes(response.status)) {
                throw new Error("EAI_AGAIN");
            }
            throw new Error(response.statusText ?? "Unknown error");
        }

        return { ltValue: ltValue, executionValue: executionValue, JSESSIONID: JSESSIONID }
    }
    catch (e) {
        throw new Error("Unknown error at endpoint /api/sso/page")
    }
}
