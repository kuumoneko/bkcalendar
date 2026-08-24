export function push_noti(message: string, type: "error" | "info" = "info") {
    window.dispatchEvent(
        new CustomEvent("bk-noti", {
            detail: {
                id: `${Date.now()}-${Math.random()}`,
                message,
                type,
            },
        }),
    );
}
