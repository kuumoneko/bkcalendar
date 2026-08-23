import { ExamInfo } from "@/types";
import mongodb from "./databsae";
import get_exam from "./hcmut/api/exam";
import Logout from "../logout";
import { get_expired, today_local } from "../day";

export default async function get_full_exam() {
    const token = localStorage.getItem("token") as string ?? ""
    const isOffline = localStorage.getItem("offline") === "true" ? true : false;
    if ((token.length === 0 || token === "undefined") && isOffline === false) {
        Logout();
        window.location.href = "/login";
        return [];
    }
    const promises = [];

    let database_exam: any = [], mybk_exam: any = [], database_exam_raw: any = [];
    if (token.length !== 0 && token !== "undefined" && isOffline === false) {
        let { MSSV, semester: this_semester } = JSON.parse(localStorage.getItem("user") as string);

        const year = String(this_semester).substring(0, 4);
        const semester_type = String(this_semester).substring(4, 5);
        promises.push(get_exam(token, MSSV, semester_type, year).then((res: any) => {
            mybk_exam = res;
        }))
    }
    let { username } = JSON.parse(localStorage.getItem("user") as string);

    promises.push(
        mongodb("exam", "get", { username }).then((res: any) => [
            database_exam_raw = res
        ])
    )

    await Promise.all(promises);

    const today = today_local();

    const prepare_exams = (exams: any) => Array.isArray(exams)
        ? exams
            .map((exam: ExamInfo) => ({
                ...exam,
                expired: get_expired(exam.date),
            }))
            .filter((exam: ExamInfo) => exam.expired === undefined || exam.expired >= today)
        : exams;

    mybk_exam = prepare_exams(mybk_exam);
    database_exam = prepare_exams(database_exam_raw);

    if (database_exam === null && mybk_exam === null) {
        window.location.href = "/down";
    }

    if (
        Array.isArray(mybk_exam) &&
        JSON.stringify(database_exam_raw) !== JSON.stringify(mybk_exam)
    ) {
        mongodb("exam", "post", { username, data: mybk_exam });
        return mybk_exam
    }
    else {
        return database_exam;
    }
}