import { Providers } from "@/components/providers";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const poppins = Poppins({
  weight: ["100", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

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
      <body className={`${poppins.variable} ${poppins.className}`}>
        <Providers>{children}</Providers>
        <Script
          src="/assets/js/bootstrap.bundle.min.js"
          strategy="lazyOnload"
        />
        <Script src="/assets/js/custom.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
