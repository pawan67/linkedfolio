import { Icon } from "@iconify/react";
import Link from "next/link";
const Logo = () => {
  return (
    <Link href="/" className="flex   items-center gap-2">
      <Icon
        icon="hugeicons:ai-content-generator-01"
        width="32"
        height="32"
        className="text-primary"
      />{" "}
      <p className=" font-bold  tracking-tight">LinkedFolio </p>
    </Link>
  );
};

export default Logo;
