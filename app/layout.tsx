import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "LLM Leaderboard",
  description: "Minimal white-mode leaderboard for ranking LLM quality, cost, and latency"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
