"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { CATEGORIES } from "@/lib/data";
import { Input } from "@/components/ui/input";
import InterviewerCard from "./InterviewerCard";

export default function ExploreGrid({ interviewers }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  const filteredInterviewers = useMemo(() => {
    return interviewers.filter((interviewer) => {
      const matchesCategory =
        activeCategory === null ||
        interviewer.categories?.includes(activeCategory);

      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        interviewer.name?.toLowerCase().includes(query) ||
        interviewer.title?.toLowerCase().includes(query) ||
        interviewer.company?.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [interviewers, search, activeCategory]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="relative max-w-sm">
          <Search
            size={14}
            className="absolute top-1/2 left-3.5 text-stone-600 -translate-y-1/2 pointer-events-none"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, title, or company..."
            className="bg-[#0f0f11] text-stone-100 text-sm border-white/10 pl-9 placeholder:text-stone-600"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => {
            const active = activeCategory === category.value;

            return (
              <button
                key={String(category.value)}
                type="button"
                className={`text-xs border rounded-lg cursor-pointer transition-all duration-200 px-4 py-2 ${
                  active
                    ? "bg-amber-400/10 text-amber-400 border-amber-400/40"
                    : "text-stone-500 border-white/10 hover:text-stone-400 hover:border-white/20"
                }`}
                onClick={() => setActiveCategory(category.value)}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-stone-600 text-xs">
        {filteredInterviewers.length === 0
          ? "No interviewers found"
          : `${filteredInterviewers.length} Interviewer${filteredInterviewers.length === 1 ? "" : "s"} found`}
      </p>

      {filteredInterviewers.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-stone-600 text-sm">
            No interviewers match your filters.
          </p>

          <button
            type="button"
            className="text-amber-400 text-xs transition-colors hover:text-amber-300"
            onClick={() => {
              setSearch("");
              setActiveCategory(null);
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInterviewers.map((interviewer) => (
            <InterviewerCard key={interviewer.id} interviewer={interviewer} />
          ))}
        </div>
      )}
    </div>
  );
}
