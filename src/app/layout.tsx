import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Provider } from "@/components/shared/provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "LinkedFolio - Professional Portfolio Builder",
    template: "%s | LinkedFolio",
  },
  description:
    "Create and share your professional portfolio from LinkedIn or resume PDF in minutes. AI-powered portfolio builder with beautiful templates.",
  keywords: [
    "portfolio",
    "resume",
    "linkedin",
    "professional",
    "AI",
    "profile builder",
    "career",
  ],
  authors: [{ name: "Pawan Tamada" }],
  creator: "Pawan Tamada",
  publisher: "LinkedFolio",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://linkedfolio.vercel.app",
    title: "LinkedFolio - Professional Portfolio Builder",
    description:
      "Create and share your professional portfolio from LinkedIn or resume PDF in minutes. AI-powered portfolio builder with beautiful templates.",
    siteName: "LinkedFolio",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "LinkedFolio - Professional Portfolio Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkedFolio - Professional Portfolio Builder",
    description:
      "Create and share your professional portfolio from LinkedIn or resume PDF in minutes. AI-powered portfolio builder with beautiful templates.",
    images: ["/images/logo.png"],
    creator: "@pawan67",
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://linkedfolio.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable}   ${spaceGrotesk.variable}  font-space-grotesk   antialiased bg-bg dark:bg-secondaryBlack bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]`}
        >
          <Provider>{children}</Provider>
        </body>
        <Analytics />
      </html>
    </SessionProvider>
  );
}
