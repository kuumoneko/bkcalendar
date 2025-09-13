export default async function login_user(JSESSIONID: string, ltValue: string, executionValue: string, username: string, password: string) {
    const res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({
            JSESSIONID,
            ltValue,
            executionValue,
            username,
            password
        }),
    }
    );
    const data = await res.json();
    return data.url;
}