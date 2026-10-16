import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CommitDesk — Chat-First Work Commitment Tracker",
  description: "Extract actionable tasks from meeting notes and manage them on a live Kanban board.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}
