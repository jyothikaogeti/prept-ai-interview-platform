"use client";

import { useEffect, useState } from "react";
import { CircleCheck, TrendingUp, Wallet } from "lucide-react";

import { PAYMENT_METHODS } from "@/lib/data";
import { useFetch } from "@/hooks/useFetch";
import { formatShortDate } from "@/lib/helpers";
import { requestWithdrawl } from "@/actions/dashboard";
import { GrayTitle } from "@/components/Reusables";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PLATFORM_FEE = 0.2;

export default function EarningsSection({ stats, withdrawlHistory }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("PAYPAL");
  const [paymentDetail, setPaymentDetail] = useState("");

  const {
    data,
    isLoading,
    error,
    execute: withdraw,
  } = useFetch(requestWithdrawl);

  const balance = (stats?.creditBalance ?? 0) * 5;
  const totalEarned = (stats?.totalEarned ?? 0) * 5;
  const feeAmount = (balance * PLATFORM_FEE).toFixed(2);
  const netAmount = (balance * (1 - PLATFORM_FEE)).toFixed(2);
  const selectedMethod = PAYMENT_METHODS.find(
    (method) => method.value === paymentMethod,
  );
  const isValid = paymentDetail.trim().length > 0;

  useEffect(() => {
    if (data?.success) {
      setDone(true);
      setTimeout(() => {
        setOpen(false);
        setTimeout(() => {
          setDone(false);
          setPaymentMethod("PAYPAL");
          setPaymentDetail("");
        }, 300);
      }, 200);
    }
  }, [data]);

  function handleOpenChange(value) {
    if (!value && !isLoading) {
      setOpen(false);
      if (!done) {
        setPaymentMethod("PAYPAL");
        setPaymentDetail("");
      }
    }
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Credit balance",
            value: stats?.creditBalance ?? 0,
            unit: "credits",
            gold: true,
            icon: <Wallet size={16} className="text-amber-400" />,
            dollarValue: balance,
          },
          {
            label: "Total earned",
            value: stats?.totalEarned ?? 0,
            unit: "credits",
            gold: false,
            icon: <TrendingUp size={16} className="text-stone-400" />,
            dollarValue: totalEarned,
          },
          {
            label: "Sessions done",
            value: stats?.completedSessions ?? 0,
            unit: "completed",
            gold: false,
            icon: <CircleCheck size={16} className="text-stone-400" />,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[#0f0f11] border border-white/10 rounded-2xl flex flex-col gap-2 p-6"
          >
            <span className="text-lg">{stat.icon}</span>
            <p
              className={`text-4xl font-serif tracking-tight leading-none ${
                stat.gold
                  ? "bg-linear-to-br from-amber-300 to-amber-500 bg-clip-text text-transparent"
                  : "bg-linear-to-br from-stone-100 to-stone-400 bg-clip-text text-transparent"
              }`}
            >
              {stat.value}
            </p>
            <p className="text-stone-600 text-xs">{stat.unit}</p>
            <p className="text-stone-500 text-xs">
              {stat.label}{" "}
              {stat.dollarValue !== undefined
                ? `$(${stat?.dollarValue?.toFixed(2)})`
                : ""}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-[#0f0f11] border border-white/10 rounded-2xl flex justify-between items-center gap-4 p-8">
        <div>
          <h2 className="text-xl font-serif tracking-tight">
            <GrayTitle>Withdraw earnings</GrayTitle>
          </h2>
          <p className="text-stone-500 text-xs font-light mt-1">
            20% platform fee applies. Processed within 2-3 business days.
          </p>
        </div>

        <Button
          variant="primary"
          className="shrink-0"
          onClick={() => setOpen(true)}
          disabled={balance <= 0}
        >
          Request withdrawl
        </Button>
      </div>

      {withdrawlHistory?.length > 0 && (
        <div className="bg-[#0f0f11] border border-white/10 rounded-2xl flex flex-col gap-5 p-8">
          <p className="text-stone-500 text-xs font-semibold uppercase tracking-widest">
            Withdrawl history
          </p>

          <div className="flex flex-col gap-3">
            {withdrawlHistory.map((history) => (
              <div
                key={history.id}
                className="bg-[#141417] border border-white/8 rounded-xl flex justify-between items-center px-5 py-4"
              >
                <div className="flex flex-col gap-0.5">
                  <p className="text-stone-300 text-sm">
                    {history.credits} → ${history.netAmount.toFixed(2)}
                  </p>
                  <p className="text-stone-600 text-xs">
                    {history.paymentMethod} ·{" "}
                    {formatShortDate(history.createdAt)}
                  </p>
                </div>

                <Badge
                  variant="outline"
                  className={
                    history.status === "PROCESSED"
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }
                >
                  {history.status.charAt(0) +
                    history.status.slice(1).toLowerCase()}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      <Dialog open={open} handleOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md bg-[#0f0f11] text-stone-100 border border-white/10">
          {done ? (
            <div className="flex flex-col items-center gap-4 text-center py-8">
              <span className="w-14 h-14 bg-green-500/10 text-2xl border border-green-500/20 rounded-full flex justify-center items-center">
                ✓
              </span>
              <p className="text-xl font-serif">
                <GrayTitle>Request submitted</GrayTitle>
              </p>
              <p className="text-stone-500 text-xs font-light">
                We&apos;ll process your withdrawl within 2-3 business days.
              </p>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-serif tracking-tight">
                  <GrayTitle>Request withdrawl</GrayTitle>
                </DialogTitle>
                <DialogDescription className="text-stone-500 text-xs font-light">
                  Your full balance of{" "}
                  <span className="text-amber-400">{balance} credits</span> will
                  be withdrawn.
                </DialogDescription>
              </DialogHeader>

              <Separator className="bg-white/5" />

              <div className="flex flex-col gap-5 py-2">
                <div className="bg-[#141417] border border-white/8 rounded-xl flex flex-col gap-2 p-4">
                  <div className="text-stone-500 text-xs flex justify-between">
                    <span>Balance (1 Cr = $5)</span>
                    <span className="text-green-400">{balance}</span>
                  </div>

                  <div className="text-stone-500 text-xs flex justify-between">
                    <span>Platform fee (20%)</span>
                    <span className="text-red-400">${feeAmount}</span>
                  </div>

                  <Separator className="bg-white/8 my-1" />

                  <div className="text-sm font-medium flex justify-between">
                    <span className="text-stone-300">You receive</span>
                    <span className="text-amber-400">${netAmount}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-stone-400 text-xs">
                    Payment Method
                  </Label>

                  <Tabs
                    value={paymentMethod}
                    onValueChange={(value) => {
                      setPaymentMethod(value);
                      setPaymentDetail("");
                    }}
                  >
                    <TabsList className="bg-[#141417] border border-white/10 w-full">
                      {PAYMENT_METHODS.map((method) => (
                        <TabsTrigger
                          key={method.value}
                          value={method.value}
                          className="text-xs flex-1"
                        >
                          {method.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-stone-400 text-xs">
                    {selectedMethod?.label} details
                  </Label>

                  <Input
                    value={paymentDetail}
                    onChange={(e) => setPaymentDetail(e.target.value)}
                    placeholder={selectedMethod?.placeholder}
                    className="bg-[#141417] text-stone-100 border-white/10"
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-xs">
                    {error?.message || error}
                  </p>
                )}
              </div>

              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>

                <Button
                  variant="primary"
                  onClick={() =>
                    withdraw({
                      credits: stats?.creditBalance,
                      paymentMethod,
                      paymentDetail,
                    })
                  }
                  disabled={!isValid || isLoading}
                >
                  {isLoading ? "Submitting..." : "Confirm withdrawl"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
