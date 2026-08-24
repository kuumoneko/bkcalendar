import { Analytics } from "@vercel/analytics/next";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    const theme_script =
        "(function(){try{var t=localStorage.getItem('theme');" +
        "if(t!=='light'&&t!=='dark'){t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}" +
        "document.documentElement.classList.add(t);}catch(e){}})();";

    return (
        <Html lang="en" className="">
            <Head>
                <script
                    dangerouslySetInnerHTML={{ __html: theme_script }}
                />
            </Head>
            <body className="antialiased">
                <Main />
                <NextScript />
                <Analytics />
            </body>
        </Html>
    );
}
