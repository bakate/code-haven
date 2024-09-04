"use client";

import { cn } from "@/lib/utils";

import { useRouter } from "next/navigation";
import { LuMoveLeft } from "react-icons/lu";

type MoveBackButtonProps = {
  className?: string;
  path?: string;
};
export const MoveBackButton = ({ className, path }: MoveBackButtonProps) => {
  const router = useRouter();

  return (
    <div className={cn("mb-5 hover:cursor-pointer", className)}>
      <LuMoveLeft
        size={24}
        onClick={() => (path ? router.push(path) : router.back())}
      />
    </div>
  );
};
