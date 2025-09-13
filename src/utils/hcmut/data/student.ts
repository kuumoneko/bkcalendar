
export default async function get_student_data(authorization: string) {
    const res = await fetch(
        ("/api/student"),
        {
            method: "POST",
            body: JSON.stringify({
                authorization: authorization,
            }),
        }
    );
    const data = await res.json();
    
    return data;
}