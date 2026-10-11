import { getInterviewers } from "@/actions/explore";
import PageHeader from "@/components/Reusables";
import ExploreGrid from "./_components/ExploreGrid";

export default async function ExplorePage() {
  const interviewers = await getInterviewers();

  return (
    <main className="min-h-screen bg-black">
      <PageHeader
        grayText="Find your"
        goldText="expert interviewer"
        label="Explore"
        description="Browse senior engineers from top companies."
      />

      <div className="max-w-6xl mx-auto px-8 xl:px-0 py-10">
        <ExploreGrid interviewers={interviewers} />
      </div>
    </main>
  );
}
