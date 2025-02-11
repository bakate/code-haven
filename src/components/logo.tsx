import { Link } from "@heroui/react";
import Image from "next/image";

export const Logo = () => {
  return (
    <Link color="foreground" href="/" isBlock className="w-auto h-16">
      <Image height={50} width={60} alt="logo" src="/logo.svg" />
      <p className="font-bold text-inherit text-[#007DFC] ml-2">Code Haven</p>
    </Link>
  );
};
