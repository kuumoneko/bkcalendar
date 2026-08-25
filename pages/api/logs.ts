import { NextApiRequest, NextApiResponse } from "next";
import { parse_body } from "./data";
import Mongo_client_Component from "@/lib/mongodb";
import is_allowed from "@/lib/allowlist";
import { logError } from "@/lib/logger";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { level, username, context, dateFrom, dateTo, page = 1, pageSize = 50 } = parse_body(req.body);

        const client = await Mongo_client_Component();
        await client.connect();
        const collection = client.db("hcmut").collection("logs");

        const filter: any = {};
        if (level) filter.level = level;
        if (username) filter.username = username;
        if (context) filter.context = context;
        if (dateFrom || dateTo) {
            filter.timestamp = {};
            if (dateFrom) filter.timestamp.$gte = new Date(dateFrom);
            if (dateTo) {
                const d = new Date(dateTo);
                d.setHours(23, 59, 59, 999);
                filter.timestamp.$lte = d;
            }
        }

        const skip = (Math.max(1, Number(page)) - 1) * Number(pageSize);
        const limit = Math.min(200, Math.max(1, Number(pageSize)));

        const [logs, total] = await Promise.all([
            collection.find(filter).sort({ timestamp: -1 }).skip(skip).limit(limit).toArray(),
            collection.countDocuments(filter),
        ]);

        return res.status(200).json({
            ok: true,
            data: {
                logs,
                total,
                page: Number(page),
                pageSize: limit,
            },
        });
    } catch (e: any) {
        logError("Logs API error", "logs", undefined, { error: e.message });
        return res.status(200).json({ ok: false, data: e.message });
    }
}
