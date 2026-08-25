import type { NextApiRequest, NextApiResponse } from "next";
import { parse_body } from "./data";
import create_login from "./sso/page";
import get_token from "./mybk/app/app";
import login_user from "./sso/login";
import create_app from "./mybk/app/login";
import { revert } from "@/lib/pass";
import is_allowed from "@/lib/allowlist";
import { logInfo, logWarn, logError } from "@/lib/logger";

/**
 * Login user
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { username, password } = parse_body(req.body)

        if (username.length === 0) {
            return "";
        }
        if (password.length === 0) {
            return "";
        }
        if (!(await is_allowed(username))) {
            logWarn("Login rejected: not in allowlist", "login", username);
            return res.status(200).json({ ok: false, data: "NOT_ALLOWED" });
        }
        const { JSESSIONID, ltValue, executionValue } =
            await create_login();
        const result = await login_user(
            ltValue || "",
            executionValue || "",
            username,
            revert(password),
            JSESSIONID || "",
        );

        const SESSION = await create_app(result as string);
        let token = await get_token(SESSION as string);
        logInfo("Login successful", "login", username);
        return res.status(200).json({ data: token, ok: true });
    }
    catch (e: any) {
        logError("Login failed", "login", undefined, { error: e.message, stack: e.stack });
        return res.status(200).json({ data: e.message, ok: false });
    }
}
