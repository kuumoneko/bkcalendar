export function convert(text: string) {
    let result = text;
    for (let i = 0; i < 2; i++) {
        const asciiString = result.split('').map((char: string) => char.charCodeAt(0)).join(' ');
        result = Buffer.from(asciiString).toString("base64");
    }
    return result
}

export function revert(text: string) {
    let result = text;
    for (let i = 0; i < 2; i++) {
        result = Buffer.from(result, 'base64').toString("utf-8").split(" ").map((char: string) => String.fromCharCode(Number(char))).join("")
    }
    return result
}