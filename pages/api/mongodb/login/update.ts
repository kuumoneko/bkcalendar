import { NextApiRequest, NextApiResponse } from "next";
import parse_body from "../../data";
import Mongo_client_Component from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const client = await Mongo_client_Component();
        const db = client.db('user');
        const collection = db.collection('login');
        await client.connect()

        const { _id, ...filterData } = parse_body(req.body);
        const result = await collection.updateOne(
            { _id: new ObjectId(_id as string) },
            { $set: filterData }
        );


        res.status(200).json({ ok: true, data: result })
    }
    else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).json({ ok: false, error: { code: 405 } })
    }
}