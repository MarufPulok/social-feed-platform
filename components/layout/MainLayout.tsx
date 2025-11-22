import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return <div className="_layout _layout_main_wrapper">{children}</div>;
}

