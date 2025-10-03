import { NextApiRequest, NextApiResponse } from "next";
import parse_body from "../../data";
import Mongo_client_Component from "@/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const client = await Mongo_client_Component();
        const db = client.db('user');
        const collection = db.collection('login');
        await client.connect()

        const data = parse_body(req.body);
        if (data.username === null || data.username === undefined || data.username.length === 0) {
            return res.status(200).json({ ok: false, data: "Username is required" });
        }

        if (data.password === null || data.password === undefined || data.password.length === 0) {
            return res.status(200).json({ ok: false, data: "Password is required" });
        }

        const result = await collection.insertOne(data);


        res.status(200).json({ ok: true, data: result })
    }
    else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).json({ ok: false, error: { code: 405 } })
    }
}