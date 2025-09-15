import get_schedule from "./hcmut/api/schedule";
import get_semester from "./hcmut/api/semester";

export default async function full_schedule(): Promise<any> {
    const token = localStorage.getItem("token") as string ?? ""
    if (token.length === 0) {
        return "notlogin"
    }
    const semester = await get_semester(token);
    const this_semester = semester.find(
        (item: any) => item.isCurrent === true
    );

    if (!this_semester) {
        console.error("No current semester found.");
        return;
    }

    const student_id = JSON.parse(
        localStorage.getItem("user") as string
    ).id;


    const schedule = await get_schedule(
        token,
        student_id,
        this_semester.code
    );

    localStorage.setItem("schedule", JSON.stringify(schedule));

    return schedule;

}