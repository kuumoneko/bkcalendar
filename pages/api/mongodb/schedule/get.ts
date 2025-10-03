import { NextApiRequest, NextApiResponse } from "next";
import parse_body from "../../data";
import Mongo_client_Component from "@/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { username } = parse_body(req.body);
        const filter = { username: username };

        const client = await Mongo_client_Component();
        await client.connect();
        const db = client.db('schedule');
        const collection = db.collection('data');

        const results = await collection.find(filter).toArray();

        if (results.length === 0) {
            return res.status(200).json({ ok: false, data: "User not found" });
        }
        else {
            const data = results[0];
            res.status(200).json({ ok: true, data: data })
        }
    }
    else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).json({ ok: false, error: { code: 405 } })
    }
}