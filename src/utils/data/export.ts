import { CSVHeader } from "@/types";

export default function export_csv(schedule: any[]): CSVHeader[] {
    const result: CSVHeader[] = [];


    for (const sub of schedule) {
        if (typeof sub.dates === "string") {
            if (sub.dates.includes("-")) {
                continue;
            }
        }
        if (sub.dates !== undefined && sub.dates !== null) {
            for (const data of (sub.dates as string[]).filter((item: string) => { return new Date(item).getTime() > Date.now() })) {
                result.push(
                    {
                        Subject: sub.subject,
                        'Start Date': convertDateFormat(data),
                        'Start Time': convertTimeFormat(sub.startTime),
                        'End Date': convertDateFormat(data),
                        'End Time': convertTimeFormat(sub.endTime),
                        'All Day Event': 'FALSE',
                        Description: `Giảng viên: ${sub.teacher} Lớp: ${sub.class.length === 0 ? "Không có" : sub.class}`,
                        Location: `${sub.room?.includes("NHATHIDAU")
                            ? "NHATHIDAU"
                            : sub.room
                            } ${sub.building?.includes("1") ? "CS1" : "CS2"}`,
                        Private: 'FALSE'
                    }
                )
            }
        }
        else {
            if (new Date(sub.date).getTime() < Date.now()) {
                continue;
            }
            result.push(
                {
                    Subject: `Kiểm tra ${sub.subject}`,
                    'Start Date': convertDateFormat(sub.date),
                    'Start Time': "",
                    'End Time': "",
                    'End Date': convertDateFormat(sub.date),
                    'All Day Event': 'TRUE',
                    Description: `Lớp: ${sub.class.length === 0 ? "Không có" : sub.class}`,
                    Location: `${sub.room?.includes("NHATHIDAU")
                        ? "NHATHIDAU"
                        : sub.room
                        } ${sub.building?.includes("1") ? "CS1" : "CS2"}`,
                    Private: 'FALSE'
                }
            )
        }
    }
    return result;
}

// Convert yyyy-mm-dd to dd/mm/yyyy
function convertDateFormat(dateString: string): string {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

// Convert 24 base hour to 12 base hour
function convertTimeFormat(timeString: string): string {
    const [hour, minute] = timeString.split(':').map(Number);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12}:${String(minute).padStart(2, '0')} ${ampm}`;
}
