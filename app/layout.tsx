import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grammar Worksheet Generator",
  description:
    "Build printable grammar worksheets and matching answer keys for grades 7–12.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
