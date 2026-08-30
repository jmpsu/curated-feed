import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Joey's Curated Stream",
  description: "A personal, continuously tuned stream of media, ideas, and signals.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
