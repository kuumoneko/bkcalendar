/**
 * get current year and week number of the year
 */
export function getnow(): { year: number, week: number } {
    const today = new Date();

    const date: any = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);

    const yearStart: any = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));

    const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
    return {
        year: date.getUTCFullYear(),
        week: weekNo
    }
}

/**
 *  dateString convert yyy-mm-dd to full day in vietnamese
 */
export function convertDateFormat(dateString: string): string {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return date.toLocaleDateString('vi-VN', options);
}