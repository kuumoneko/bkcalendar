import { SubjectInfo } from "@/types/index";
import get_schedule from "./hcmut/api/schedule";
import get_semester from "./hcmut/api/semester";

/**
 * Create fully schedule
 */
export default async function full_schedule(): Promise<SubjectInfo[]> {
    const token = localStorage.getItem("token") as string ?? ""
    if (token.length === 0) {
        throw new Error("Not login")
    }
    const semester = await get_semester(token);
    const this_semester = semester.find(
        (item: any) => item.isCurrent === true
    );

    if (!this_semester) {
        throw new Error("No current semester found.")
    }

    const student_id = JSON.parse(
        localStorage.getItem("user") as string
    ).id;

    const schedule: SubjectInfo[] = await get_schedule(
        token,
        student_id,
        this_semester.code
    ) as unknown as SubjectInfo[];

    localStorage.setItem("schedule", JSON.stringify(schedule));
    return schedule;
}