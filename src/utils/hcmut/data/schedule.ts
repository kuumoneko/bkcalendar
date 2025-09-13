

/**
 * Gets the date for a given year, ISO week number, and day of the week.
 * Note: In this context, weeks are based on the ISO 8601 standard, where
 * week 1 is the first week of the year with a Thursday.
 *
 * @param year The full year (e.g., 2025).
 * @param week The week number (1-53).
 * @param dayOfWeek The day of the week, where 0 is Sunday, 1 is Monday, ..., 6 is Saturday.
 * @returns The calculated Date object.
 */
function getDateFromWeek(year: number, week: number, dayOfWeek: number): string {
    // We use UTC to avoid timezone issues.
    // January 4th is always in week 1 of any given year in the ISO 8601 standard.
    const jan4 = new Date(Date.UTC(year, 0, 4));
    // Get the day of the week for Jan 4th (0=Sun, 1=Mon, ...).
    const dayOfJan4 = jan4.getUTCDay();

    // Find the date of the first day of week 1 (Monday).
    // If Jan 4 is Sunday (0), Monday is 6 days before. If it's Monday (1), it's 0 days before.
    const offsetToMonday = dayOfJan4 === 0 ? -6 : 1 - dayOfJan4;
    const firstMonday = new Date(jan4);
    firstMonday.setUTCDate(jan4.getUTCDate() + offsetToMonday);

    // Calculate the date for the Monday of the target week.
    // Week numbers are 1-based, so we subtract 1.
    const targetMonday = new Date(firstMonday);
    targetMonday.setUTCDate(firstMonday.getUTCDate() + (week - 1) * 7);

    // Adjust for the target day of the week.
    // The data uses 0 for Sunday, 1 for Monday, etc.
    // If our target is Monday (dayOfWeek=1), we add 0 days to targetMonday.
    // If our target is Sunday (dayOfWeek=0), we add 6 days to targetMonday.
    const dayOffset = (dayOfWeek + 6) % 7;
    const targetDate = new Date(targetMonday);
    targetDate.setUTCDate(targetMonday.getUTCDate() + dayOffset);

    return targetDate.toISOString().split('T')[0];
}

function getDatesForSchedule(scheduleItem: any): string[] {
    const year = scheduleItem.calendarYear;
    const dayOfWeek = scheduleItem.dayOfWeek - 1;
    const weeks = scheduleItem.weekSeriesDisplay.match(/\d+(\.\d+)?/g)?.map(Number) || [];

    return weeks.map((week: number) => getDateFromWeek(year, week, dayOfWeek));
}


export default async function get_schedule(authorization: string, studentId: string, semesterYear: string) {
    const res = await fetch(
        (`/api/schedule`),
        {
            method: "POST",
            body: JSON.stringify({
                authorization: authorization,
                semester_id: semesterYear, student_id: studentId
            }),
        }
    );

    const data = await res.json();
    
    const result = data.map((a: any) => {
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

    return result;
}