/**
 * Handle error and link to error page
 */
export function handle_error(code: string) {
    window.location.href = `/error?${new URLSearchParams(code)}`;

}