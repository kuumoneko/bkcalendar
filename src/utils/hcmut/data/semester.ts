
export default async function get_semester(authorization: string) {
    const res = await fetch(
        ("/api/semester"),
        {
            method: "POST",
            body: JSON.stringify({ authorization: authorization }),
        }
    );

    const data = await res.json();
    // if (Number(data.code) !== 200) {
    //     throw new Error(data);
    // }
    return data;
}