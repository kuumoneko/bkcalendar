import mongodb from "./index";

export default async function login_db(username: string, password: string) {
    if (username.length === 0) {
        throw new Error("Invalid username")
    }
    if (password.length === 0) {
        throw new Error("Invalid password")
    }
    const res = await mongodb("password", "get", { username: username, password: password });
    return res;
}