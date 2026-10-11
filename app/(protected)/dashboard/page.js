import { ClipboardList, Wallet } from "lucide-react";

import { getCurrentUser } from "@/actions/user";
import {
  getAvailability,
  getInterviewerAppointments,
  getInterviewerStats,
  getWithdrawlHistory,
} from "@/actions/dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/Reusables";
import EarningsSection from "./_components/EarningsSection";
import AppointmentsSection from "./_components/AppointmentsSection";
import AvailabilitySection from "./_components/AvailabilitySection";

export default async function InterviewerDashboardPage() {
  const dbUser = await getCurrentUser();

  const [availability, appointments, stats, withdrawlHistory] =
    await Promise.all([
      getAvailability(),
      getInterviewerAppointments(),
      getInterviewerStats(),
      getWithdrawlHistory(),
    ]);

  return (
    <main className="min-h-screen bg-black">
      <PageHeader
        label="Interviewer Dashboard"
        grayText="Welcome back,"
        goldText={dbUser.name?.split(" ")[0] ?? "Interviewer"}
        description={
          dbUser.title && dbUser.company
            ? `${dbUser.title} · ${dbUser.company}`
            : undefined
        }
        right={
          <div>
            <p className="text-stone-600 text-xs">Credit Balance</p>
            <p className="bg-linear-to-br from-amber-300 to-amber-500 bg-clip-text text-transparent text-3xl text-right font-serif leading-none">
              {stats?.creditBalance ?? 0}
            </p>
          </div>
        }
      />

      <div className="max-w-6xl mx-auto px-8 py-10">
        <Tabs defaultValue="earnings">
          <TabsList className="bg-[#0f0f11] border border-white/10 w-full mb-8">
            <TabsTrigger value="earnings" className="p-5">
              <Wallet size={16} className="text-amber-400" />
              Earnings
            </TabsTrigger>

            <TabsTrigger value="appointments" className="p-5">
              <ClipboardList size={18} className="text-amber-400" />
              Appointments
            </TabsTrigger>

            <TabsTrigger value="availability" className="p-5">
              <Wallet size={18} className="text-amber-400" />
              Availability
            </TabsTrigger>
          </TabsList>

          <TabsContent value="earnings">
            <EarningsSection
              stats={stats}
              withdrawlHistory={withdrawlHistory}
            />
          </TabsContent>

          <TabsContent value="appointments">
            <AppointmentsSection appointments={appointments} />
          </TabsContent>

          <TabsContent value="availability">
            <AvailabilitySection availability={availability} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
