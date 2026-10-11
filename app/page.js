import { Bot, Wallet } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { AI_TAGS, AVATARS, LOGOS, ROLES, SLOTS } from "@/lib/data";
import { getUser } from "@/lib/getUser";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarsBackgroundDemo } from "@/components/StarsBackground";
import { CodeAnimationDemo } from "@/components/CodeAnimation";
import {
  GoldTitle,
  GrayTitle,
  SectionHeading,
  SectionLabel,
} from "@/components/Reusables";
import BentoCard from "@/components/BentoCard";
import MockInterface from "@/components/MockInterface";
import PricingSection from "@/components/PricingSection";

export default async function Home() {
  const user = await getUser();

  return (
    <div className="bg-black overflow-x-hidden">
      <section className="relative min-h-screen grid grid-cols-1 lg:grid-cols-5 overflow-hidden px-4 sm:px-8 pt-28 sm:pt-32 pb-20">
        <StarsBackgroundDemo />

        <div className="col-span-full lg:col-span-3 text-center flex flex-col justify-center items-center lg:-rotate-2">
          <Badge variant="primary">Powered by AI - Now in Beta</Badge>

          <h1 className="relative max-w-4xl text-5xl sm:text-6xl lg:text-7xl font-serif tracking-tighter">
            <GrayTitle>Ace your next interview</GrayTitle>
            <br />
            <GoldTitle>with real experts</GoldTitle>
          </h1>

          <p className="relative max-w-xl text-stone-400 text-sm sm:text-base md:text-lg leading-relaxed mt-6">
            Book 1:1 mock interviews with senior engineers from top companies.
            Get AI-powered feedback, role-specific questions, and the confidence
            to land your dream job.
          </p>

          <div className="relative flex justify-center gap-2 sm:gap-4 mt-10 sm:w-auto">
            {!user ? (
              <>
                <Link href="/onboarding">
                  <Button size="xl" variant="primary">
                    Get Started
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button size="xl" variant="outline">
                    Browse Interviewers →
                  </Button>
                </Link>
              </>
            ) : user.role === "INTERVIEWER" ? (
              <>
                <Link href="/dashboard">
                  <Button size="xl" variant="primary">
                    Go to Dashboard →
                  </Button>
                </Link>

                <Link href="/explore">
                  <Button size="xl" variant="outline">
                    Browse Interviewers →
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/explore">
                  <Button size="xl" variant="primary">
                    Find an Interviewer →
                  </Button>
                </Link>

                <Link href="/appointments">
                  <Button size="xl" variant="outline">
                    My Appointments
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="relative flex justify-center items-center gap-3 sm:gap-4 mt-8 sm:mt-16">
            <div className="flex">
              {AVATARS.map((avatar, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 border-2 border-[#0a0a0b] rounded-full overflow-hidden ${i > 0 ? "-ml-2" : ""}`}
                >
                  <Image
                    src={avatar.src}
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            <p className="text-stone-500 text-sm text-center sm:text-left">
              <strong className="text-stone-400 font-medium mr-1">
                2,400+ engineers
              </strong>
              cracked FAANG interviews via Prept
            </p>
          </div>
        </div>

        <div className="col-span-full lg:col-span-2 flex justify-center items-center lg:justify-start mt-12 lg:mt-0 lg:rotate-3">
          <CodeAnimationDemo duration={30000} writing />
        </div>
      </section>

      <section className="relative border-y border-white/10 overflow-hidden z-10 py-10">
        <p className="text-stone-600 text-xs text-center font-medium uppercase tracking-widest mb-8">
          Interviewees landed roles at
        </p>

        <div className="relative group overflow-hidden">
          <div className="w-max flex items-center gap-24 animate-marquee group-hover:[animation-play-state:paused]">
            <div className="flex items-center gap-24 shrink-0">
              {LOGOS.map((logo) => (
                <Image
                  key={`logo-first-${logo.alt}`}
                  src={logo.src}
                  alt={logo.alt}
                  width={100}
                  height={50}
                  className="w-auto h-14 transition-all opacity-60 duration-300 hover:grayscale-0 hover:opacity-100"
                />
              ))}
            </div>

            <div
              className="flex items-center gap-24 shrink-0"
              aria-hidden="true"
            >
              {LOGOS.map((logo) => (
                <Image
                  key={`logo-second-${logo.alt}`}
                  src={logo.src}
                  alt={logo.alt}
                  width={100}
                  height={50}
                  className="w-auto h-14 transition-all opacity-60 duration-300 hover:grayscale-0 hover:opacity-100"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative max-w-5xl mx-auto z-10 px-6 py-28">
        <div className="text-center mb-16">
          <SectionLabel>Features</SectionLabel>
          <SectionHeading
            grayText="Everything you need,"
            goldText="nothing you don't"
          />
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-7">
            <BentoCard
              icon={<Bot size={20} className="text-amber-400" />}
              title={<GrayTitle>AI Question Generator</GrayTitle>}
              description="Interviewers get a live AI co-polit generating role-specific questions on demand - system design, behavioural, DSA - all tailored to the candidate's level."
            >
              <div className="flex flex-wrap gap-2 mt-5">
                {AI_TAGS.map((tag) => (
                  <Badge
                    key={tag.label}
                    variant={tag.active ? "primary" : "outline"}
                  >
                    {tag.label}
                  </Badge>
                ))}
              </div>
            </BentoCard>
          </div>

          <div className="col-span-12 md:col-span-5">
            <BentoCard
              icon={<Wallet size={16} className="text-amber-400" />}
              title={<GrayTitle>Credit System</GrayTitle>}
              description="Subscribe for monthly credits. Book sessions. Interviewers earn and withdraw any time."
            >
              <div className="bg-[#141417] border border-white/10 flex justify-between items-end rounded-xl p-5 mt-5">
                <div>
                  <p className="text-stone-600 text-xs mb-1">Your balance</p>
                  <p className="bg-linear-to-br from-amber-300 to-amber-500 text-transparent bg-clip-text text-4xl font-serif leading-none">
                    28
                  </p>
                  <p className="text-stone-600 text-xs mt-1">
                    credits remaining
                  </p>
                </div>

                <Badge variant="secondary">+10 this month</Badge>
              </div>
            </BentoCard>
          </div>

          <div className="col-span-12 md:col-span-4">
            <BentoCard
              icon="📹"
              title={<GrayTitle>HD Video Calls</GrayTitle>}
              description="Powered by Stream. Screen sharing, recording, and instant playback links — all built in."
            >
              <MockInterface rows={3} />
            </BentoCard>
          </div>

          <div className="col-span-12 md:col-span-4">
            <BentoCard
              icon="💬"
              title={<GrayTitle>Persistent Chat</GrayTitle>}
              description="Message your interviewer before and after the call. Share resources, prep notes, and follow-ups in one thread."
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <BentoCard
              icon="🔒"
              title={<GrayTitle>Security by Arcjet</GrayTitle>}
              description="Bot protection, rate limiting, and abuse prevention baked into every API route."
            />
          </div>

          <div className="col-span-12 md:col-span-6">
            <BentoCard
              icon="📊"
              title={<GrayTitle>AI Feedback Reports</GrayTitle>}
              description="Post-interview analysis by Gemini with actionable insights."
            >
              <MockInterface rows={5} />
            </BentoCard>
          </div>

          <div className="col-span-12 md:col-span-6">
            <BentoCard
              icon="🗓️"
              title={<GoldTitle>Slot-based Scheduling</GoldTitle>}
              description="Interviewers set availability once. Interviewees pick from open slots and confirm with one click — no back-end-forth needed."
            >
              <div className="flex flex-wrap gap-2 mt-5">
                {SLOTS.map((slot) => (
                  <span
                    key={slot.label}
                    className={` text-xs border rounded-lg px-3 py-1.5 ${slot.class}`}
                  >
                    {slot.label}
                  </span>
                ))}
              </div>
            </BentoCard>
          </div>
        </div>
      </section>

      <section className="relative max-w-5xl mx-auto z-10 px-6 pb-28">
        <div className="text-center mb-16">
          <SectionLabel>Who it&apos;s for</SectionLabel>
          <SectionHeading
            grayText="Built for both sides"
            goldText="of the table"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {ROLES.map((role) => (
            <div
              key={role.label}
              className="relative bg-[#0f0f11] border border-white/10 rounded-2xl h-full transition overflow-hidden duration-300 p-12 hover:border-amber-400/20"
            >
              <div className="absolute right-0 bottom-0 w-48 h-48 bg-[radial-gradient(circle,rgba(251,191,36,0.05)_0%,transparent_70%)] rounded-full pointer-events-none" />

              <span className="inline-block bg-amber-400/10 text-amber-400 text-xs font-semibold border border-amber-400/20 rounded-full uppercase tracking-widest px-3 py-1.5 mb-5">
                {role.label}
              </span>

              <h3 className="text-2xl font-serif tracking-tight mb-4">
                {role.title}
              </h3>

              <p className="text-stone-400 text-sm leading-relaxed mb-8">
                {role.description}
              </p>

              <ul className="space-y-3">
                {role.perks.map((perk) => (
                  <li key={perk} className="text-stone-400 text-sm flex gap-3">
                    <span className="min-w-4 h-4 bg-amber-400/10 text-amber-400 text-xs border border-amber-400/20 flex justify-center items-center rounded-full mt-0.5">
                      ✓
                    </span>
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="relative max-w-5xl mx-auto z-10 px-6 pb-28">
        <div className="text-center mb-16">
          <SectionLabel>Pricing</SectionLabel>
          <SectionHeading
            grayText="Simple, transparent"
            goldText="credit-based plans"
          />
          <p className="text-stone-400 text-sm mt-3">
            Each credit = one session. Unused credits roll over.
          </p>
        </div>

        <PricingSection />
      </section>

      <section className="relative max-w-5xl mx-auto z-10 px-6 pb-28">
        <div className="relative bg-linear-to-br from-amber-400/5 text-center border border-amber-400/20 rounded-3xl overflow-hidden px-3 sm:px-16 py-20">
          <StarsBackgroundDemo />

          <h2 className="relative text-4xl md:text-5xl font-serif tracking-tight leading-tight mb-4">
            <GrayTitle>Your next interview</GrayTitle>
            <br />
            <GoldTitle>starts here</GoldTitle>
          </h2>

          <p className="relative text-stone-400 text-sm font-light mb-11">
            Join thousands of engineers already levelling up on prept.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {!user ? (
              <>
                <Link href="/onboarding" className="relative">
                  <Button size="xl" variant="primary">
                    Get Started
                  </Button>
                </Link>
                <Link href="/explore" className="relative">
                  <Button size="xl" variant="outline">
                    Browse Interviewers →
                  </Button>
                </Link>
              </>
            ) : user.role === "INTERVIEWER" ? (
              <>
                <Link href="/dashboard" className="relative">
                  <Button size="xl" variant="primary">
                    Go to Dashboard →
                  </Button>
                </Link>

                <Link href="/explore" className="relative">
                  <Button size="xl" variant="outline">
                    Browse Interviewers →
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/explore" className="relative">
                  <Button size="xl" variant="primary">
                    Find an Interviewer →
                  </Button>
                </Link>

                <Link href="/appointments" className="relative">
                  <Button size="xl" variant="outline">
                    My Appointments
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <footer className="relative border-t border-white/7 flex flex-wrap justify-center items-center mx-auto z-10 px-6 py-12">
        <GrayTitle>
          Made with <span className="text-amber-400">🧡</span> by Jyothika
        </GrayTitle>
      </footer>
    </div>
  );
}
