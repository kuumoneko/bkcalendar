export type ThemeMode = "light" | "dark";

export function apply_theme(theme: ThemeMode) {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
}

export function get_current_theme(): ThemeMode {
    return document.documentElement.classList.contains("light")
        ? "light"
        : "dark";
}

export function resolve_theme(): ThemeMode {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") {
        return saved;
    }
    return window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";
}

export function toggle_theme(): ThemeMode {
    const next: ThemeMode = get_current_theme() === "light" ? "dark" : "light";
    localStorage.setItem("theme", next);
    apply_theme(next);
    return next;
}
