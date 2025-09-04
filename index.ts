import { Tabletojson } from 'tabletojson';
import { readFileSync } from "node:fs"

const html = readFileSync('./table.txt', 'utf8');

const tablesAsJson = Tabletojson.convert(html);

const temp = tablesAsJson[0];
const table = temp.map((item: any) => {
    const a = item["TUẦN HỌC"].match(/\d+(\.\d+)?/g)?.map(Number) || [];

    return {
        ...item,
        "TUẦN HỌC": a
    }
})

function test() {
    // Get today's date
    const today = new Date();

    // Create a copy of the date at midnight
    const date: any = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

    // Get the day of the week (Monday = 1, Sunday = 7)
    const dayNum = date.getUTCDay() || 7;

    // Move date to the nearest Thursday (ISO week starts on Monday)
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);

    // Get the first day of the year
    const yearStart: any = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));

    // Calculate the week number
    const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
    return {
        year: date.getUTCFullYear(),
        week: weekNo
    }
}
const now = test();

console.log("Tuần hiện tại: ", now.week, " Năm: ", now.year);
console.log("-----");
const dayNames = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
const now_date: number = (new Date().getDay())

function run() {

    // show the whole week schedule if today is monday
    if (now_date === 1) {
        console.log("Hôm nay là Thứ Hai, tuần mới bắt đầu");
        const thisweekSchedule = (table as any[]).filter((item: any) => {
            return item["TUẦN HỌC"].includes(now.week)
        }).map((item: any) => {
            return {
                "TÊN MÔN HỌC": item["TÊN MÔN HỌC"],
                "THỨ": item["THỨ"],
                "TIẾT": item["TIẾT"],
                "GIỜ HỌC": item["GIỜ HỌC"],
                "PHÒNG": item["PHÒNG"],
            }
        })
        if (thisweekSchedule.length > 0) {
            console.table(thisweekSchedule);
            console.log("-----");
        }
        else {
            console.log("Tuần này không có lịch học");
            return;
        }
    }

    // show the next week schedule if today is sunday
    if ((now_date % 7) === 0) {
        console.log("Hôm nay là Chủ Nhật, không có lịch học");
        console.log("Tuần kế tiếp: ", now.week + 1, " Năm: ", now.year);
        console.table((table as any[]).filter((item: any) => {
            return item["TUẦN HỌC"].includes(now.week + 1)
        }).map((item: any) => {
            return {
                "TÊN MÔN HỌC": item["TÊN MÔN HỌC"],
                "THỨ": item["THỨ"],
                "TIẾT": item["TIẾT"],
                "GIỜ HỌC": item["GIỜ HỌC"],
                "PHÒNG": item["PHÒNG"],
            }
        }))
    }
    else {
        console.log("Hôm nay là: ", dayNames[now_date % 7]);

        const todaySchedule = (table as any[]).filter((item: any) => {
            return item["TUẦN HỌC"].includes(now.week) && item["THỨ"] === String((now_date + 1) % 7)
        }).map((item: any) => {
            return {
                "TÊN MÔN HỌC": item["TÊN MÔN HỌC"],
                "THỨ": item["THỨ"],
                "TIẾT": item["TIẾT"],
                "GIỜ HỌC": item["GIỜ HỌC"],
                "PHÒNG": item["PHÒNG"],
            }
        })
        // show today's schedule
        if (todaySchedule.length > 0) {
            console.table(todaySchedule)
        }
        else {
            console.log("Hôm nay không có lịch học");
        }
        console.log("-----");
        const tomorrow = (now_date + 1);

        if (tomorrow !== 7) {
            // show tomorrow's schedule
            console.log("Ngày mai là: ", dayNames[tomorrow % 7]);
            const tomorowSchedule = (table as any[]).filter((item: any) => {
                return item["TUẦN HỌC"].includes(now.week) && item["THỨ"] === String((tomorrow + 1) % 7)
            }).map((item: any) => {
                return {
                    "TÊN MÔN HỌC": item["TÊN MÔN HỌC"],
                    "THỨ": item["THỨ"],
                    "TIẾT": item["TIẾT"],
                    "GIỜ HỌC": item["GIỜ HỌC"],
                    "PHÒNG": item["PHÒNG"],
                }
            })
            if (tomorowSchedule.length > 0) {
                console.table(tomorowSchedule)
            }
            else {
                console.log("Ngày mai không có lịch học");
            }
        }
        else {
            console.log("Ngày mai là Chủ Nhật, không có lịch học");
        }
    }
}

run();