import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication | Buddy Script",
  description: "Login or register to access your social feed",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-screen w-full">{children}</div>;
}
