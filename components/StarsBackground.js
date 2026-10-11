"use client";

import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { StarsBackground } from "@/components/animate-ui/components/backgrounds/stars";

export const StarsBackgroundDemo = () => {
  const { resolvedTheme } = useTheme();

  return (
    <StarsBackground
      starColor={resolvedTheme === "dark" ? "#FFF" : "#000"}
      className={cn(
        "absolute inset-0 flex items-center justify-center rounded-xl",
        "dark:bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)] bg-[radial-gradient(ellipse_at_bottom,_#f5f5f5_0%,_#fff_100%)]",
      )}
    />
  );
};
