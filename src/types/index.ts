export interface SubjectInfo {
    building: string;
    class: string;
    dates: string | string[];
    dayofWeek: number;
    endTime: string;
    lesson: string;
    room: string;
    startTime: string;
    subject: string;
    teacher: string;
    weeks: number[];
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