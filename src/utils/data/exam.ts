import mongodb from "./databsae";
import get_exam from "./hcmut/api/exam";
import get_this_semester from "./semester";

export default async function get_full_exam() {
    const token = localStorage.getItem("token") as string ?? ""
    if (token.length === 0) {
        window.location.href = "/login"
    }

    const offline = (localStorage.getItem("offline") ?? "false") === "true" ? true : false;

    const this_semester = get_this_semester();

    if (!this_semester) {
        throw new Error("No current semester found.")
    }

    let { username, MSSV } = JSON.parse(localStorage.getItem("user") as string);

    let exam = await mongodb("exam", "get", { username });

    if (!offline) {
        const year = String(this_semester).substring(0, 4);
        const semester_type = String(this_semester).substring(4, 5);
        const exam_from_mybk = await get_exam(
            token,
            MSSV,
            semester_type, year
        )

        if (
            JSON.stringify(exam) !== JSON.stringify(exam_from_mybk)
        ) {
            await mongodb("exam", "post", { username, data: exam_from_mybk });
            exam = exam_from_mybk
        }
    }

    return exam;
}