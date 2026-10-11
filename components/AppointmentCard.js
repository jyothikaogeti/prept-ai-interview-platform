"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Calendar, Clock, Lock, Sparkles, Video } from "lucide-react";
import Link from "next/link";

import { RATING_LABEL, RATING_STYLES, STATUS_STYLES } from "@/lib/data";
import { calculateDuration, formatShortDate, formatTime } from "@/lib/helpers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import FeedbackModal from "./FeedbackModal";
import UpgradeModal from "./UpgradeModal";

export function AppointmentCard({ booking, mode, isPast = false }) {
  const { has } = useAuth();

  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("");

  const {
    startTime,
    endTime,
    status,
    creditsCharged,
    streamCallId,
    recordingUrl,
    feedback,
  } = booking;
  const user =
    mode === "interviewer" ? booking.interviewee : booking.interviewer;

  const isUpcoming = status === "SCHEDULED";

  const isCompleted = status === "COMPLETED";
  const isStarterOrPro = has?.({ plan: "starter" }) || has?.({ plan: "pro" });

  const showUpgradeModal = (reason) => {
    setUpgradeReason(reason);
    setOpenUpgradeModal(true);
  };

  return (
    <>
      <FeedbackModal
        open={openFeedbackModal}
        onOpenChange={setOpenFeedbackModal}
        feedback={feedback}
        intervieweeName={
          mode === "interviewer" ? booking.interviewee?.name : undefined
        }
      />

      <UpgradeModal
        open={openUpgradeModal}
        onOpenChange={setOpenUpgradeModal}
        reason={upgradeReason}
      />

      <article className="group relative bg-linear-to-t from-transparent via-transparent to-amber-300/10 bg-[#0f0f11] border border-white/10 rounded-2xl flex flex-col self-start gap-6 transition-all duration-300 p-7 hover:-translate-y-0.5">
        <div className="flex justify-between items-start gap-4">
          <div className="min-w-0 flex items-center gap-4">
            <Avatar className="w-14 h-14 border border-white/10 rounded-2xl shrink-0">
              <AvatarImage
                src={user?.imageUrl}
                alt={user?.name}
                className="rounded-2xl"
              />
              <AvatarFallback className="bg-amber-400/10 text-amber-400 text-lg font-medium border border-amber-400/20 rounded-2xl">
                {user?.name?.[0] ?? "?"}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex flex-col gap-1">
              <p className="text-stone-200 text-base font-medium truncate leading-tight">
                {user?.name ?? "-"}
              </p>

              {user?.title && user?.company ? (
                <p className="text-stone-500 text-xs truncate">
                  {user.title}
                  <span className="text-stone-700 mx-1.5">·</span>
                  {user.company}
                </p>
              ) : (
                <p className="text-stone-600 text-xs truncate">{user?.email}</p>
              )}

              {mode === "interviewee" && user?.categories?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {user.categories.slice(0, 3).map((category) => (
                    <span
                      key={category}
                      className="bg-amber-400/5 text-amber-400 text-[10px] border border-amber-400/20 rounded-md leading-tight px-2 py-0.5"
                    >
                      {category.replace("_", " ")}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <Badge variant="outline" className={STATUS_STYLES[status]}>
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </Badge>

            <Badge
              variant="outline"
              className={
                mode === "interviewer"
                  ? "bg-green-500/10 text-green-400 border-green-500/20"
                  : "bg-amber-400/5 text-amber-400 border-amber-400/20"
              }
            >
              {mode === "interviewer"
                ? `+${creditsCharged} credits earned`
                : `-${creditsCharged} credits`}
            </Badge>
          </div>
        </div>

        <Separator className="bg-white/5 h-px" />

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="text-stone-600 flex items-center gap-1.5">
              <Calendar size={12} />
              <span className="text-[10px] font-semibold uppercase tracking-widest">
                Date
              </span>
            </div>
            <p className="text-stone-300 text-sm">
              {formatShortDate(startTime)}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="text-stone-600 flex items-center gap-1.5">
              <Clock size={12} />
              <span className="text-[10px] font-semibold uppercase tracking-widest">
                Time
              </span>
            </div>
            <p className="text-stone-300 text-sm">
              {formatTime(startTime)}
              <span className="text-stone-600 mx-1">-</span>
              {formatTime(endTime)}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="text-stone-600 flex items-center gap-1.5">
              <Video size={12} />
              <span className="text-[10px] font-semibold uppercase tracking-widest">
                Duration
              </span>
            </div>
            <p className="text-stone-300 text-sm">
              {calculateDuration(startTime, endTime)}
            </p>
          </div>
        </div>

        {feedback?.summary && (
          <div className="bg-[#141417] border border-white/8 rounded-xl flex flex-col gap-1.5 px-4 py-3">
            <p className="text-stone-600 text-[10px] font-semibold uppercase tracking-widest">
              AI feedback
            </p>
            <p className="text-stone-400 text-xs font-light leading-relaxed line-clamp-2">
              {feedback.summary}
            </p>
          </div>
        )}

        {(streamCallId || (isCompleted && (recordingurl || feedback))) && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {!isPast && streamCallId && isUpcoming && (
              <Button size="sm" variant="primary" className="gap-2" asChild>
                <Link
                  href={`/call/${streamCallId}`}
                  className="flex flex-wrap items-center gap-2"
                >
                  <Video size={13} />
                  Join call
                </Link>
              </Button>
            )}

            {isCompleted &&
              recordingUrl &&
              (isStarterOrPro ? (
                <Button size="sm" variant="outline" className="gap-2" asChild>
                  <a
                    href={recordingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📹 Recording
                  </a>
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 opacity-60"
                  onClick={() =>
                    showUpgradeModal(
                      "Interview recordings are available only for Starter and Pro users.",
                    )
                  }
                >
                  <Lock size={123} />
                  Recording
                </Button>
              ))}

            {isCompleted &&
              feedback &&
              (isStarterOrPro ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-amber-400 border-amber-400/20 gap-1.5 hover:bg-amber-400/10 hover:border-amber-400/40"
                    onClick={() => setOpenFeedbackModal(true)}
                  >
                    <Sparkles size={12} />
                    Full feedback
                  </Button>

                  <Badge
                    variant="outline"
                    className={RATING_STYLES[feedback.overallRating]}
                  >
                    ✦ {RATING_LABEL[feedback.overallRating]} performance
                  </Badge>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 opacity-60"
                  onClick={() =>
                    showUpgradeModal(
                      "AI interview feedback is available only for Starter and Pro users.",
                    )
                  }
                >
                  <Lock size={123} />
                  Full feedback
                </Button>
              ))}
          </div>
        )}
      </article>
    </>
  );
}
