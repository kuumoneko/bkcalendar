import export_ics from "../src/utils/data/export_ics.js";

const schedule = [{
    subject: "Kỹ thuật số",
    startTime: "07:00",
    endTime: "08:50",
    dates: ["2026-10-14"],
    teacher: "LÊ THỊ KIM ANH",
    class: "L08",
    room: "H6-206",
    building: "Sở 2",
    dayofWeek: 3,
    lesson: "1-3",
    weeks: "1-15",
} as any];

const exams = [
    { subject: "Ngôn ngữ lập trình", date: "2026-10-14", startTime: "07g00", duration: "120", class: "L09_A_Ktr", room: "H6-208", building: "Sở 2" },
    { subject: "Giải tích mạch", date: "2026-10-16", startTime: "09:00", duration: "1:30:00", class: "L06_A_Ktr", room: "H6-205", building: "Sở 2" },
    { subject: "Kỹ thuật số", date: "2026-10-16", startTime: "13g30", duration: "90", class: "L08_A_Ktr", room: "H3-406", building: "Sở 1" },
    { subject: "Xác suất và Thống kê", date: "2026-10-15", startTime: "", duration: "", class: "L22_B_Ktr", room: "H2-206", building: "Sở 1" },
    { subject: "Quá khuya", date: "2026-10-16", startTime: "23g30", duration: "90", class: "X", room: "R", building: "Sở 2" },
] as any[];

const ics = export_ics(schedule, exams, "2026-09-24");
console.log(ics);

const bad = ics.match(/NaNNaN|T\d*g\d*/g);
if (bad) { console.error("BAD tokens:", bad); process.exit(1); }
if (!ics.includes("DTSTART:20261014T070000")) { console.error("missing 07g00 start"); process.exit(1); }
if (!ics.includes("DTEND:20261014T091500")) { console.error("missing duration end 120+15"); process.exit(1); }
if (!ics.includes("DTEND:20261017T011500")) { console.error("missing midnight-rollover end"); process.exit(1); }
if (!ics.includes("DTSTART;VALUE=DATE:20261015")) { console.error("missing all-day exam"); process.exit(1); }
if (!ics.includes("SEQUENCE:0")) { console.error("missing SEQUENCE"); process.exit(1); }

const schedule_multi = [{
    subject: "Kỹ thuật số",
    startTime: "07:00",
    endTime: "08:50",
    dates: ["2026-09-24", "2026-10-01", "2026-10-08", "2026-10-15"],
    teacher: "LÊ THỊ KIM ANH",
    class: "L08",
    room: "H6-206",
    building: "Sở 2",
    dayofWeek: 3,
    lesson: "1-3",
    weeks: "1-15",
} as any];

const ics_a = export_ics(schedule_multi, [], "2026-09-24");
const ics_b = export_ics(schedule_multi, [], "2026-10-01");

const uid_a = ics_a.match(/UID:[^\r\n]+/g) ?? [];
const uid_b = ics_b.match(/UID:[^\r\n]+/g) ?? [];
if (uid_a.length === 0) { console.error("no UIDs in ics_a"); process.exit(1); }
if (JSON.stringify(uid_a) !== JSON.stringify(uid_b)) {
    console.error("UIDs not stable across today:", uid_a, uid_b);
    process.exit(1);
}

const start_a = ics_a.match(/DTSTART:[^\r\n]+/);
const start_b = ics_b.match(/DTSTART:[^\r\n]+/);
if (!start_a || !start_b || start_a[0] === start_b[0]) {
    console.error("DTSTART should shift with today (future-only):", start_a, start_b);
    process.exit(1);
}
if (!start_b[0].includes("20261001")) {
    console.error("DTSTART for later today should be first remaining date:", start_b);
    process.exit(1);
}

console.log("ALL OK");
