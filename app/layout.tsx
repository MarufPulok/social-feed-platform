import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import "../styles/assets/css/bootstrap.min.css";
import "../styles/assets/css/common.css";
import "../styles/assets/css/main.css";
import "../styles/assets/css/responsive.css";
import ContextProvider from "@/providers/ContextProvider";

const poppins = Poppins({
  weight: ["100", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Buddy Script - Social Feed Platform",
  description: "Social Feed Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <ContextProvider>{children}</ContextProvider>
      </body>
    </html>
  );
}
