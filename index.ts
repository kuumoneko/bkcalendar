import { Tabletojson } from 'tabletojson';
import fs, { writeFileSync } from "node:fs"

const html = fs.readFileSync('./table.txt', 'utf8');

const tablesAsJson = Tabletojson.convert(html);

const temp = tablesAsJson[0];
const testt = temp.map((item: any) => {
    const a = item["TUẦN HỌC"].match(/\d+(\.\d+)?/g)?.map(Number) || [];

    return {
        ...item,
        "TUẦN HỌC": a
    }
})

writeFileSync("./data.json", JSON.stringify(testt, null, 2), { encoding: "utf-8" })
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

console.table((testt as any[]).filter((item: any) => {
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
)


console.log("Tuần kế tiếp: ", now.week + 1, " Năm: ", now.year);
console.table((testt as any[]).filter((item: any) => {
    return item["TUẦN HỌC"].includes(now.week + 1)
}).map((item: any) => {
    return {
        "TÊN MÔN HỌC": item["TÊN MÔN HỌC"],
        "THỨ": item["THỨ"],
        "TIẾT": item["TIẾT"],
        "GIỜ HỌC": item["GIỜ HỌC"],
        "PHÒNG": item["PHÒNG"],
    }
})
)
