import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LinkedIn to Website in 1 Click",
  description:
    "Transform your LinkedIn profile into a beautiful professional website in just one click. AI-powered portfolio builder with stunning templates.",
  keywords: [
    "linkedin to website",
    "portfolio builder",
    "professional website",
    "resume to website",
    "AI portfolio",
  ],
  openGraph: {
    title: "LinkedIn to Website in 1 Click",
    description:
      "Transform your LinkedIn profile into a beautiful professional website in just one click. AI-powered portfolio builder with stunning templates.",
  },
  twitter: {
    title: "LinkedIn to Website in 1 Click",
    description:
      "Transform your LinkedIn profile into a beautiful professional website in just one click. AI-powered portfolio builder with stunning templates.",
  },
};

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <div className="  ">{children}</div>
      <Footer />
    </>
  );
};

export default MarketingLayout;
