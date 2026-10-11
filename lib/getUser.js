import { auth, currentUser } from "@clerk/nextjs/server";
import { unstable_noStore as noStore } from "next/cache";

import { prisma } from "./prisma";

const PLAN_CREDITS = {
  free: 1,
  starter: 5,
  pro: 15,
};

async function getCurrentPlan() {
  const { has } = await auth();

  if (has({ plan: "pro" })) return "pro";
  if (has({ plan: "starter" })) return "starter";

  return "free";
}

function isNewMonth(lastAllocatedAt) {
  if (!lastAllocatedAt) return true;

  const now = new Date();
  const last = new Date(lastAllocatedAt);

  return (
    now.getFullYear() > last.getFullYear() || now.getMonth() > last.getMonth()
  );
}

export async function getUser() {
  noStore();

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  try {
    let loggedInUser = await prisma.user.findUnique({
      where: {
        clerkUserId: clerkUser.id,
      },
    });

    if (!loggedInUser) {
      loggedInUser = await prisma.user.create({
        data: {
          clerkUserId: clerkUser.id,
          name:
            [clerkUser.firstName, clerkUser.lastName]
              .filter(Boolean)
              .join(" ")
              .trim() ||
            clerkUser.emailAddresses?.[0]?.emailAddress?.split("@")[0] ||
            "User",
          email: clerkUser.emailAddresses[0].emailAddress,
          imageUrl: clerkUser.imageUrl,
          role: "UNASSIGNED",
          currentPlan: "free",
          credits: 0,
          creditsLastAllocatedAt: null,
          creditBalance: 0,
        },
      });
      return loggedInUser;
    }

    if (loggedInUser.role === "UNASSIGNED") {
      return loggedInUser;
    }

    if (loggedInUser.role === "INTERVIEWER") {
      return loggedInUser;
    }

    const currentPlan = await getCurrentPlan();

    const planCredits = PLAN_CREDITS[currentPlan];
    const planChanged = loggedInUser.currentPlan !== currentPlan;
    const monthlyReset = isNewMonth(loggedInUser.creditsLastAllocatedAt);

    if (planChanged || monthlyReset) {
      const newCredits = (loggedInUser.credits ?? 0) + planCredits;

      loggedInUser = await prisma.user.update({
        where: {
          clerkUserId: clerkUser.id,
        },

        data: {
          credits: newCredits,
          currentPlan,
          creditsLastAllocatedAt: new Date(),
        },
      });
    }
    return loggedInUser;
  } catch (error) {
    console.error("getUser error:", error);
    return null;
  }
}
