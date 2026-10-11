"use client";

import { AlertCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PricingSection from "@/components/PricingSection";

export default function UpgradeModal({ open, onOpenChange, reason }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[70vw] max-h-[90vh] border-amber-200/10 overflow-y-scroll">
        <DialogHeader>
          <div className="flex items-start gap-2 mb-2">
            <AlertCircle className="text-amber-400 mt-1 ml-2" />
            <div>
              <DialogTitle className="text-2xl font-serif">
                Upgrade your plan
              </DialogTitle>

              {reason && (
                <DialogDescription className="text-amber-400 mt-1">
                  {reason}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="px-2 pb-6">
          <PricingSection />
        </div>
      </DialogContent>
    </Dialog>
  );
}
