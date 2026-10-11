"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getIntervieweeAppointments() {
  const user = await currentUser();
  if (!user) return [];

  const dbUser = await prisma.user.findUnique({
    where: {
      clerkUserId: user.id,
    },
  });
  if (!dbUser) return [];

  return prisma.booking.findMany({
    where: {
      intervieweeId: dbUser.id,
    },
    include: {
      interviewer: {
        select: {
          name: true,
          email: true,
          imageUrl: true,
          title: true,
          company: true,
          categories: true,
        },
      },
      feedback: true,
    },
    orderBy: {
      startTime: "desc",
    },
  });
}
