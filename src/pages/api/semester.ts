import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { authorization } = JSON.parse(req.body);
        const response = await fetch(`https://mybk.hcmut.edu.vn/api/v1/semester-year/short?null`, {
            method: "GET",
            redirect: "manual",
            headers: { authorization: authorization },

        });


        const { data } = await response.json();

        res.status(200).json(data)
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}