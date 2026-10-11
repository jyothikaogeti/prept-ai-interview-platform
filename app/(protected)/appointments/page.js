import { CalendarDays } from "lucide-react";
import Link from "next/link";

import { getIntervieweeAppointments } from "@/actions/appointments";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AppointmentCard } from "@/components/AppointmentCard";
import PageHeader from "@/components/Reusables";

export default async function MyAppointmentsPage() {
  const appointments = await getIntervieweeAppointments();

  const now = new Date();

  const upcomingAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "SCHEDULED" &&
      new Date(appointment.startTime) > now,
  );
  const pastAppointments = appointments.filter(
    (appointment) =>
      appointment.status !== "SCHEDULED" ||
      new Date(appointment.endTime) <= now,
  );

  return (
    <main className="min-h-screen bg-black">
      <PageHeader
        label="My appointments"
        grayText="Your interview"
        goldText="sessions"
        description="All your upcoming and past mock interviews in one place."
      />

      <div className="max-w-6xl mx-auto flex flex-col gap-14 px-8 lg:px-0 py-8">
        {appointments.length === 0 && (
          <div className="flex flex-col justify-center items-center text-center gap-5 py-28">
            <span className="w-16 h-16 bg-amber-400/10 text-3xl border border-amber-400/20 rounded-2xl flex justify-center items-center">
              <CalendarDays size={28} className="text-amber-400" />
            </span>

            <div>
              <p className="text-stone-400 text-base font-light">
                No sessions booked yet.
              </p>
              <p className="text-stone-600 text-sm mt-1">
                Browse expert interviewers and book your first session.
              </p>
            </div>

            <Button variant="primary" asChild>
              <Link href="/explore">Browse Interviewers →</Link>
            </Button>
          </div>
        )}

        {upcomingAppointments.length > 0 && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <p className="text-stone-500 text-xs font-semibold uppercase tracking-widest">
                Upcoming ({upcomingAppointments.length})
              </p>
              <Separator className="bg-white/5 flex-1 h-px" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {upcomingAppointments.map((booking) => (
                <AppointmentCard
                  key={booking.id}
                  booking={booking}
                  mode="interviewee"
                />
              ))}
            </div>
          </div>
        )}

        {pastAppointments.length > 0 && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <p className="text-stone-500 text-xs font-semibold uppercase tracking-widest">
                Past ({pastAppointments.length})
              </p>
              <Separator className="bg-white/5 flex-1 h-px" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pastAppointments.map((booking) => (
                <AppointmentCard
                  key={booking.id}
                  booking={booking}
                  mode="interviewee"
                  isPast={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
