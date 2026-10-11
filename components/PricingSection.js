"use client";

import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import { CheckoutButton } from "@clerk/nextjs/experimental";

import { PLANS } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PricingSection() {
  const { has, userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const isSignedIn = !!userId;
  const isOnPro = isSignedIn && has({ plan: "pro" });
  const isOnStarter = isSignedIn && has({ plan: "starter" });
  const isOnFree = isSignedIn && !isOnStarter && !isOnPro;

  const activePlanSlug = isOnPro
    ? "pro"
    : isOnStarter
      ? "starter"
      : isOnFree
        ? "free"
        : null;

  const handleSubscriptionComplete = async () => {
    await user?.reload();
    router.refresh();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {PLANS.map((plan) => {
        const isActive = activePlanSlug === plan.slug;

        return (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-2xl transition-all duration-300 h-full p-10 hover:-translate-y-1 ${
              plan.featured
                ? "bg-[#141417] border border-amber-400/20"
                : "bg-[#0f0f11] border border-white/10 hover:border-amber-400/10"
            } ${isActive ? "ring-1 ring-amber-400/30" : ""}`}
          >
            {plan.featured && !isActive && (
              <span className="absolute -top-3 left-1/2 bg-amber-400 text-[#0a0a0b] text-xs font-bold rounded-full uppercase tracking-wide whitespace-nowrap -translate-x-1/2 px-3.5 py-1">
                Most Popular
              </span>
            )}

            <p className="text-stone-500 text-xs font-semibold uppercase tracking-widest mb-5">
              {plan.name}
            </p>

            <div className="flex items-end gap-1 mb-1.5">
              <span
                className={`text-5xl font-serif tracking-tight leading-none ${
                  plan.featured
                    ? "bg-linear-to-br from-amber-300 to-amber-500 text-transparent bg-clip-text"
                    : "bg-linear-to-br from-stone-100s to-stone-400 text-transparent bg-clip-text"
                }`}
              >
                {plan.price}
              </span>

              <span className="text-stone-500 text-sm font-light mb-1.5">
                /month
              </span>
            </div>

            <p className="text-shadow-amber-400 text-sm mb-7">{plan.credits}</p>

            <div className="bg-white/10 h-px mb-7" />

            <ul className="space-y-3 flex-1 mb-9">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="text-stone-400 text-sm flex items-start gap-2.5"
                >
                  <span className="text-amber-400 text-xs mt-0.5">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            {isActive ? (
              <Button
                variant={plan.featured ? "primary" : "default"}
                className="w-full cursor-not-allowed opacity-50"
                disabled
              >
                ✓ Current plan
              </Button>
            ) : plan.planId === null ? (
              isSignedIn ? (
                <Button
                  variant="outline"
                  className="w-full cursor-not-allowed opacity-50"
                  disabled
                >
                  Default plan
                </Button>
              ) : (
                <SignInButton>
                  <Button variant="outline" className="w-full">
                    Get started free
                  </Button>
                </SignInButton>
              )
            ) : isSignedIn ? (
              <CheckoutButton
                planId={plan.planId}
                planPeriod="month"
                onSubscriptionComplete={handleSubscriptionComplete}
                checkoutProps={{
                  appearance: {
                    elements: {
                      drawerRoot: { zIndex: 1000 },
                    },
                  },
                }}
              >
                <Button
                  variant={plan.featured ? "primary" : "outline"}
                  className="w-full"
                >
                  {activePlanSlug === "pro" && plan.slug === "starter"
                    ? "Downgrade"
                    : activePlanSlug === "starter" && plan.slug === "pro"
                      ? "Upgrade →"
                      : "Get started →"}
                </Button>
              </CheckoutButton>
            ) : (
              <SignInButton>
                <Button
                  variant={plan.featured ? "primary" : "outline"}
                  className="w-full"
                >
                  Get started →
                </Button>
              </SignInButton>
            )}
          </div>
        );
      })}
    </div>
  );
}
