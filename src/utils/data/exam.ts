import { ExamInfo } from "@/types";
import mongodb from "./databsae";
import get_exam from "./hcmut/api/exam";
import Logout from "../logout";

export default async function get_full_exam() {
    const token = localStorage.getItem("token") as string ?? ""
    const isOffline = localStorage.getItem("offline") === "true" ? true : false;
    if ((token.length === 0 || token === "undefined") && isOffline === false) {
        Logout();
        window.location.href = "/login";
        return [];
    }
    const promises = [];

    let database_exam: ExamInfo[] = [], mybk_exam: ExamInfo[] = [];
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
            database_exam = res
        ])
    )

    await Promise.all(promises);

    if (database_exam.length === 0 && mybk_exam.length === 0) {
        window.location.href = "/down";
    }

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