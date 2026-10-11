"use client";

import {
  AlertCircle,
  Brain,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { RATING_CONFIG } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StarsBackgroundDemo } from "./StarsBackground";
import { GrayTitle } from "./Reusables";

export default function FeedbackModal({
  open,
  onOpenChange,
  feedback,
  intervieweeName,
}) {
  if (!feedback) return null;

  const rating = RATING_CONFIG[feedback.overallRating];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black text-stone-100 border border-amber-200/20 max-h-[85vh] overflow-y-auto sm:max-w-3xl">
        <StarsBackgroundDemo />

        <DialogHeader className="relative">
          <DialogTitle className="text-2xl font-serif tracking-tight">
            <GrayTitle>AI Feedback Report</GrayTitle>
          </DialogTitle>

          {intervieweeName && (
            <p className="text-stone-500 text-xs font-light mt-1">
              Performance analysis for {intervieweeName}
            </p>
          )}
        </DialogHeader>

        <div className="relative flex flex-col gap-5 mt-2">
          <div
            className={`bg-linear-to-br ${rating.bg} to-transparent ${rating.className} border rounded-2xl flex justify-between items-center p-6`}
          >
            <div>
              <p className="text-[10px] uppercase tracking-widest opacity-60">
                Overall rating
              </p>
              <p className="text-3xl font-serif">{rating.label}</p>
            </div>
            <span className="text-4xl">{rating.emoji}</span>
          </div>

          <div className="bg-[#141417] border border-white/8 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={13} className="text-amber-400" />
              <p className="text-stone-500 text-[10px] uppercase tracking-widest">
                Summary
              </p>
            </div>
            <p className="text-stone-300 text-sm">{feedback.summary}</p>
          </div>

          <div className="bg-[#141417] border border-white/8 rounded-xl p-5">
            <p className="text-stone-500 text-[10px] uppercase tracking-widest mb-2">
              Recommendation
            </p>
            <p className="text-stone-300 text-sm">{feedback.recommendation}</p>
          </div>

          <div className="bg-[#141417] border border-white/8 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Brain size={14} className="text-amber-400" />
              <p className="text-stone-500 text-[10px] uppercase tracking-widest">
                Technical
              </p>
            </div>
            <p className="text-stone-300 text-sm">{feedback.technical}</p>
          </div>

          <div className="bg-[#141417] border border-white/8 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={14} className="text-amber-400" />
              <p className="text-stone-500 text-[10px] uppercase tracking-widest">
                Communication
              </p>
            </div>
            <p className="text-stone-300 text-sm">{feedback.communication}</p>
          </div>

          <div className="bg-[#141417] border border-white/8 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={14} className="text-amber-400" />
              <p className="text-stone-500 text-[10px] uppercase tracking-widest">
                Problem Solving
              </p>
            </div>
            <p className="text-stone-300 text-sm">{feedback.problemSolving}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#141417] border border-white/8 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={13} className="text-gray-400" />
                <p className="text-stone-500 text-[10px] uppercase tracking-widest">
                  Strengths
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {feedback.strengths?.map((strength, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="text-green-400 border-green-500/20 justify-start whitespace-normal"
                  >
                    ✓ {strength}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="bg-[#141417] border border-white/8 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={13} className="text-red-400" />
                <p className="text-stone-500 text-[10px] uppercase tracking-widest">
                  To improve
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {feedback.improvements?.map((improvement, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="text-red-400 border-red-500/20 justify-start whitespace-normal"
                  >
                    ✓ {improvement}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
