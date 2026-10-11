import Link from "next/link";

import { CATEGORY_LABEL } from "@/lib/data";
import { formatTime } from "@/lib/helpers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function InterviewerCard({ interviewer }) {
  const {
    id,
    name,
    imageUrl,
    title,
    bio,
    company,
    yearsExp,
    categories,
    creditRate,
    availabilities,
  } = interviewer;
  const availability = availabilities?.[0];

  return (
    <Card className="relative border border-white/10 hover:border-amber-400/20">
      <div className="absolute inset-0 bg-linear-to-br from-amber-400/5 via-transparent to-transparent pointer-events-none" />

      <CardContent className="flex flex-col gap-5">
        <div className="flex justify-between items-start gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-11 h-11 border border-white/10 shrink-0">
              <AvatarImage src={imageUrl} alt={name} />
              <AvatarFallback className="bg-amber-400/10 text-amber-400 text-sm font-medium border border-amber-400/20">
                {name?.[0] ?? "?"}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="text-stone-200 text-sm font-medium leading-tight">
                {name}
              </p>

              {title && company && (
                <p className="text-stone-500 text-xs mt-0.5">
                  {title} · {company}
                </p>
              )}
            </div>
          </div>

          {yearsExp && (
            <Badge
              variant="outline"
              className="text-stone-500 text-xs border-white/10 shrink-0"
            >
              {yearsExp}+ yrs
            </Badge>
          )}
        </div>

        {bio && (
          <p className="text-stone-400 text-xs font-light leading-relaxed line-clamp-2">
            {bio}
          </p>
        )}

        {categories?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {categories.slice(0, 4).map((category) => (
              <span
                key={category}
                className="bg-amber-400/5 text-amber-400 text-xs border border-amber-400/20 rounded-lg px-2.5 py-1"
              >
                {CATEGORY_LABEL[category] ?? category}
              </span>
            ))}

            {categories.length > 4 && (
              <span className="text-stone-600 text-xs border border-white/10 rounded-lg px-2.5 py-1">
                +{categories.length - 4} more
              </span>
            )}
          </div>
        )}

        <Separator />

        <div className="flex justify-between items-center gap-3">
          <div className="flex flex-col gap-1">
            <p className="bg-linear-to-br from-amber-300 to-amber-500 bg-clip-text text-transparent text-lg font-serif leading-none">
              {creditRate ?? 1}
              <span className="text-stone-500 text-xs font-sans ml-1">
                credits / session
              </span>
            </p>

            {availability ? (
              <p className="text-stone-600 text-xs">
                🟢 {formatTime(availability.startTime)} -{" "}
                {formatTime(availability.endTime)}
              </p>
            ) : (
              <p className="text-stone-700 text-xs">No availability set</p>
            )}
          </div>

          <Button
            size="sm"
            variant="outline"
            className="text-amber-400 border-amber-400/20 shrink-0 hover:bg-amber-400/10 hover:border-amber-400/40"
            asChild
          >
            <Link href={`/interviewers/${id}`}>View profile →</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
