"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

import { CATEGORY_LABEL } from "@/lib/data";
import { useFetch } from "@/hooks/useFetch";
import { generateInterviewQuestions } from "@/actions/aiQuestions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function AIQuestionsPanel({ categories }) {
  const [selectedCategory, setSelectedCategory] = useState(
    categories?.[0] ?? null,
  );

  const {
    data,
    isLoading,
    error,
    execute: generateQuestions,
  } = useFetch(generateInterviewQuestions);

  const questions = data?.questions ?? [];

  return (
    <div className="flex flex-col gap-4 h-full overflow-hidden">
      <div className="flex flex-wrap gap-1.5">
        {categories?.map((category) => (
          <button
            key={category}
            type="button"
            className={`text-xs border rounded-lg transition-all px-3 py-1.5 ${
              selectedCategory === category
                ? "bg-amber-400/10 text-amber-400 border-amber-400/40"
                : "text-stone-500 border-white/10 hover:text-stone-400 hover:border-white/20"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {CATEGORY_LABEL[category] ?? category}
          </button>
        ))}
      </div>

      <Button
        size="sm"
        variant="primary"
        className="self-start gap-2"
        onClick={() => generateQuestions({ category: selectedCategory })}
        disabled={isLoading || !selectedCategory}
      >
        {isLoading ? (
          <>
            <Loader2 size={13} className="animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles size={13} />
            Generate Questions
          </>
        )}
      </Button>

      {error && (
        <p className="text-red-400 text-xs">{error?.message || error}</p>
      )}

      {questions.length > 0 ? (
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto pr-1">
          {questions.map((question, i) => (
            <div
              key={i}
              className="bg-[#141417] border border-white/8 rounded-xl flex flex-col gap-2 p-4"
            >
              <p className="text-stone-200 text-sm font-medium leading-snug">
                {i + 1}. {question.question}
              </p>
              <Separator className="bg-white/5 h-px" />
              <p className="text-stone-500 text-xs font-light leading-relaxed">
                <span className="text-amber-400/70 font-medium">Answer:</span>
                {question.answer}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-1 flex-col justify-center items-center gap-2 text-center">
          <span className="w-10 h-10 bg-amber-400/10  border border-amber-400/20 rounded-xl flex justify-center items-center">
            <Sparkles size={16} className="text-amber-400" />
          </span>
          <p className="text-stone-600 text-xs">
            Select a category and generate role-specific questions for this
            session.
          </p>
        </div>
      )}
    </div>
  );
}
