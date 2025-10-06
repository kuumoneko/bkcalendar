export default function isDown(status: number) {
    if ([408, 504, 503, 500].includes(status)) {
        return true;
    }
    return false;
}