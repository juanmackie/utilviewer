import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: ".util File Viewer",
  description: "A lightweight .util file viewer with drag and drop support",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
