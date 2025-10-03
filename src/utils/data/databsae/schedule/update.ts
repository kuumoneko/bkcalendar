import fetch_data from "@/utils/fetch";

export default async function update_schedule(user: { _id: string }) {
    if (user._id?.length === 0) {
        throw new Error("Invalid Object id.")
    }
    const res = await fetch_data("/api/mongodb/schedule/update", "POST", {}, user);
    return res;
}