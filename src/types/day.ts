export const DayTime = {
    "1": {
        "startTime": "06:00",
        "endTime": "06:50"
    },
    "2": {
        "startTime": "07:00",
        "endTime": "07:50"
    },
    "3": {
        "startTime": "08:00",
        "endTime": "08:50"
    },
    "4": {
        "startTime": "09:00",
        "endTime": "09:50"
    },
    "5": {
        "startTime": "10:00",
        "endTime": "10:50"
    },
    "6": {
        "startTime": "11:00",
        "endTime": "11:50"
    },
    "7": {
        "startTime": "12:00",
        "endTime": "12:50"
    },
    "8": {
        "startTime": "13:00",
        "endTime": "13:50"
    },
    "9": {
        "startTime": "14:00",
        "endTime": "14:50"
    },
    "10": {
        "startTime": "15:00",
        "endTime": "15:50"
    },
    "11": {
        "startTime": "16:00",
        "endTime": "16:50"
    },
    "12": {
        "startTime": "17:00",
        "endTime": "17:50"
    },
    "13": {
        "startTime": "18:00",
        "endTime": "18:50"
    },
    "14": {
        "startTime": "18:50",
        "endTime": "19:40"
    },
    "15": {
        "startTime": "19:40",
        "endTime": "20:30"
    },
    "16": {
        "startTime": "20:30",
        "endTime": "21:20"
    },
    "17": {
        "startTime": "21:20",
        "endTime": "22:10"
    },
    "": {
        "startTime": "",
        "endTime": ""
    }
}

export function getWeekNumber(date: Date) {
    // Copy date so we don't modify the original
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

    // Set to nearest Thursday: current date + 4 - current day number
    // (Sunday is 0, Monday is 1, etc.)
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);

    // Get first day of year
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));

    // Calculate full weeks to nearest Thursday
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);

    return weekNo;
}

export function getDayOfWeek(year: number, month: number, day: number) {
    const date = new Date(formatDate(year, month, day));

    return date.getDay() + 1;

}

export function formatDate(year: number, month: number, day: number) {
    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
}
