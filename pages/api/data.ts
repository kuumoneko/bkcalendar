/**
 * Check if data is valid for request
 */
export function isValid(data?: string) {
    if (!data || data.length === 0) return false;
    return true;
}

/**
 * convert frmo search Params to json
 */
export default function convert(params: URLSearchParams): any {
    const paramsObject = Object.fromEntries(params.entries().map(([k, v]) => k === "data" ? [k, JSON.parse(v)] : [k, v]));
    return paramsObject as any;
}

/**
 * Parse request body to JSON
 */
export function parse_body(body: any) {
    return (typeof body === "string") ? JSON.parse(body) : body;
}