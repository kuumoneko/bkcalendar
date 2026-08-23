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
 *  dateString convert yyyy-mm-dd to full day in vietnamese
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

/**
 * get local today as yyyy-mm-dd
 */
export function today_local(): string {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${now.getFullYear()}-${month}-${day}`;
}

/**
 * get the last valid date (yyyy-mm-dd) of a schedule item
 */
export function get_expired(dates: string | string[] | undefined): string | undefined {
    if (!dates) {
        return undefined;
    }
    if (typeof dates === "string") {
        return /^\d{4}-\d{2}-\d{2}$/.test(dates) ? dates : undefined;
    }
    const valid = dates.filter((d: string) => /^\d{4}-\d{2}-\d{2}$/.test(d));
    if (valid.length === 0) {
        return undefined;
    }
    return valid.reduce((a: string, b: string) => (a > b ? a : b));
}