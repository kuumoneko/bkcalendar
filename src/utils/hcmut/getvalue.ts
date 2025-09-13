export default function getELement(html: string, id: string = "", name: string = "") {
    if (id.length > 0 && name.length > 0) {
        throw new Error("Invalid arguments");
    }
    let regex: RegExp;
    if (id.length > 0) {
        regex = new RegExp(
            `<[a-z]+[^>]*id=["']${id}["'][^>]*value=["']([^"']+)["']`,
            "i"
        );
    } else if (name.length > 0) {
        regex = new RegExp(
            `<[a-z]+[^>]*name=["']${name}["'][^>]*value=["']([^"']+)["']`,
            "i"
        );
    } else {
        throw new Error("Invalid arguments");
    }

    const match = html.match(regex);
    return match ? match[1] : null;
}