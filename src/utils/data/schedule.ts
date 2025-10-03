import { SubjectInfo } from "@/types/index";
import get_web_schedule from "./hcmut/api/schedule";
import get_schedule from "./databsae/schedule/get";
import update_schedule from "./databsae/schedule/update";
import get_filter from "./databsae/filter/get";
import get_this_semester from "./semester";
import { formatDate } from "@/types/day";

/**
 * Create fully schedule
 */
export default async function full_schedule(): Promise<SubjectInfo[]> {

    const token = localStorage.getItem("token") as string ?? ""
    if (token.length === 0) {
        throw new Error("Not login")
    }

    const offline = (localStorage.getItem("offline") ?? "false") === "true" ? true : false;

    const this_semester = await get_this_semester(token, offline);

    if (!this_semester) {
        throw new Error("No current semester found.")
    }

    let { username, id } = JSON.parse(localStorage.getItem("user") as string);


    let { data: schedule, _id: schedule_id } = await get_schedule(username);

    if (!offline) {
        const schdule_from_mybk = await get_web_schedule(
            token,
            id,
            this_semester
        ) as unknown as SubjectInfo[];

        if (
            JSON.stringify(schedule) !== JSON.stringify(schdule_from_mybk)
        ) {
            const temp = {
                _id: schedule_id,
                username,
                data: schdule_from_mybk
            }
            await update_schedule(temp);
            schedule = schdule_from_mybk
        }
    }


    let { data: filters } = await get_filter(username);
    if (filters.length > 0) {

        filters = filters.sort((a: any, b: any) => {
            const a_keys = Object.keys(a.pre);

            if (a_keys.length === 1) return -1;
            const b_keys = Object.keys(b.pre);
            if (b_keys.length === 1) return 1;
            return 0;

        })

        for (const filter of filters) {
            const { pre: previous, aft: after }: { pre: any, aft: any } = filter;

            const { class: previous_class, ...other_pre_params } = previous
            let subjects: SubjectInfo[] = schedule.filter((sub: SubjectInfo) => {
                const keys = Object.keys(other_pre_params).filter(key => key !== "date");
                return sub.class === previous_class && keys.every(key => sub[key as keyof SubjectInfo] === other_pre_params[key]);
            });
            const keys = Object.keys(other_pre_params);
            let subject: SubjectInfo
            if (keys.includes("date")) {
                subject = subjects.filter((sub: SubjectInfo) => sub.dates.includes(other_pre_params.date))[0];
            }
            else {
                subject = subjects[0];
            }
            if (keys.length > 0) {
                for (const key of keys) { // Iterate over keys of other_pre_params, not all keys
                    if (key === "date") {
                        const index = subject.dates.indexOf(other_pre_params[key]);
                        if (index !== -1 && typeof subject.dates !== "string") {
                            subject.dates[index] = after[key]
                        }
                        continue;
                    }
                    if (after[key] === undefined || after[key] === null || subject[key as keyof SubjectInfo] === undefined || subject[key as keyof SubjectInfo] === null) {
                        console.log("ảo rồi bro")
                    }
                    (subject[key as keyof SubjectInfo] as any) = after[key]
                }
            }
            else {
                schedule.push({
                    class: previous_class,
                    ...after
                })
            }
        }
    }
    schedule = schedule.map((sub: SubjectInfo) => {
        const dates = sub.dates;
        if (typeof dates === "string") {
            return {
                ...sub,
                dates: dates
            }
        }
        const temp = dates.map((item: string) => {
            const [year, month, day] = item.split("-").map(Number);
            return formatDate(year, month, day);
        })
        return {
            ...sub,
            dates: temp
        }
    })
    localStorage.setItem("schedule", JSON.stringify(schedule));
    return schedule;
}