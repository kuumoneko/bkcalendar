/**
 * Parse request body to JSON
 */
export default function parse_body(body: any) {
    return (typeof body === "string") ? JSON.parse(body) : body;
}

/**
 * Check if data is valid for request
 */
export function isValid(data?: string) {
    if (!data || data.length === 0) return false;
    return true;
}