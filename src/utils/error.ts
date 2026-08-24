import { is_going_public } from "./public_redirect";

/**
 * Handle error and link to error page
 */
export function handle_error(code: string) {
    if (is_going_public()) {
        return;
    }
    window.location.href = `/error?${new URLSearchParams(code)}`;
}
