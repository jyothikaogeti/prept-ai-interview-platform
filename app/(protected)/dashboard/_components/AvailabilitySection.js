"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

import { useFetch } from "@/hooks/useFetch";
import { setAvailability } from "@/actions/dashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GrayTitle } from "@/components/Reusables";

export default function AvailabilitySection({ availability }) {
  const [startTime, setStartTime] = useState(
    availability?.startTime
      ? new Date(availability.startTime).toTimeString().slice(0, 5)
      : "",
  );
  const [endTime, setEndTime] = useState(
    availability?.endTime
      ? new Date(availability.endTime).toTimeString().slice(0, 5)
      : "",
  );
  const [saved, setSaved] = useState(false);

  const {
    data,
    isLoading,
    error,
    execute: setAvailabilityOfInterviewer,
  } = useFetch(setAvailability);

  useEffect(() => {
    if (data?.success) {
      setSaved(true);
      const time = setTimeout(() => setSaved(false), 3000);
      return () => clearTimeout(time);
    }
  }, [data]);

  const hasWindow = startTime && endTime;
  const duration = hasWindow
    ? (() => {
        const [sh, sm] = startTime.split(":").map(Number);
        const [eh, em] = endTime.split(":").map(Number);
        const diff = eh * 60 + em - (sh * 60 + sm);
        if (diff <= 0) return null;
        const h = Math.floor(diff / 60);
        const m = diff % 60;
        return h > 0 ? `${h}h ${m > 0 ? `${m}m` : ""}`.trim() : `${m}m`;
      })()
    : null;

  function toISO(time) {
    const [hour, minute] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    return date.toISOString();
  }

  function handleSaveAvailability() {
    if (!startTime || !endTime) return;
    setAvailabilityOfInterviewer({
      startTime: toISO(startTime),
      endTime: toISO(endTime),
    });
  }

  return (
    <section className="bg-[#0f0f11] border border-white/10 rounded-2xl flex flex-col gap-7 p-8">
      <div className="flex justify-between items-start gap-4">
        <div>
          <span className="w-10 h-10 bg-amber-400/10 text-lg border border-amber-400/20 rounded-xl flex justify-center items-center mb-4">
            <Clock size={18} className="text-amber-400" />
          </span>
          <h2 className="text-xl font-serif tracking-tight">
            <GrayTitle>Daily availability window</GrayTitle>
          </h2>
          <p className="text-stone-500 text-xs font-light mt-1">
            Interviewees can book within this window every day.
          </p>
        </div>

        {availability && (
          <Badge
            variant="outline"
            className="bg-green-500/10 text-green-400 border-green-500/20 shrink-0"
          >
            Active
          </Badge>
        )}
      </div>

      <Separator className="bg-white/5 h-px" />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-stone-400 text-xs">Start Time</Label>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="bg-[#141417] text-stone-100 border-white/10"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-stone-400 text-xs">End Time</Label>
          <Input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="bg-[#141417] text-stone-100 border-white/10"
          />
        </div>
      </div>

      {duration && (
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="bg-amber-400/5 text-amber-400 border-amber-400/20"
          >
            {duration} window
          </Badge>

          <span className="text-stone-600 text-xs">
            Interviewees see this as your open booking range
          </span>
        </div>
      )}

      {error && (
        <p className="text-red-400 text-xs">{error?.message || error}</p>
      )}

      <Button
        variant="primary"
        className="self-start"
        onClick={handleSaveAvailability}
        disabled={isLoading || !hasWindow}
      >
        {isLoading
          ? "Saving..."
          : saved
            ? "✓ Saved"
            : availability
              ? "Update window"
              : "Set availability"}
      </Button>
    </section>
  );
}
