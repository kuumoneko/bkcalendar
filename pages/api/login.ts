import type { NextApiRequest, NextApiResponse } from "next";
import convert from "./data";
import create_login from "./sso/page";
import get_token from "./mybk/app/app";
import login_user from "./sso/login";
import create_app from "./mybk/app/login";

/**
 * Login user
 */
export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
    try {
        const { username, password } = convert(new URL("http://localhost:3000" + _req.url).searchParams)

        if (username.length === 0) {
            return "";
        }
        if (password.length === 0) {
            return "";
        }
        const { JSESSIONID, ltValue, executionValue } =
            await create_login();
        const result = await login_user(
            ltValue || "",
            executionValue || "",
            username,
            password,
            JSESSIONID || "",
        );

        const SESSION = await create_app(result as string);
        let token = await get_token(SESSION as string);
        return res.status(200).json({ data: token, ok: true });
    }
    catch (e: any) {
        console.error(e)
        return res.status(200).json({ data: e.message, ok: false });
    }
}
