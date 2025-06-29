import Header from "@/components/shared/header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Manage your professional portfolio. Upload, edit, and preview your profile.",
  robots: {
    index: false,
    follow: false,
  },
};

const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" mb-10">
      <Header />
      {children}
    </div>
  );
};

export default PrivateLayout;
