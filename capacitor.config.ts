import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Store-ready native shells (Capacitor) load your **deployed** Next.js app in a WebView.
 *
 * Prerequisites when you are ready to ship:
 * - Set `CAPACITOR_SERVER_URL` to production origin (e.g. https://example.com), then `npm run cap:sync`.
 * - `npx cap add ios` / `npx cap add android` once per machine (Xcode / Android Studio required).
 *
 * This repo stays a normal Next app; native projects live in `./ios` and `./android` after `cap add`.
 */
const serverUrl = process.env.CAPACITOR_SERVER_URL?.trim();

const config: CapacitorConfig = {
  appId: "com.txspark.organizer",
  appName: "TX Spark",
  webDir: "public/capacitor-www",
  ...(serverUrl
    ? {
        server: {
          url: serverUrl,
          cleartext: serverUrl.startsWith("http:"),
        },
      }
    : {}),
};

export default config;
