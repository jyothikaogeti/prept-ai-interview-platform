import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { CalendarDays, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { getUser } from "@/lib/getUser";
import { Button } from "@/components/ui/button";
import CreditsButton from "@/components/CreditsButon";
import RoleRedirect from "@/components/RoleRedirect";

export default async function Header() {
  const user = await getUser();

  return (
    <nav className="fixed top-0 flex justify-between items-center border-b border-white/7 backdrop-blur-xl inset-x-0 z-100 px-3 sm:px-10 py-3">
      <Link href="/">
        <Image
          src="/prept-logo.png"
          alt="Prept Logo"
          width={100}
          height={100}
          className="w-auto h-11"
        />
      </Link>

      {user && <RoleRedirect role={user.role} />}

      <div className="flex items-center gap-3">
        <Show when="signed-in">
          {user?.role === "INTERVIEWER" && (
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}

          {user?.role === "INTERVIEWEE" && (
            <>
              <Button variant="ghost" asChild>
                <Link href="/explore" className="flex gap-3">
                  <Users size={16} />
                  <span className="hidden md:inline">Explore</span>
                </Link>
              </Button>

              <Button variant="default" asChild>
                <Link href="/appointments" className="flex gap-3">
                  <CalendarDays size={16} />
                  <span className="hidden md:inline">My Appointments</span>
                </Link>
              </Button>
            </>
          )}

          {user?.role === "INTERVIEWER" && (
            <CreditsButton
              role="INTERVIEWER"
              credits={user.creditBalance ?? 0}
            />
          )}

          {user?.role === "INTERVIEWEE" && (
            <CreditsButton role="INTERVIEWEE" credits={user.credits ?? 0} />
          )}

          <UserButton />
        </Show>

        <Show when="signed-out">
          <SignInButton>
            <Button variant="ghost">Sign In</Button>
          </SignInButton>

          <SignUpButton>
            <Button variant="primary">Get started →</Button>
          </SignUpButton>
        </Show>
      </div>
    </nav>
  );
}
