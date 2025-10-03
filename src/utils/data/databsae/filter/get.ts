import fetch_data from "@/utils/fetch";

export default async function get_filter(username: string) {
    if (username?.length === 0) {
        throw new Error("Invalid username.")
    }
    const res = await fetch_data("/api/mongodb/filter/get", "POST", {}, { username });
    return res;
}