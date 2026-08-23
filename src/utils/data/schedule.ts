import { SubjectInfo } from "@/types/index";
import get_web_schedule from "./hcmut/api/schedule";
import { formatDate } from "@/types/day";
import mongodb from "./databsae";
import deepArrayEqual from "../array";
import Logout from "../logout";
import { get_expired, today_local } from "../day";

function enrich_expired(items: SubjectInfo[]): SubjectInfo[] {
    return items.map((item) => ({
        ...item,
        expired: get_expired(item.dates),
    }));
}

function prune_expired(items: SubjectInfo[], today: string): SubjectInfo[] {
    return items.filter(
        (item) => item.expired === undefined || item.expired >= today,
    );
}

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
        const today = today_local();

        let mybk_schedule: SubjectInfo[] = [], database_schedule: SubjectInfo[] = [], database_raw: SubjectInfo[] = [], filters: any[] = [];
        let schoolHasData = false;

        const promises = [];
        if (token.length !== 0 && token !== "undefined" && isOffline === false) {
            promises.push((get_web_schedule(token, id, semester)).then((res: any) => {
                mybk_schedule = prune_expired(enrich_expired(Array.isArray(res) ? res : []), today);
                schoolHasData = true;
            })
            )
        }
        promises.push(
            mongodb("schedule", "get", { username: username }).then((res: any) => {
                database_raw = Array.isArray(res) ? res.filter((item: any) => typeof item !== "string") : []
                database_schedule = prune_expired(enrich_expired(database_raw), today);
            })
        )
        promises.push(mongodb("filter", "get", { username: username }).then((res: any) => {
            filters = Array.isArray(res) ? res.filter((item: any) => item.semester === semester) : []
        })
        )
        await Promise.all(promises);
        
        if (mybk_schedule === null && database_schedule === null) {
            window.location.href = "/down";
        }

        if (schoolHasData && mybk_schedule.length === 0 && database_schedule.length > 0) {
            alert("Học kỳ này chưa có lịch học trên hệ thống. Đang hiển thị lịch học đã lưu.");
        }

        const Schedule = [...mybk_schedule, ...database_schedule].filter((item, index, self) =>
            index === self.findIndex((t) => (
                JSON.stringify(t, Object.keys(t).sort()) === JSON.stringify(item, Object.keys(item).sort())
            ))
        );

        const online = token.length !== 0 && token !== "undefined" && isOffline === false;
        const school_drifted = online && mybk_schedule.length !== 0 && !deepArrayEqual(mybk_schedule as unknown as SubjectInfo[], Schedule as unknown as SubjectInfo[]);
        const database_drifted = online && !deepArrayEqual(database_raw as unknown as SubjectInfo[], Schedule as unknown as SubjectInfo[]);
        if (school_drifted || database_drifted) {
            mongodb("schedule", "post", { username: username, data: Schedule });
        }

        const schedule: SubjectInfo[] = (token.length !== 0 && token !== "undefined" && isOffline === false) ? Schedule : database_schedule;

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
            const expired = sub.expired ?? get_expired(sub.dates);
            if (typeof dates === "string") {
                return {
                    ...sub,
                    expired,
                    dates: dates
                }
            }
            const temp = dates.map((item: string) => {
                const [year, month, day] = item.split("-").map(Number);
                return formatDate(year, month, day);
            })
            return {
                ...sub,
                expired,
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