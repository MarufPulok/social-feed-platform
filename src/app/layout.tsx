import { Providers } from "@/components/providers";
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Buddy Script",
  description: "Social feed platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
        <Script
          src="/assets/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
        {/* Temporarily disabled custom.js - consider converting to React components */}
        {/* <Script src="/assets/js/custom.js" strategy="afterInteractive" /> */}
      </body>
    </html>
  );
}
