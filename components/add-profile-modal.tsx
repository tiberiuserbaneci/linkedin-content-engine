"use client";

import { useState } from "react";
import type { Category } from "@/lib/database.types";

interface AddProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

type LoadingStep = "idle" | "scraping" | "analyzing" | "done" | "error";

const LOADING_MESSAGES: Record<LoadingStep, string> = {
  idle: "",
  scraping: "Scraping posts...",
  analyzing: "Analysing patterns & generating ideas...",
  done: "Complete!",
  error: "Something went wrong",
};

export function AddProfileModal({ isOpen, onClose, onComplete }: AddProfileModalProps) {
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [category, setCategory] = useState<Category>("founder");
  const [researchSpace, setResearchSpace] = useState("");
  const [maxPosts, setMaxPosts] = useState(50);
  const [step, setStep] = useState<LoadingStep>("idle");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStep("scraping");

    try {
      // Step 1: Scrape
      const scrapeRes = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          linkedin_url: linkedinUrl,
          category,
          max_posts: maxPosts,
        }),
      });

      const scrapeData = await scrapeRes.json();

      if (!scrapeRes.ok) {
        throw new Error(JSON.stringify(scrapeData, null, 2));
      }

      const profile_id = scrapeData.profile_id;
      if (!profile_id) {
        throw new Error("No profile_id in response: " + JSON.stringify(scrapeData, null, 2));
      }

      // Step 2: Analyze
      setStep("analyzing");
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile_id,
          research_space: researchSpace || undefined,
        }),
      });

      if (!analyzeRes.ok) {
        const data = await analyzeRes.json();
        throw new Error(data.error || "Failed to analyze");
      }

      setStep("done");
      setTimeout(() => {
        setStep("idle");
        setLinkedinUrl("");
        setResearchSpace("");
        onComplete();
      }, 1000);
    } catch (err) {
      setStep("error");
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  const isLoading = step === "scraping" || step === "analyzing";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-[#F1F1F1]">Add Profile</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-[#666] hover:text-[#F1F1F1] text-xl leading-none disabled:opacity-50"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#999] mb-1.5">LinkedIn URL</label>
            <input
              type="url"
              required
              disabled={isLoading}
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#1E1E1E] rounded-lg text-[#F1F1F1] text-sm placeholder:text-[#444] focus:border-[#DA4E24] focus:outline-none disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm text-[#999] mb-1.5">Category</label>
            <select
              value={category}
              disabled={isLoading}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#1E1E1E] rounded-lg text-[#F1F1F1] text-sm focus:border-[#DA4E24] focus:outline-none disabled:opacity-50"
            >
              <option value="founder">Founder</option>
              <option value="vc">VC</option>
              <option value="ai_creator">AI Creator</option>
              <option value="operator">Operator</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-[#999] mb-1.5">
              Research Space{" "}
              <span className="text-[#444]">(optional)</span>
            </label>
            <input
              type="text"
              disabled={isLoading}
              value={researchSpace}
              onChange={(e) => setResearchSpace(e.target.value)}
              placeholder="e.g. AI agents, SaaS growth, climate tech"
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#1E1E1E] rounded-lg text-[#F1F1F1] text-sm placeholder:text-[#444] focus:border-[#DA4E24] focus:outline-none disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm text-[#999] mb-1.5">Max Posts</label>
            <input
              type="number"
              disabled={isLoading}
              value={maxPosts}
              onChange={(e) => setMaxPosts(Number(e.target.value))}
              min={10}
              max={200}
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#1E1E1E] rounded-lg text-[#F1F1F1] text-sm focus:border-[#DA4E24] focus:outline-none disabled:opacity-50"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-400/10 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center gap-3 py-3">
              <div className="w-5 h-5 border-2 border-[#DA4E24] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-[#999]">
                {LOADING_MESSAGES[step]}
              </span>
            </div>
          ) : (
            <button
              type="submit"
              disabled={step === "done"}
              className="w-full px-4 py-2.5 bg-[#DA4E24] text-white rounded-lg font-medium text-sm hover:bg-[#DA4E24]/90 transition-colors disabled:opacity-50"
            >
              {step === "done" ? "Done!" : "Scrape & Analyse"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
