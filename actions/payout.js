"use server";

import { prisma } from "@/lib/prisma";

export async function approvePayout({ payoutId, adminPassword }) {
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
