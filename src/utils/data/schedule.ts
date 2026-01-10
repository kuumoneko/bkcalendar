import { SubjectInfo } from "@/types/index";
import get_web_schedule from "./hcmut/api/schedule";
import { formatDate } from "@/types/day";
import mongodb from "./databsae";
import deepArrayEqual from "../array";
import Logout from "../logout";

/**
 * Create fully schedule
 */
export default async function full_schedule(): Promise<SubjectInfo[]> {
    try {
        const token = localStorage.getItem("token") as string ?? ""
        const isOffline = localStorage.getItem("offline") === "true" ? true : false;
        if ((token.length === 0 || token === "undefined") && isOffline === false) {
            Logout();
            window.location.href = "/login";
            return [];
        }

        let { username, id, semester } = JSON.parse(localStorage.getItem("user") as string);

        let mybk_schedule: SubjectInfo[] = [], database_schedule: SubjectInfo[] = [], filters: any[] = [];

        const promises = [];
        if (token.length !== 0 && token !== "undefined" && isOffline === false) {
            promises.push((get_web_schedule(token, id, semester)).then((res: any) => {
                mybk_schedule = res;
            })
            )
        }
        promises.push(
            mongodb("schedule", "get", { username: username }).then((res: any) => {
                database_schedule = res
            })
        )
        promises.push(mongodb("filter", "get", { username: username }).then((res: any) => {
            filters = res;
        })
        )
        await Promise.all(promises);

        if (mybk_schedule === null && database_schedule === null) {
            window.location.href = "/down";
        }

        if (!deepArrayEqual(mybk_schedule as unknown as SubjectInfo[], database_schedule as unknown as SubjectInfo[])) {
            if (mybk_schedule.length !== 0) {
                mongodb("schedule", "post", { username: username, data: mybk_schedule });
            }
        }

        const schedule: SubjectInfo[] = (token.length !== 0 && token !== "undefined" && isOffline === false) ? mybk_schedule : database_schedule;

        if (filters.length > 0) {
            filters.sort((a: any, b: any) => {
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
        return []
    }
}