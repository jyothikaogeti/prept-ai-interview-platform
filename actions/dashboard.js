"use server";

import { revalidatePath } from "next/cache";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { request } from "@arcjet/next";
import { render } from "react-email";
import { Resend } from "resend";

import { prisma } from "@/lib/prisma";
import { checkRateLimit, createRateLimiter } from "@/lib/arcjet";
import { WithdrawlRequestEmail } from "@/emails/WithdrawlRequestEmail";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

const resend = new Resend(process.env.RESEND_API_KEY);

const withdrawlLimiter = createRateLimiter({
  refillRate: 1,
  interval: "1h",
  capacity: 3,
});

export async function setAvailability({ startTime, endTime }) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: {
      clerkUserId: user.id,
    },
  });
  if (!dbUser || dbUser.role !== "INTERVIEWER") throw new Error("Forbidden");

  if (!startTime || !endTime) throw new Error("Start and end time required");
  if (new Date(startTime) >= new Date(endTime))
    throw new Error("Start time must be before end time");

  try {
    const existingAvailability = await prisma.availability.findFirst({
      where: {
        interviewerId: dbUser.id,
        status: "AVAILABLE",
      },
    });

    if (existingAvailability) {
      await prisma.availability.update({
        where: {
          id: existingAvailability.id,
        },
        data: {
          startTime: new Date(startTime),
          endTime: new Date(endTime),
        },
      });
    } else {
      await prisma.availability.create({
        data: {
          interviewerId: dbUser.id,
          status: "AVAILABLE",
          startTime: new Date(startTime),
          endTime: new Date(endTime),
        },
      });
    }

    revalidatePath("/dashboard");

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to save availability");
  }
}

export async function getAvailability() {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: {
      clerkUserId: user.id,
    },
  });
  if (!dbUser) throw new Error("User not found");

  return prisma.availability.findFirst({
    where: {
      interviewerId: dbUser.id,
      status: "AVAILABLE",
    },
  });
}

export async function getInterviewerAppointments() {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: {
      clerkUserId: user.id,
    },
  });
  if (!dbUser) throw new Error("User not found");

  return prisma.booking.findMany({
    where: {
      interviewerId: dbUser.id,
    },
    include: {
      interviewee: {
        select: {
          name: true,
          email: true,
          imageUrl: true,
        },
      },
      feedback: true,
    },
    orderBy: {
      startTime: "desc",
    },
  });
}

export async function getInterviewerStats() {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: {
      clerkUserId: user.id,
    },
    select: {
      creditRate: true,
      creditBalance: true,
      bookingsAsInterviewer: {
        where: {
          status: "COMPLETED",
        },
        select: {
          creditsCharged: true,
        },
      },
    },
  });
  if (!dbUser) throw new Error("User not found");

  const totalEarned = dbUser.bookingsAsInterviewer.reduce(
    (sum, b) => sum + b.creditsCharged,
    0,
  );

  return {
    totalEarned,
    creditRate: dbUser.creditRate,
    creditBalance: dbUser.creditBalance,
    completedSessions: dbUser.bookingsAsInterviewer.length,
  };
}

export async function requestWithdrawl({
  credits,
  paymentMethod,
  paymentDetail,
}) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const clerk = await clerkClient();

  const req = await request();
  const rateLimitError = await checkRateLimit(withdrawlLimiter, req, user.id);
  if (rateLimitError) throw new Error(rateLimitError);

  const dbUser = await prisma.user.findUnique({
    where: {
      clerkUserId: user.id,
    },
  });
  if (!dbUser || dbUser.role !== "INTERVIEWER") throw new Error("Forbidden");

  if (!credits || credits <= 0) throw new Error("Invalid credit amount");
  if (credits > dbUser.creditBalance)
    throw new Error("Insufficient credit balance");
  if (!paymentMethod || !paymentDetail)
    throw new Error("payment details required");

  const PLATFORM_FEE = 0.2;
  const netAmount = credits * (1 - PLATFORM_FEE) * 5;
  const platformFee = credits * PLATFORM_FEE * 5;

  try {
    const [payout] = await prisma.$transaction([
      prisma.payout.create({
        data: {
          interviewerId: dbUser.id,
          credits,
          platformFee,
          netAmount,
          paymentMethod,
          paymentDetail,
          status: "PROCESSING",
        },
      }),
      prisma.user.update({
        where: {
          id: dbUser.id,
        },
        data: {
          creditBalance: {
            decrement: credits,
          },
        },
      }),
    ]);

    try {
      if (!ADMIN_EMAIL) {
        throw new Error("ADMIN_EMAIL is not configured");
      }

      const reviewUrl = `${process.env.NEXT_PUBLIC_APP_URL}/payout/${payout.id}`;

      const html = await render(
        WithdrawlRequestEmail({
          interviewerName: dbUser.name ?? "Unknown",
          interviewerEmail: dbUser.email,
          credits,
          platformFee,
          netAmount,
          paymentMethod,
          paymentDetail,
          reviewUrl,
        }),
      );

      await resend.emails.send({
        from: "Prept <onboarding@resend.dev>",
        to: ADMIN_EMAIL,
        subject: `Withdrawl Request - ${dbUser.name} · ${credits} credits`,
        html,
      });
    } catch (emailError) {
      console.error("Withdrawl error failed:", emailError);
    }

    revalidatePath("/dashboard");

    return {
      success: true,
      netAmount,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Withdrawl request failed");
  }
}

export async function getWithdrawlHistory() {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: {
      clerkUserId: user.id,
    },
  });
  if (!dbUser) throw new Error("User not found");

  return prisma.payout.findMany({
    where: {
      interviewerId: dbUser.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
