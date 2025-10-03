import fetch_data from "@/utils/fetch";

export default async function update_login(user: { _id: string }) {
    if (user._id?.length === 0) {
        throw new Error("Invalid Object id.")
    }
    const res = await fetch_data("/api/mongodb/login/update", "POST", {}, user);
    return res;
}