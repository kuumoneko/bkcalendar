import mongodb from "./databsae";

export default async function get_this_semester(offline: boolean) {
    let { semester, username } = JSON.parse(localStorage.getItem("user") as string);

    if (!offline) {
        let temp = localStorage.getItem("semester")

        if (temp != semester) {
            const user = await mongodb("user", "get", { username })

            const database = {
                ...user,
                semester: temp
            }
            await mongodb("user", "post", { username: username, data: database });
        }
    }
    return semester;
}