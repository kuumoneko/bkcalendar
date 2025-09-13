import get_schedule from "./hcmut/data/schedule";
import get_semester from "./hcmut/data/semester";

export default async function full_schedule() {
    const token = localStorage.getItem("token") as string;
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

    // console.log(student_id);

    const schedule = await get_schedule(
        token,
        student_id,
        this_semester.code
    );

    return schedule;

}