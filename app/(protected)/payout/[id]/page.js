import { auth, currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { isAdminEmailAddress } from "@/lib/admin";
import { GoldTitle, GrayTitle, SectionLabel } from "@/components/Reusables";
import PayoutReview from "./_components/PayoutReview";

export default async function PayoutPage({ params }) {
  await auth.protect();

  const user = await currentUser();
  if (!isAdminEmailAddress(user?.primaryEmailAddress?.emailAddress)) {
    notFound();
  }

  const { id } = await params;

  const payout = await prisma.payout.findUnique({
    where: {
      id,
    },
    include: {
      interviewer: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!payout) notFound();

  return (
    <main className="min-h-screen bg-[#0a0a0b] text-stone-100 flex justify-center items-center antialiased px-6">
      <div className="max-w-sm w-full flex flex-col gap-6">
        <div className="text-center">
          <SectionLabel>Admin</SectionLabel>
          <h1 className="text-4xl font-serif tracking-tighter mt-1">
            <GrayTitle>Review</GrayTitle>
            <GoldTitle>Withdrawl</GoldTitle>
          </h1>
        </div>

        <PayoutReview
          payout={{
            id: payout.id,
            credits: payout.credits,
            netAmount: payout.netAmount,
            platformFee: payout.platformFee,
            paymentMethod: payout.paymentMethod,
            paymentDetail: payout.paymentDetail,
            status: payout.status,
            interviewerName: payout.interviewer.name,
            interviewerEmail: payout.interviewer.email,
          }}
        />
      </div>
    </main>
  );
}
