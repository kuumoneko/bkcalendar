import get_student from "./databsae/user/get";
import update_student from "./databsae/user/update";
import get_semester from "./hcmut/api/semester";

export default async function get_this_semester(token: string, offline: boolean) {
    let { semester, username } = JSON.parse(localStorage.getItem("user") as string);

    if (!offline) {
        let web_semesters = await get_semester(token);
        const temp = web_semesters.find(
            (item: any) => item.isCurrent === true
        ).code;

        if (temp != semester) {
            const user = await get_student(username)

            const database = {
                ...user,
                semester: temp
            }
            await update_student(database);
        }
    }
    return semester;
}