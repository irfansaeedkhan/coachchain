import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { preload } from "react-dom";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "optional",
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://coachchain.io"),
  title: "CoachChain | Personal Coaching and Immersive Learning",
  description:
    "Personal coaching that combines Montessori principles, AI feedback, and immersive learning to help people build practical skills and lasting confidence.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CoachChain | Personal Coaching and Immersive Learning",
    description:
      "Practical coaching built around your goals, pace, and way of learning.",
    url: "/",
    siteName: "CoachChain",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  preload("/images/hero-bg.webp", { as: "image", fetchPriority: "high" });

  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${montserrat.className} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
