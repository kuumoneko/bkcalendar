import mongodb from "./databsae";
import get_exam from "./hcmut/api/exam";

export default async function get_full_exam() {
    const token = localStorage.getItem("token") as string ?? ""
    if (token.length === 0) {
        window.location.href = "/login"
    }

    let { username, MSSV, semester: this_semester } = JSON.parse(localStorage.getItem("user") as string);

    let database_exam: any, mybk_exam: any;

    const exam_promises = [];
    const year = String(this_semester).substring(0, 4);
    const semester_type = String(this_semester).substring(4, 5);
    exam_promises.push(get_exam(token, MSSV, semester_type, year).then(res => mybk_exam = res))
    exam_promises.push(mongodb("exam", "get", { username }).then(res => database_exam = res))

    await Promise.all(exam_promises);

    if (
        JSON.stringify(database_exam) !== JSON.stringify(mybk_exam)
    ) {
        mongodb("exam", "post", { username, data: mybk_exam });
        return mybk_exam
    }
    else {
        return database_exam;
    }
}