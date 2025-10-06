import { SubjectInfo } from "@/types/index";
import get_web_schedule from "./hcmut/api/schedule";
import { formatDate } from "@/types/day";
import mongodb from "./databsae";
import get_web_semester from "./hcmut/api/semester";

/**
 * Create fully schedule
 */
export default async function full_schedule(): Promise<SubjectInfo[]> {

    const token = localStorage.getItem("token") as string ?? ""
    if (token.length === 0) {
        window.location.href = "/login"
    }

    const offline = (localStorage.getItem("offline") ?? "false") === "true" ? true : false;

    const this_semester = await get_web_semester();

    if (!this_semester) {
        throw new Error("No current semester found.")
    }

    let { username, id } = JSON.parse(localStorage.getItem("user") as string);


    let schedule = await mongodb("schedule", "get", { username });

    if (!offline) {
        const schdule_from_mybk = await get_web_schedule(
            token,
            id,
            this_semester
        ) as unknown as SubjectInfo[];

        if (
            JSON.stringify(schedule) !== JSON.stringify(schdule_from_mybk)
        ) {
            await mongodb("schedule", "post", { username, data: schdule_from_mybk });
            schedule = schdule_from_mybk
        }
    }

    let filters = await mongodb("filter", "get", { username });
    if (filters.length > 0) {

        filters = filters.sort((a: any, b: any) => {
            const a_keys = Object.keys(a);

            if (a_keys.length === 1) return -1;
            const b_keys = Object.keys(b);
            if (b_keys.length === 1) return 1;
            return 0;

        })

        for (const filter of filters) {

            const { class: class_code, dates, ...other_pre_params } = filter
            if (class_code.length < 1) {
                schedule.push({
                    class: class_code,
                    dates: dates.map((item: string) => {
                        const [year, month, day] = item.split("-").map(Number);
                        return formatDate(year, month, day)
                    }),
                    ...filter
                })
                continue;
            }
            let subjects: SubjectInfo[] = schedule.filter((sub: SubjectInfo) => {
                return sub.class === class_code
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
                            subject.dates[index] = filter[key]
                        }
                        continue;
                    }
                    if (filter[key] === undefined || filter[key] === null || subject[key as keyof SubjectInfo] === undefined || subject[key as keyof SubjectInfo] === null) {
                        console.log("ảo rồi bro")
                    }
                    (subject[key as keyof SubjectInfo] as any) = filter[key]
                }
            }
            else {
                schedule.push({
                    class: class_code,
                    ...filter
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