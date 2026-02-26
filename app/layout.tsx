import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Steganography Algorithm Leaderboard",
  description:
    "Minimal white-mode leaderboard for ranking steganography algorithms by PSNR, BER, payload, and runtime"
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
