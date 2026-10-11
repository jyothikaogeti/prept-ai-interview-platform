"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export async function completeOnboarding(data) {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const { role, title, bio, company, yearsExp, categories } = data;

  if (!role || !["INTERVIEWER", "INTERVIEWEE"].includes(role)) {
    throw new Error("Invalid role");
  }

  if (role === "INTERVIEWER") {
    if (!title || !bio || !company || !yearsExp || !categories?.length) {
      throw new Error("Please fill in all required fields");
    }
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    if (existingUser.role !== "UNASSIGNED") {
      throw new Error("Onboarding has already been completed");
    }

    if (role === "INTERVIEWER") {
      await prisma.user.update({
        where: {
          clerkUserId: user.id,
        },

        data: {
          role: "INTERVIEWER",
          title,
          bio,
          company,
          yearsExp,
          categories,
          credits: 0,
          currentPlan: "free",
          creditsLastAllocatedAt: null,
          creditBalance: 0,
        },
      });
    }

    if (role === "INTERVIEWEE") {
      await prisma.user.update({
        where: {
          clerkUserId: user.id,
        },
        data: {
          role: "INTERVIEWEE",
          credits: 1,
          currentPlan: "free",
          creditBalance: 0,
          creditsLastAllocatedAt: new Date(),
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/onboarding");
    revalidatePath("/explore");
    revalidatePath("/dashboard");
    revalidatePath("/appointments");

    return {
      success: true,
    };
  } catch (error) {
    console.error("completeOnboarding error:", error);
    if (error.message === "Onboarding has already been completed") {
      throw error;
    }
    if (error.message === "User not found") {
      throw error;
    }
    throw new Error("Something went wrong. Please try again.");
  }
}
