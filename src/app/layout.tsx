import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vision Pro UI Demo",
  description: "A Vision Pro-style upload UI component demo",
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