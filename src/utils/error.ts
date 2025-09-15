/**
 * Handle error and link to error page
 */
export function handle_error(code: string) {
    localStorage.setItem("error", code);
    window.location.href = `/error`;
}