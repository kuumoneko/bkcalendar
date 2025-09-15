import { useState, useEffect } from "react";

export function useOrientationMode() {
    const [mode, setMode] = useState<"row" | "col">("row");

    useEffect(() => {
        const updateMode = () => {
            const { innerWidth: width, innerHeight: height } = window;
            setMode(height > width ? "col" : "row");
        };

        updateMode(); // Initial check
        window.addEventListener("resize", updateMode);

        return () => window.removeEventListener("resize", updateMode);
    }, []);

    return mode;
}