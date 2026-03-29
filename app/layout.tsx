import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "ET Newsroom — Personalized Business Intelligence",
  description: "The Economic Times reimagined with AI-powered personalization, interactive briefings, and intelligent storytelling.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="noise">
      <body className="min-h-screen masthead-grid">
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
