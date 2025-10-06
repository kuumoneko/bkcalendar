import { Collection } from "mongodb";

export default async function check(collection: Collection, username: string) {
    const results = await collection.countDocuments({
        username: username
    });

    if (results === 0) {
        await collection.insertOne({
            username: username,
            password: "",
            filter: null,
            schedule: null,
            exam: null,
            data: null
        })
    }
}