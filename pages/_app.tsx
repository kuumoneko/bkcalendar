"use client";
import "@/styles/globals.css";
import Logout from "@/utils/logout";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import Template from "./template";

export default function App({ Component, pageProps }: AppProps) {
    useEffect(() => {
        const run = setInterval(() => {
            async function run() {
                const user = localStorage.getItem("user");
                const expires = localStorage.getItem("expires");
                if (!user || !expires) {
                    return;
                }

                const now = new Date().getTime();
                if (now > parseInt(expires)) {
                    Logout();
                    window.location.href = "/login";
                }
            }
            run();
        }, 1000);
        return () => {
            clearInterval(run);
        };
    }, []);

    return (
        <Template>
            <Component {...pageProps} />
        </Template>
    );
}
