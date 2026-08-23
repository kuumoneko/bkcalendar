import { SubjectInfo, ExamInfo } from "@/types";

function escape_ics_text(text: string): string {
    return text
        .replace(/\\/g, "\\\\")
        .replace(/;/g, "\\;")
        .replace(/,/g, "\\,")
        .replace(/\n/g, "\\n");
}

// UTC-safe date parsing — no local timezone drift
function parse_utc(date: string): Date {
    const [y, m, d] = date.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d));
}

function format_utc(date: Date): string {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, "0");
    const d = String(date.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

// Local today as "yyyy-mm-dd" for past-event filter
function today_local(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

// yyyy-mm-dd + 1 day (UTC-safe)
function next_day(date: string): string {
    const d = parse_utc(date);
    d.setUTCDate(d.getUTCDate() + 1);
    return format_utc(d);
}

// yyyy-mm-dd + "H:mm" → "YYYYMMDDTHHMMSS" (zero-padded per RFC 5545)
function to_ics_datetime(date: string, time: string): string {
    const [y, m, d] = date.split("-");
    const parts = time.split(":");
    const h = String(parts[0]).padStart(2, "0");
    const min = String(parts[1] ?? "0").padStart(2, "0");
    return `${y}${m}${d}T${h}${min}00`;
}

// "H:mm" → padded "HHMM00" (for EXDATE time matching)
function to_ics_time(time: string): string {
    const parts = time.split(":");
    const h = String(parts[0]).padStart(2, "0");
    const min = String(parts[1] ?? "0").padStart(2, "0");
    return `${h}${min}00`;
}

function to_ics_date(date: string): string {
    return date.replace(/-/g, "");
}

function parse_duration_minutes(raw: string): number | null {
    if (!raw || raw.length === 0) return null;
    if (/^\d+$/.test(raw)) return parseInt(raw, 10);
    const hm = raw.match(/^(\d{1,2}):(\d{2})$/);
    if (hm) return parseInt(hm[1], 10) * 60 + parseInt(hm[2], 10);
    return null;
}

function add_minutes(time: string, minutes: number): string {
    const [h, m] = time.split(":").map(Number);
    const total = h * 60 + m + minutes;
    const eh = Math.floor(total / 60) % 24;
    const em = total % 60;
    return `${String(eh).padStart(2, "0")}:${String(em).padStart(2, "0")}`;
}

function make_uid(subject: string, date: string, extra: string, type: number): string {
    const slug = subject
        .replace(/[^a-zA-Z0-9\u00C0-\u024F]/g, "")
        .toLowerCase()
        .slice(0, 30);
    const extra_slug = (extra || "")
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase()
        .slice(0, 10);
    return `${slug}-${date.replace(/-/g, "")}-${extra_slug}-${type}@bkcalendar`;
}

function building_label(building: string | undefined): string {
    if (!building) return "";
    if (building.includes("Sở 2") || building.includes("DiAn")) return "CS2";
    if (building.includes("Sở 1")) return "CS1";
    return building;
}

// All week dates (7-day intervals) between first and last, UTC-safe
function get_all_week_starts(first: string, last: string): string[] {
    const result: string[] = [];
    const start = parse_utc(first);
    const end = parse_utc(last);
    while (start <= end) {
        result.push(format_utc(start));
        start.setUTCDate(start.getUTCDate() + 7);
    }
    return result;
}

function build_schedule_events(schedule: SubjectInfo[], today: string): string[][] {
    const all_events: string[][] = [];

    for (const sub of schedule) {
        if (!sub.dates || typeof sub.dates === "string") continue;

        const valid_dates = (sub.dates as string[])
            .filter(d => typeof d === "string" && !d.includes("--"))
            .filter(d => d >= today)
            .sort();

        if (valid_dates.length === 0) continue;

        const first = valid_dates[0];
        const last = valid_dates[valid_dates.length - 1];
        const present = new Set(valid_dates);

        const all_weeks = get_all_week_starts(first, last);
        const missing = all_weeks.filter(w => !present.has(w));

        const subject = sub.subject?.trim() ?? "";
        const teacher = sub.teacher?.trim() ?? "Ch\u01b0a bi\u1ebft";
        const cls = sub.class ?? "Kh\u00f4ng c\u00f3";
        const room_raw = sub.room?.includes("NHATHIDAU") ? "NHATHIDAU" : (sub.room ?? "");
        const campus = building_label(sub.building);

        const lines: string[] = [
            "BEGIN:VEVENT",
            `UID:${make_uid(subject, first, cls, 0)}`,
            `DTSTART:${to_ics_datetime(first, sub.startTime)}`,
            `DTEND:${to_ics_datetime(first, sub.endTime)}`,
            `SUMMARY:${escape_ics_text(subject)}`,
            `LOCATION:${escape_ics_text(room_raw + " " + campus)}`,
            `DESCRIPTION:Gi\u00e3ng vi\u00ean: ${escape_ics_text(teacher)}\\nL\u1ed7p: ${escape_ics_text(cls)}`,
        ];

        if (valid_dates.length === 1) {
            // Single occurrence — no RRULE
        } else if (missing.length === 0) {
            lines.push(`RRULE:FREQ=WEEKLY;COUNT=${valid_dates.length}`);
        } else {
            lines.push(`RRULE:FREQ=WEEKLY;UNTIL=${to_ics_date(last)}T235959`);
            for (const ex of missing) {
                lines.push(`EXDATE;VALUE=DATE-TIME:${to_ics_date(ex)}T${to_ics_time(sub.startTime)}`);
            }
        }

        lines.push("END:VEVENT");
        all_events.push(lines);
    }

    return all_events;
}

function build_exam_events(exams: ExamInfo[], today: string): string[][] {
    const all_events: string[][] = [];

    for (const exam of exams) {
        if (!exam.date) continue;
        if (exam.date < today) continue;

        const lines: string[] = ["BEGIN:VEVENT"];
        const duration_min = parse_duration_minutes(exam.duration);

        if (exam.startTime && duration_min !== null && duration_min > 0) {
            const end_time = add_minutes(exam.startTime, duration_min + 15);
            lines.push(`DTSTART:${to_ics_datetime(exam.date, exam.startTime)}`);
            lines.push(`DTEND:${to_ics_datetime(exam.date, end_time)}`);
        } else {
            lines.push(`DTSTART;VALUE=DATE:${to_ics_date(exam.date)}`);
            lines.push(`DTEND;VALUE=DATE:${to_ics_date(next_day(exam.date))}`);
        }

        const subject = exam.subject?.trim() ?? "";
        const cls = exam.class ?? "Kh\u00f4ng c\u00f3";
        const campus = building_label(exam.building);

        lines.push(`UID:${make_uid(subject, exam.date, cls, 1)}`);
        lines.push(`SUMMARY:${escape_ics_text(("Ki\u1ec3m tra " + subject).trim())}`);
        lines.push(`LOCATION:${escape_ics_text((exam.room ?? "") + " " + campus)}`);
        lines.push(`DESCRIPTION:L\u1ed7p: ${escape_ics_text(cls)}`);
        lines.push("END:VEVENT");
        all_events.push(lines);
    }

    return all_events;
}

export default function export_ics(schedule: SubjectInfo[], exams: ExamInfo[]): string {
    const today = today_local();
    const schedule_events = build_schedule_events(schedule, today);
    const exam_events = build_exam_events(exams, today);

    const dtstamp = new Date()
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");

    const all_lines: string[] = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//BK Calendar//VN",
        "CALSCALE:GREGORIAN",
        "X-WR-CALNAME:BK Calendar",
    ];

    for (const ev of [...schedule_events, ...exam_events]) {
        all_lines.push(ev[0]);
        all_lines.push(`DTSTAMP:${dtstamp}`);
        all_lines.push(...ev.slice(1));
    }

    all_lines.push("END:VCALENDAR");

    return all_lines.join("\r\n") + "\r\n";
}
