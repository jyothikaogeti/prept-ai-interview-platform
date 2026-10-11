import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { CATEGORY_LABEL, EXPECT_ITEMS } from "@/lib/data";
import { getCurrentUser } from "@/actions/user";
import { getInterviewerProfile } from "@/actions/booking";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarsBackgroundDemo } from "@/components/StarsBackground";
import { GrayTitle, SectionLabel } from "@/components/Reusables";
import SlotPicker from "./_components/SlotPicker";

export default async function InterviewerProfilePage({ params }) {
  const { id } = await params;

  const dbUser = await getCurrentUser();
  if (!dbUser) redirect("/");
  if (dbUser.role === "UNASSIGNED") redirect("/onboarding");

  const interviewer = await getInterviewerProfile(id);
  if (!interviewer) notFound();

  return (
    <main className="min-h-screen bg-black">
      <section className="relative border-b border-white/8 overflow-hidden">
        <StarsBackgroundDemo />

        <div className="relative max-w-6xl mx-auto flex flex-col gap-8 px-8 pt-20 pb-14">
          <Link href="/explore">
            <Button variant="link" className="text-stone-500 cursor-pointer">
              <ArrowLeft size={13} />
              Back to explore
            </Button>
          </Link>

          <div className="flex items-start gap-8">
            <Avatar className="w-24 h-24 border-2 border-white/10 rounded-2xl shrink-0">
              <AvatarImage
                src={interviewer.imageUrl}
                alt={interviewer.name}
                className="rounded-2xl"
              />
              <AvatarFallback className="bg-amber-400/10 text-amber-400 text-3xl font-medium border border-amber-400/20 rounded-2xl">
                {interviewer.name?.[0] ?? "?"}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex flex-col gap-3 pt-1">
              <h1 className="font-serif text-[clamp(2rem,4vw,3rem)] tracking-tight leading-[1.05]">
                <GrayTitle>{interviewer.name}</GrayTitle>
              </h1>

              {interviewer.title && interviewer.company && (
                <p className="text-stone-400 text-base font-light">
                  {interviewer.title}
                  <span className="text-stone-700 mx-2">·</span>
                  {interviewer.company}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 mt-1">
                {interviewer.yearsExp && (
                  <Badge
                    variant="outline"
                    className="text-stone-400 text-xs border-white/10 px-3 py-1"
                  >
                    {interviewer.yearsExp}+ yrs experience
                  </Badge>
                )}

                <Badge
                  variant="outline"
                  className="bg-amber-400/8 text-amber-400 text-xs border-amber-400/25 px-3 py-1"
                >
                  {interviewer.creditRate ?? 1} credits /session
                </Badge>

                {interviewer.availabilities?.[0] && (
                  <Badge
                    variant="outline"
                    className="bg-green-500/8 text-green-400 text-xs border-green-500/20 px-3 py-1"
                  >
                    🟢 Available
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10 items-start px-8 py-12">
        <div className="lg:col-span-3 flex flex-col gap-6 order-2 lg:-order-1">
          {interviewer.bio && (
            <div className="bg-[#0f0f11] border border-white/10 flex flex-col gap-5 rounded-2xl p-8">
              <SectionLabel>About</SectionLabel>
              <p className="text-stone-300 text-base font-light leading-relaxed">
                {interviewer.bio}
              </p>
            </div>
          )}

          {interviewer.categories?.length > 0 && (
            <div className="bg-[#0f0f11] border border-white/10 flex flex-col gap-5 rounded-2xl p-8">
              <div>
                <SectionLabel>Specialities</SectionLabel>
                <p className="text-stone-500 text-sm font-light mt-1">
                  Interview categories this expert covers.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {interviewer.categories.map((category) => (
                  <span
                    key={category}
                    className="bg-amber-400/5 text-amber-400 text-sm border border-amber-400/20 rounded-xl px-4 py-2"
                  >
                    {CATEGORY_LABEL[category] ?? category}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-[#0f0f11] border border-white/10 flex flex-col gap-6 rounded-2xl p-8">
            <div>
              <SectionLabel>What to expect</SectionLabel>
              <p className="text-stone-500 text-sm font-light mt-1">
                Every session on Prept includes the following.
              </p>
            </div>

            <ul className="flex flex-col gap-5">
              {EXPECT_ITEMS.map(([icon, title, description]) => (
                <li key={title} className="flex items-start gap-4">
                  <span className="w-10 h-10 bg-amber-400/10 text-lg border border-amber-400/20 rounded-xl flex justify-center items-center shrink-0 mt-0.5">
                    {icon}
                  </span>

                  <div className="flex flex-col gap-0.5">
                    <p className="text-stone-200 text-sm font-medium">
                      {title}
                    </p>
                    <p className="text-stone-500 text-xs font-light leading-relaxed">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2 lg:sticky top-24">
          <SlotPicker
            interviewer={interviewer}
            interviewerCredits={interviewer.creditRate ?? 1}
            userCredits={dbUser.credits}
          />
        </div>
      </div>
    </main>
  );
}
