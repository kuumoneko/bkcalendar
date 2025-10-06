import { NextApiRequest, NextApiResponse } from "next";
import convert, { isValid } from "../data";
import Mongo_client_Component from "@/lib/mongodb";
import check from "./check";
import { hash, verify } from "@/lib/auth/hash";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { doc = "", mode = "", data: temp }: { doc: string, mode: string, data: any } = convert(new URL("http://localhost:3000" + req.url).searchParams)

        const { username, ...data } = JSON.parse(temp)
        if (!["post", "get"].includes(mode)) {
            return res.setHeader("Mode", "post,get").status(200).json({ ok: false, data: "Mode is invalid" });
        }
        if (!["password", "user", "filter", "schedule", "exam"].includes(doc)) {
            return res.setHeader("doc", "password,user,filter,schedule,exam").status(200).json({ ok: false, data: "Doc is invalid" });
        }
        if (!isValid(username)) {
            return res.status(200).json({ ok: false, data: "Username is required" });
        }

        const client = await Mongo_client_Component();
        const db = client.db('hcmut');
        const collection = db.collection('data');
        await client.connect();
        await check(collection, username);


        if (doc === "password") {
            if (mode === "get") {
                const results = await collection.find({
                    username: username,
                }, {
                    projection: {
                        password: 1,
                        _id: 0
                    }
                }).toArray();
                if (results.length === 0) {
                    return res.status(200).json({ ok: false, data: "User not found" });
                }
                else {
                    const { password } = results[0];
                    if (password.length === 0) {
                        return res.status(200).json({ ok: true, data: true });
                    }
                    const ress = await verify(data.password, password)
                    return res.status(200).json({ ok: true, data: ress });
                }
            }
            else {
                const temping = await hash(data.password);
                const result = await collection.updateOne({
                    username: username
                }, {
                    $set: {
                        [doc]: temping
                    }
                })
                return res.status(200).json({ ok: true, data: result });
            }
        }

        if (mode === "get") {
            const results = await collection.find({
                username: username
            }, {
                projection: {
                    [doc]: 1,
                    _id: 0
                }
            }).toArray();
            return res.status(200).json({ ok: true, data: results.length === 0 ? "User not found" : results[0][doc] ?? [] });
        }
        else {
            const result = await collection.updateOne({
                username: username
            }, {
                $set: {
                    [doc]: data.data
                }
            })
            return res.status(200).json({ ok: true, data: result });
        }
    }
    catch (e: any) {
        return res.status(200).json({ ok: false, data: e.message });
    }
}