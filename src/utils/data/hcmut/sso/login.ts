import fetch_data from "@/utils/fetch";

/**
 * Login user
 */
export default async function login_user(JSESSIONID: string, ltValue: string, executionValue: string, username: string, password: string) {
    try {
        const res = await fetch_data("/api/sso/login", {
            "content-type": "application/json",
        }, {
            JSESSIONID,
            ltValue,
            executionValue,
            username,
            password
        })

        if (res.includes("https")) {
            return res;
        }
        else {
            throw new Error("NOT EAGAIN")
        }
    }
    catch (e: any) {
        throw new Error(e);
    }
} 