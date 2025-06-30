import { Card } from "@/components/ui/card";
import Link from "next/link";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" max-w-3xl mb-5  mx-auto">
      {children}
      <Card className=" mt-5 p-5">
        <div>
          <p>
            Built with{" "}
            <Link
              className=" text-primary  underline font-semibold"
              target="_blank"
              rel="noopener noreferrer"
              href="https://linkedfolio.vercel.app"
            >
              LinkedFolio
            </Link>
          </p>
          {/* <p className=" text-sm text-muted-foreground">
            One click portfolio builder for your LinkedIn profile and Resume.
          </p> */}
        </div>
      </Card>
    </div>
  );
};

export default ProfileLayout;
