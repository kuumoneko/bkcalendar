import fetch_data from "@/utils/fetch";

export default async function get_semester(authorization: string) {
    try {
        const res = await fetch_data(
            ("/api/mybk/api/semester"),

            "POST",
            {
                "Content-Type": "application/json"
            },
            { authorization: authorization }

        );
        return res;
    }
    catch (e: any) {
        console.log(e);
        throw new Error(e);
    }
}