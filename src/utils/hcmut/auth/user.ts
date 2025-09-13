export default async function get_token(SESSION: string) {
    const res = await fetch("/api/app", {
        method: "POST",
        body: JSON.stringify({
            SESSION: SESSION
        })
    });

    const data = await res.json();
    return data.token;
}