import { SubjectInfo } from "@/types/index";
import get_web_schedule from "./hcmut/api/schedule";
import { formatDate } from "@/types/day";
import mongodb from "./databsae";
import deepArrayEqual from "../array";

/**
 * Create fully schedule
 */
export default async function full_schedule(): Promise<SubjectInfo[]> {
    try {
        const token = localStorage.getItem("token") as string ?? ""
        if (token.length === 0) {
            window.location.href = "/login"
        }
        let { username, id, semester } = JSON.parse(localStorage.getItem("user") as string);

        let mybk_schedule, database_schedule, filters;

        const task_promises: any[] = [];

        task_promises.push(get_web_schedule(token, id, semester).then(res => mybk_schedule = res))
        task_promises.push(mongodb("schedule", "get", { username: username }).then(res => database_schedule = res as unknown as SubjectInfo[] ?? []));
        task_promises.push(mongodb("filter", "get", { username: username }).then(res => filters = res ?? []));

        await Promise.all(task_promises);
        let schedule: SubjectInfo[] = mybk_schedule as unknown as SubjectInfo[];

        if (!deepArrayEqual(mybk_schedule as unknown as SubjectInfo[], database_schedule as unknown as SubjectInfo[])) {
            mongodb("schedule", "post", { username: username, data: schedule });
        }

        if ((filters ?? []).length > 0) {
            filters = (filters ?? []).sort((a: any, b: any) => {
                const aKeys = Object.keys(a).length;
                const bKeys = Object.keys(b).length;

                const aPriority = aKeys > 2 ? 0 : 1;
                const bPriority = bKeys > 2 ? 0 : 1;

                return aPriority - bPriority;
            }) as unknown as any[]

            for (const filter of filters) {

                const { class: class_code, dates, ...other_pre_params } = filter
                if (Object.keys(other_pre_params).length > 1 && !(Object.keys(other_pre_params).length === 2 && Object.keys(other_pre_params).includes("building") && Object.keys(other_pre_params).includes("room"))) {
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

        const result = schedule.map((sub: SubjectInfo) => {
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

        localStorage.setItem("schedule", JSON.stringify(result));
        return result ?? [];
    }
    catch (e) {
        console.log(e)
        return []
    }
}