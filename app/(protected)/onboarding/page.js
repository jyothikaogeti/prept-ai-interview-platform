"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { CATEGORIES, ONBOARDING_ROLES, YEARS_OPTIONS } from "@/lib/data";
import { useFetch } from "@/hooks/useFetch";
import { completeOnboarding } from "@/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GoldTitle, GrayTitle, SectionLabel } from "@/components/Reusables";

export default function OnboardingPage() {
  const router = useRouter();

  const [role, setRole] = useState(null);
  const [form, setForm] = useState({
    title: "",
    bio: "",
    company: "",
    yearsExp: "",
    categories: [],
  });

  const { data, isLoading, execute: onboarding } = useFetch(completeOnboarding);

  useEffect(() => {
    if (data && !isLoading) {
      router.push(role === "INTERVIEWER" ? "/dashboard" : "/explore");
    }
  }, [data, router]);

  const isInterviewerValid =
    form.title.trim() &&
    form.bio.trim() &&
    form.company.trim() &&
    form.yearsExp &&
    form.categories.length > 0;

  const canSubmit =
    role === "INTERVIEWEE" || (role === "INTERVIEWER" && isInterviewerValid);

  function toggleCategory(value) {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(value)
        ? prev.categories.filter((category) => category !== value)
        : [...prev.categories, value],
    }));
  }

  function handleSubmit() {
    if (!canSubmit) return;

    onboarding({
      role,
      ...(role === "INTERVIEWER" && {
        title: form.title,
        bio: form.bio,
        company: form.company,
        yearsExp: Number(form.yearsExp),
        categories: form.categories,
      }),
    });
  }

  return (
    <main className="min-h-screen bg-black flex flex-col items-center px-6 py-24">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <SectionLabel>Welcome</SectionLabel>
          <h1 className="text-5xl font-serif tracking-tighter leading-tight mt-1">
            <GrayTitle>How will you be</GrayTitle>
            <br />
            <GoldTitle>using Prept?</GoldTitle>
          </h1>

          <p className="text-stone-500 text-sm font-light leading-relaxed mt-4">
            This helps us personalise your experience.{" "}
            <span className="text-stone-600">
              You can&apos;t change this later.
            </span>
          </p>
        </div>

        {!role && (
          <div className="grid grid-cols-2 gap-4 w-full">
            {ONBOARDING_ROLES.map((role) => (
              <button
                key={role.value}
                type="button"
                className="bg-[#0f0f11] text-left border border-white/10 rounded-2xl transition-all duration-300 p-8 hover:border-amber-400/20 hover:-translate-y-0.5"
                onClick={() => setRole(role.value)}
              >
                <span className="w-11 h-11 bg-amber-400/10 text-xl border border-amber-400/20 flex justify-center items-center rounded-xl mb-5">
                  {role.icon}
                </span>
                <h3 className="text-stone-100 text-xl font-serif tracking-tight mb-3">
                  {role.title}
                </h3>
                <p className="text-stone-400 text-sm font-light leading-relaxed">
                  {role.description}
                </p>
              </button>
            ))}
          </div>
        )}

        {role && (
          <div className="flex flex-col gap-6">
            <div className="bg-[#0f0f11] border border-white/10 flex justify-between items-center rounded-2xl px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 bg-amber-400/10 text-base border border-amber-400/20 flex justify-center items-center rounded-xl shrink-0">
                  {ONBOARDING_ROLES.find((item) => item.value === role)?.icon}
                </span>

                <div>
                  <p className="text-stone-200 text-sm font-medium">
                    {
                      ONBOARDING_ROLES.find((item) => item.value === role)
                        ?.title
                    }
                  </p>
                  <p className="text-stone-600 text-xs mt-0.5">Selected role</p>
                </div>
              </div>

              <Button size="sm" variant="outline" onClick={() => setRole(null)}>
                Change
              </Button>
            </div>

            {role === "INTERVIEWER" && (
              <div className="bg-[#0f0f11] border border-white/10 flex flex-col gap-6 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="title">Current title</Label>
                    <Input
                      id="title"
                      placeholder="Senior Frontend Developer"
                      value={form.title}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      placeholder="Google, Meta, Startup..."
                      value={form.company}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          company: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {YEARS_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`text-xs border rounded-lg px-4 py-2 ${
                        form.yearsExp === option.value
                          ? "bg-amber-400/10 text-amber-400 border-amber-400/40"
                          : "text-stone-500 border-white/10"
                      }`}
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          yearsExp: option.value,
                        }))
                      }
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((category) => {
                    if (!category?.value) return null;

                    const activeCategory = form.categories.includes(
                      category.value,
                    );

                    return (
                      <button
                        key={category.value}
                        type="button"
                        className={`text-xs border rounded-lg px-4 py-2 ${
                          activeCategory
                            ? "bg-amber-400/10 text-amber-400 border-amber-400/40"
                            : "text-stone-500 border-white/10"
                        }`}
                        onClick={() => toggleCategory(category.value)}
                      >
                        {category.label}
                      </button>
                    );
                  })}
                </div>

                <Textarea
                  rows={4}
                  maxLength={300}
                  placeholder="Tell interviewees about your background, what you specialise in, and what they can expect from a session with you."
                  value={form.bio}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      bio: e.target.value,
                    }))
                  }
                />
              </div>
            )}

            <Button
              size="xl"
              variant="primary"
              className="w-full"
              onClick={handleSubmit}
              disabled={!canSubmit || isLoading}
            >
              {isLoading
                ? "Setting up your account..."
                : role === "INTERVIEWER"
                  ? "Create interviewer profile →"
                  : "Explore Interviewers →"}
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
