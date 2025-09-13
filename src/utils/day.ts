export function getnow() {
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

// function to convert yyy-mm-dd to full day in vietnamese
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