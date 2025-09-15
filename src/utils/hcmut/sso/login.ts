import fetch_data from "@/utils/fetch";

export default async function login_user(JSESSIONID: string, ltValue: string, executionValue: string, username: string, password: string) {
    const res = await fetch_data("/api/sso/login", "POST", {
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
        // console.log(res.error);
        return null
    }
}