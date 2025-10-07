export default function deepEqual(obj1: { [key: string]: any }, obj2: { [key: string]: any }) {
    if (obj1 === obj2) return true;
    if (obj1 == null || obj2 == null) return false;
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;

    const keys1: string[] = Object.keys(obj1);
    const keys2: string[] = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
        if (!keys2.includes(key) || !deepEqual(obj1[key] as { [key: string]: any }, obj2[key] as { [key: string]: any })) {
            return false;
        }
    }

    return true;
}