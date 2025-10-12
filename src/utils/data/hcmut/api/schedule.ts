import fetch_data from "@/utils/fetch";

/**
 * Gets the date for a given year, ISO week number, and day of the week.
 * 
 * Note: In this context, weeks are based on the ISO 8601 standard, where
 * week 1 is the first week of the year with a Thursday.
 *
 */
function getDateFromWeek(year: number, week: number, dayOfWeek: number): string {
    const jan4 = new Date(Date.UTC(year, 0, 4));
    const dayOfJan4 = jan4.getUTCDay();

    const offsetToMonday = dayOfJan4 === 0 ? -6 : 1 - dayOfJan4;
    const firstMonday = new Date(jan4);
    firstMonday.setUTCDate(jan4.getUTCDate() + offsetToMonday);

    const targetMonday = new Date(firstMonday);
    targetMonday.setUTCDate(firstMonday.getUTCDate() + (week - 1) * 7);

    const dayOffset = (dayOfWeek + 6) % 7;
    const targetDate = new Date(targetMonday);
    targetDate.setUTCDate(targetMonday.getUTCDate() + dayOffset);

    return targetDate.toISOString().split('T')[0];
}

/**
 * Get the dates from schedule
 */
function getDatesForSchedule(scheduleItem: any): string[] {
    const year = scheduleItem.calendarYear;
    const dayOfWeek = scheduleItem.dayOfWeek - 1;
    const weeks = scheduleItem.weekSeriesDisplay.match(/\d+(\.\d+)?/g)?.map(Number) || [];

    return weeks.map((week: number) => getDateFromWeek(year, week, dayOfWeek));
}

/**
 * Get Schedule of user
 */
export default async function get_web_schedule(authorization: string, studentId: string, semester: string): Promise<{
    subject: string;
    teacher: string;
    class: string;
    lesson: string;
    startTime: string;
    endTime: string;
    dayOfWeek: number;
    weeks: number[];
    room: string;
    building: string;
    dates: string[] | "--";
}[]> {

    const res = await fetch_data("/api/mybk/api/schedule", {
        "Content-Type": "application/json"
    }, {
        authorization: authorization,
        semester_id: semester, student_id: studentId
    })

    const result = res.map((a: any) => {
        return {
            subject: a.subject.nameVi,
            teacher: a.employee.lastName + " " + a.employee.firstName,
            class: a.subjectClassGroup.classGroup,
            lesson: `${a.startLesson} - ${a.numOfLesson - 1 + a.startLesson}`,
            startTime: a.startTime,
            endTime: a.endTime,
            dayOfWeek: a.dayOfWeek,
            weeks: a.weekSeriesDisplay.match(/\d+(\.\d+)?/g)?.map(Number) || [],
            room: a.room.code,
            building: a.room.building.campus.nameVi,
            dates: a.dayOfWeek === 0 ? "--" : (getDatesForSchedule(a))
        }
    })

    return result ?? [];
}