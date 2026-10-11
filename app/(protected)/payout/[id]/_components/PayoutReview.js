"use client";

import { useEffect, useState } from "react";

import { useFetch } from "@/hooks/useFetch";
import { approvePayout } from "@/actions/payout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GrayTitle } from "@/components/Reusables";

export default function PayoutReview({ payout }) {
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(payout.status === "PROCESSED");

  const { data, isLoading, error, execute: approve } = useFetch(approvePayout);

  useEffect(() => {
    if (data?.success) setDone(true);
  }, [data]);

  if (done) {
    return (
      <div className="bg-[#0f0f11] text-center border border-white/10 rounded-2xl flex flex-col items-center gap-3 p-10">
        <span className="text-3xl">✅</span>
        <p className="text-xl font-serif">
          <GrayTitle>Withdrawl approved</GrayTitle>
        </p>
        <p className="text-stone-500 text-xs font-light">
          {payout.interviewerName} · ${payout.netAmount.toFixed(2)} via{" "}
          {payout.paymentMethod}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#0f0f11] border border-white/10 rounded-2xl flex flex-col gap-5 p-8">
      <div className="bg-[#141417] border border-white/8 rounded-xl flex flex-col gap-2 p-4">
        <div className="flex justify-between text-xs">
          <span className="text-stone-500">Interviewer</span>
          <span className="text-stone-300">{payout.interviewerName}</span>
        </div>

        <div className="flex justify-between text-xs">
          <span className="text-stone-500">Email</span>
          <span className="text-stone-300">{payout.interviewerEmail}</span>
        </div>

        <div className="flex justify-between text-xs">
          <span className="text-stone-500">Credits</span>
          <span className="text-stone-300">{payout.credits}</span>
        </div>

        <div className="flex justify-between text-xs">
          <span className="text-stone-500">Platform fee (20%)</span>
          <span className="text-red-400">
            - ${payout.platformFee.toFixed(2)}
          </span>
        </div>

        <Separator className="bg-white/8 my-1" />

        <div className="flex justify-between text-sm font-medium">
          <span className="text-stone-500">Pay out</span>
          <span className="bg-linear-to-br from-amber-300 to-amber-500 bg-clip-text text-transparent text-lg font-serif leading-none">
            ${payout.netAmount.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-xs pt-1">
          <span className="text-stone-500">Send to</span>
          <span className="text-stone-300">
            {payout.paymentMethod} · {payout.paymentDetail}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-stone-400 text-xs">Admin password</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            password.trim() &&
            approve({ payoutId: payout.id, adminPassword: password })
          }
          placeholder="Enter password..."
          className="bg-[#11417] text-stone-100 border-white/10"
        />
      </div>

      {error && (
        <p className="text-red-400 text-xs">{error?.message || error}</p>
      )}

      <Button
        variant="primary"
        onClick={() =>
          approve({ payoutId: payout.id, adminPassword: password })
        }
        disabled={!password.trim() || isLoading}
      >
        {isLoading
          ? "Approving..."
          : `Approve $${payout.netAmount.toFixed(2)} →`}
      </Button>
    </div>
  );
}
