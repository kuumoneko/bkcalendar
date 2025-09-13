export default async function create_login() {
    const res = await fetch(
        `/api/login_page/`,
        { method: "GET" }
    );
    const data = await res.json();
    return data;
}