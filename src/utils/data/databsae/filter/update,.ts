import fetch_data from "@/utils/fetch";

export default async function update_filter(user: { _id: string, data: any, username: string }) {
    if (user._id?.length === 0) {
        throw new Error("Invalid Object id.")
    }
    const res = await fetch_data("/api/mongodb/filter/update", "POST", {}, user);
    return res;
}