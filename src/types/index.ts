export interface SubjectInfo {
    building: string;
    class: string;
    dates: string | string[]; // yyyy-mm-dd
    dayofWeek: number;
    endTime: string;
    lesson: string;
    room: string;
    startTime: string;
    subject: string;
    teacher: string;
    weeks: number[];
}

export interface CSVHeader {
    Subject: string,
    'Start Date': string, // DD/MM/YYY
    'Start Time': string,
    'End Date': string, // DD/MM/YYY
    'End Time': string,
    'All Day Event': "TRUE" | 'FALSE',
    Description: string, // add teacher here
    Location: string,
    Private: "TRUE" | "FALSE"
}

export interface DailySchedule {
    day: string;
    subjects: SubjectInfo[];
}
export interface WeeklySchedule {
    [date: string]: DailySchedule;
}
export interface FullScheduleByWeek {
    [week: string]: WeeklySchedule;
}