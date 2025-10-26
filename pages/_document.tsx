import { Analytics } from "@vercel/analytics/next";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en" className="">
            <Head />
            <body className="antialiased">
                <Main />
                <NextScript />
                <Analytics />
            </body>
        </Html>
    );
}
