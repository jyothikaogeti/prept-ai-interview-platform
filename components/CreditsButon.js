"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Coins } from "lucide-react";

import { Button } from "@/components/ui/button";
import UpgradeModal from "@/components/UpgradeModal";

export default function CreditsButton({ role, credits }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  function handleClick() {
    if (role === "INTERVIEWER") {
      router.push("/dashboard");
    } else {
      setIsOpen(true);
    }
  }

  return (
    <>
      <Button
        variant="outline"
        className="text-amber-400 border-amber-400/20 cursor-pointer"
        onClick={handleClick}
      >
        <Coins size={14} />
        <span className="opacity-70">
          {credits}{" "}
          {role === "INTERVIEWER"
            ? "Earned"
            : credits === 1
              ? "credit"
              : "credits"}
        </span>
      </Button>

      <UpgradeModal open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
