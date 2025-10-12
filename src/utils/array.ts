export default function deepArrayEqual(arr1: any[], arr2: any[]) {
    if (arr1 === undefined || arr2 === undefined) {
        return false;
    }

    if (arr1 === null || arr2 === null) {
        return false;
    }

    if (arr1.length !== arr2.length) {
        return false;
    }

    if (arr1 === arr2) {
        return true;
    }

    return arr1.every((value) => arr2.includes(value));
}