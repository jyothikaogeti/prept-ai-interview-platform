"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  formatLongDate,
  formatTime,
  generateDates,
  generateSlots,
  formatDateTabLabel,
} from "@/lib/helpers";
import { useFetch } from "@/hooks/useFetch";
import { bookInterviewerSlot } from "@/actions/booking";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GrayTitle } from "@/components/Reusables";
import UpgradeModal from "@/components/UpgradeModal";

const SLOT_DURATION_MINUTES = 45;
const DAYS_AHEAD = 7;

export default function SlotPicker({
  interviewer,
  interviewerCredits,
  userCredits,
}) {
  const router = useRouter();

  const dates = useMemo(() => generateDates(DAYS_AHEAD), []);

  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);

  const summaryRef = useRef(null);

  const {
    data,
    isLoading,
    error,
    execute: bookSlot,
  } = useFetch(bookInterviewerSlot);

  const availability = interviewer.availabilities?.[0];
  const canAfford = userCredits >= interviewerCredits;

  const slots = useMemo(() => {
    if (!availability) return [];
    return generateSlots(
      selectedDate,
      availability.startTime,
      availability.endTime,
      interviewer.bookingsAsInterviewer ?? [],
      SLOT_DURATION_MINUTES,
    );
  }, [selectedDate, availability, interviewer.bookingsAsInterviewer]);

  useEffect(() => {
    if (selectedSlot && summaryRef.current) {
      summaryRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedSlot]);

  useEffect(() => {
    if (data?.success && data.streamCallId) {
      router.push("/appointments");
    }
  }, [data, router]);

  function handleDateChange(date) {
    setSelectedDate(date);
    setSelectedSlot(null);
  }

  function handleSlotClick(slot) {
    if (!slot.available) return;
    if (!canAfford) {
      setOpenUpgradeModal(true);
      return;
    }
    setSelectedSlot((prev) =>
      prev?.startTime.getTime() === slot.startTime.getTime() ? null : slot,
    );
  }

  function handleSlotConfirm() {
    if (!selectedSlot) return;

    bookSlot({
      interviewerId: interviewer.id,
      startTime: selectedSlot.startTime.toISOString(),
      endTime: selectedSlot.endTime.toISOString(),
    });
  }

  if (!availability) {
    return (
      <div className="bg-[#0f0f11] text-center border border-white/10 flex flex-col items-center gap-2 rounded-2xl p-8">
        <span className="text-2xl">🕐</span>
        <p className="text-stone-500 text-sm">No availability set yet.</p>
        <p className="text-stone-700 text-xs">Check back later.</p>
      </div>
    );
  }

  return (
    <>
      <UpgradeModal
        open={openUpgradeModal}
        onOpenChange={setOpenUpgradeModal}
        reason={`You need ${interviewerCredits} ${interviewerCredits === 1 ? "credit" : "credits"} to book this session. Your current balance is ${userCredits} credits.`}
      />

      <div className="flex flex-col gap-4">
        <div className="bg-[#0f0f11] border border-white/10 flex flex-col gap-6 rounded-2xl p-7">
          <div className="flex justify-between items-start gap-3">
            <div>
              <h2 className="text-xl font-serif tracking-tight">
                <GrayTitle>Book a session</GrayTitle>
              </h2>
              <p className="text-stone-500 text-xs font-light mt-1">
                Select a date and available time slot.
              </p>
            </div>

            <div className="text-right shrink-0">
              <p className="text-stone-600 text-xs">Cost</p>
              <p className="bg-linear-to-br from-amber-300 to-amber-500 bg-clip-text text-transparent text-2xl font-serif leading-none">
                {interviewerCredits}
                <span className="text-stone-500 text-xs font-sans ml-1">
                  cr
                </span>
              </p>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-none px-1 pb-0.5 -mx-1">
            {dates.map((date) => {
              const label = formatDateTabLabel(date);
              const activeDate =
                date.toDateString() === selectedDate.toDateString();

              return (
                <button
                  key={date.toDateString()}
                  type="button"
                  className={`text-xs flex flex-col items-center border rounded-xl transition-all duration-200 shrink-0 px-3.5 py-2.5 ${
                    activeDate
                      ? "bg-amber-400/10 text-amber-400 border-amber-400/40"
                      : "text-stone-500 border-white/10 hover:text-stone-400 hover:border-white/20"
                  }`}
                  onClick={() => handleDateChange(date)}
                >
                  <span className="font-medium">{label.top}</span>
                  <span
                    className={`mt-0.5 ${
                      activeDate ? "text-amber-500/70" : "text-stone-700"
                    }`}
                  >
                    {label.bottom}
                  </span>
                </button>
              );
            })}
          </div>

          <Separator />

          {slots.length === 0 ? (
            <p className="text-stone-600 text-xs text-center py-4">
              No slots in the availability window for this date.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {slots.map((slot) => {
                const isSelected =
                  selectedSlot?.startTime.getTime() ===
                  slot.startTime.getTime();

                return (
                  <button
                    key={slot.startTime.toISOString()}
                    type="button"
                    className={`relative text-xs border rounded-xl transition-all duration-200 px-2 py-2.5 ${
                      isSelected
                        ? "bg-amber-400/15 text-amber-300 border-amber-400/60 shadow-[0_0_12px_rgba(251,191,36,0.08)]"
                        : slot.isBooked
                          ? "bg-white/2 text-stone-700 border-white/5 cursor-not-allowed"
                          : "text-stone-400 border-white/10 hover:bg-amber-400/5 hover:text-amber-400 hover:border-amber-400/30 cursor-pointer"
                    }`}
                    onClick={() => handleSlotClick(slot)}
                    disabled={slot.isBooked}
                  >
                    {formatTime(slot.startTime)}
                    {slot.isBooked && (
                      <span
                        className="absolute bottom-0.5 inset-x-0 text-stone-700 text-center leading-none"
                        style={{ fontSize: "9px" }}
                      >
                        booked
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {selectedSlot && (
          <div
            ref={summaryRef}
            className="bg-[#0f0f11] border border-amber-400/20 rounded-2xl flex flex-col gap-4 p-6"
          >
            <p className="text-stone-500 text-xs font-semibold uppercase tracking-widest">
              Your booking
            </p>

            <div className="flex flex-col gap-2">
              <div className="text-xs flex justify-between">
                <span className="text-stone-500">Date</span>
                <span className="text-stone-300">
                  {formatLongDate(selectedSlot.startTime)}
                </span>
              </div>

              <div className="text-xs flex justify-between">
                <span className="text-stone-500">Time</span>
                <span className="text-stone-300">
                  {formatTime(selectedSlot.startTime)} -
                  {formatTime(selectedSlot.endTime)}
                </span>
              </div>

              <div className="text-xs flex justify-between">
                <span className="text-stone-500">Duration</span>
                <span className="text-stone-300">
                  {SLOT_DURATION_MINUTES} minutes
                </span>
              </div>
            </div>

            <Separator className="bg-white/8" />

            <div className="flex justify-between items-center">
              <span className="text-stone-400 text-xs">Credits charged</span>
              <span className="bg-linear-to-br from-amber-300 to-amber-500 bg-clip-text text-transparent text-lg font-serif leading-none">
                -{interviewerCredits}
              </span>
            </div>

            <div className="text-xs flex justify-between">
              <span className="text-stone-600">Balance after</span>
              <span className="text-stone-500">
                {userCredits - interviewerCredits} credits
              </span>
            </div>

            <div className="bg-white/2 border border-white/8 rounded-xl flex items-start gap-2.5 px-3.5 py-3">
              <span className="text-sm shrink-0">🎥</span>
              <p className="text-stone-500 text-xs font-light leading-relaxed">
                A video call room will be created and you&apos;ll be redirected
                immediately after confirming.
              </p>
            </div>

            {error && (
              <p className="text-red-400 text-xs">{error?.message || error}</p>
            )}

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => setSelectedSlot(null)}
                disabled={isLoading}
              >
                Change slot
              </Button>

              <Button
                size="sm"
                variant="primary"
                className="flex-1"
                onClick={handleSlotConfirm}
                disabled={isLoading}
              >
                {isLoading ? "Creating call..." : "Confirm →"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
