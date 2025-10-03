import fetch_data from "@/utils/fetch";

export default async function login_db(username: string, password: string) {
    if (username.length === 0) {
        throw new Error("Invalid username")
    }
    if (password.length === 0) {
        throw new Error("Invalid password")
    }
    const res = await fetch_data("/api/mongodb/login/login", "POST", {}, { username, password })
    if (res === "ok") {
        return true;
    }
    else {
        return false;
    }
}