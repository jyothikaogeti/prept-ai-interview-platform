"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getInterviewers() {
  const user = await currentUser();

  try {
    const interviewers = await prisma.user.findMany({
      where: {
        role: "INTERVIEWER",
        ...(user && {
          clerkUserId: {
            not: user.id,
          },
        }),
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        title: true,
        bio: true,
        company: true,
        yearsExp: true,
        categories: true,
        creditRate: true,
        availabilities: {
          where: {
            status: "AVAILABLE",
          },
          select: {
            startTime: true,
            endTime: true,
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return interviewers;
  } catch (error) {
    console.error("getInterviewers error:", error);
    return [];
  }
}
