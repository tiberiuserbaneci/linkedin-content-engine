"use client";

import { useState } from "react";
import type { Category } from "@/lib/database.types";

interface AddProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

type LoadingStep = "idle" | "scraping" | "building_profile" | "generating_ideas" | "done" | "error";

const LOADING_MESSAGES: Record<LoadingStep, string> = {
  idle: "",
  scraping: "Step 1/3: Scraping posts...",
  building_profile: "Step 2/3: Building winning profile...",
  generating_ideas: "Step 3/3: Generating ideas...",
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

      if (!scrapeRes.ok) {
        const scrapeData = await scrapeRes.json().catch(() => ({ error: "Scrape failed" }));
        throw new Error(scrapeData.error || "Scrape failed");
      }

      const scrapeData = await scrapeRes.json();
      const profile_id = scrapeData.profile_id;
      if (!profile_id) {
        throw new Error("No profile_id returned from scrape");
      }

      // Step 2: Build winning profile (non-fatal — posts are already saved)
      setStep("building_profile");
      let analysis_id: string | null = null;
      try {
        const profileRes = await fetch("/api/analyze/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile_id }),
        });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          analysis_id = profileData.analysis_id;
        }
      } catch { /* analysis failure is non-fatal */ }

      // Step 3: Generate ideas (non-fatal, only if analysis succeeded)
      if (analysis_id) {
        setStep("generating_ideas");
        try {
          await fetch("/api/analyze/ideas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              analysis_id,
              profile_id,
              research_space: researchSpace || undefined,
            }),
          });
        } catch { /* ideas failure is non-fatal */ }
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

  const isLoading = step === "scraping" || step === "building_profile" || step === "generating_ideas";

  const stepNumber = step === "scraping" ? 1 : step === "building_profile" ? 2 : step === "generating_ideas" ? 3 : 0;

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
            <div className="text-red-400 text-sm bg-red-400/10 rounded-lg px-3 py-2 max-h-32 overflow-y-auto">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="space-y-3 py-2">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-[#DA4E24] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-[#F1F1F1]">
                  {LOADING_MESSAGES[step]}
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-[#1E1E1E] rounded-full h-1.5">
                <div
                  className="bg-[#DA4E24] h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${(stepNumber / 3) * 100}%` }}
                />
              </div>
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
