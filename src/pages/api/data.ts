/**
 * Parse request body to JSON
 */
export default function parse_body(body: any) {
    return (typeof body === "string") ? JSON.parse(body) : body;
}