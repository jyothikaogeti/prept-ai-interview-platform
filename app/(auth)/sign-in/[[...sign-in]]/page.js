import { SignIn } from "@clerk/nextjs";

import { StarsBackgroundDemo } from "@/components/StarsBackground";
import { clerkAppearance } from "@/components/clerk-theme";

export default function SignInPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <StarsBackgroundDemo />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-20">
        <SignIn appearance={clerkAppearance} />
      </div>
    </main>
  );
}
