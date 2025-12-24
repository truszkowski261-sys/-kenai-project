import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "nextSample",
  description:
    "Built for painting contractors. AI-powered proposals, visual sales pipeline, and project scheduling.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased text-gray-900`}>
        {children}
        {/* A simple footer can be added here */}
      </body>
    </html>
  );
}
