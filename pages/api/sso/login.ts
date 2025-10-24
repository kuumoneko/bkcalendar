import { URLSearchParams } from 'node:url';
import isDown from "../isDown";

/**
 * Login user
 */
export default async function login(ltValue: string, executionValue: string, username: string, password: string, JSESSIONID: string) {
    try {
        const response = await fetch(
            `https://sso.hcmut.edu.vn/cas/login;jsessionid=${JSESSIONID}?service=https%3A%2F%2Fmybk.hcmut.edu.vn%2Fapp%2Flogin%2Fcas`,
            {
                method: "POST",
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
                    lt: ltValue,
                    execution: executionValue,
                    _eventId: "submit",
                    submit: "Login",
                }),
                referrer:
                    "https://sso.hcmut.edu.vn/cas/login?service=https%3A%2F%2Fmybk.hcmut.edu.vn%2Fapp%2Flogin%2Fcas",
                referrerPolicy: "same-origin",
                redirect: "manual",
                mode: "cors",
                credentials: "include",
            }
        );
        if (isDown(response.status)) {
            throw new Error("EAI_AGAIN");
        }
        const location = response.headers.get("location");
        if (typeof location === "string") {
            return location
        }
        else {
            const text = await response.text();

            if (text.includes("The credentials you provided cannot be determined to be authentic.")) {
                throw new Error("INVALID_CREDENTIALS")
            }
            else {
                throw new Error("Unknown error at endpoint /api/sso/login")
            }
        }
    }
    catch (e: any) {
        return e.message;
    }
}
