"use server";

import { currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import { isAdminEmailAddress } from "@/lib/admin";

export async function approvePayout({ payoutId, adminPassword }) {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  if (!isAdminEmailAddress(user.primaryEmailAddress?.emailAddress)) {
    throw new Error("Forbidden");
  }

  if (!adminPassword) throw new Error("Password required");

  if (adminPassword !== process.env.ADMIN_PAYOUT_PASSWORD) {
    throw new Error("Incorrect password");
  }

  const payout = await prisma.payout.findUnique({
    where: {
      id: payoutId,
    },
  });

  if (!payout) throw new Error("Payout not found");
  if (payout.status === "PROCESSED") throw new Error("Already processed");

  await prisma.payout.update({
    where: {
      id: payoutId,
    },
    data: {
      status: "PROCESSED",
      processedAt: new Date(),
      processedBy: "admin",
    },
  });

  return {
    success: true,
  };
}
