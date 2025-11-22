import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feed | Buddy Script",
  description: "Your social feed",
};

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-screen w-full">{children}</div>;
}

