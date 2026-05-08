"use client";

import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar";
import { ProfileHeader } from "@/components/profile-header";
import { IdeasTab } from "@/components/ideas-tab";
import { WinningProfileTab } from "@/components/winning-profile-tab";
import { AddProfileModal } from "@/components/add-profile-modal";
import type {
  ProfileWithStats,
  ContentAnalysis,
  ContentIdea,
  IdeaStatus,
} from "@/lib/database.types";

interface TopPost {
  id: string;
  content: string;
  reactions_count: number;
  comments_count: number;
  shares_count: number;
  linkedin_post_url: string;
  published_at: string | null;
  post_type: string;
}

interface EngagementStats {
  total_posts: number;
  total_reactions: number;
  total_comments: number;
  avg_reactions: number;
  avg_comments: number;
}

type Tab = "ideas" | "profile";

export default function Dashboard() {
  const [profiles, setProfiles] = useState<ProfileWithStats[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null);
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [topPosts, setTopPosts] = useState<TopPost[]>([]);
  const [allPosts, setAllPosts] = useState<TopPost[]>([]);
  const [engagementStats, setEngagementStats] = useState<EngagementStats | null>(null);
  const [tab, setTab] = useState<Tab>("ideas");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const fetchProfiles = useCallback(async () => {
    try {
      const res = await fetch("/api/profiles");
      if (res.ok) {
        const data = await res.json();
        setProfiles(data);
        if (data.length > 0 && !selectedId) {
          setSelectedId(data[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch profiles:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedId]);

  const fetchAnalysis = useCallback(async (profileId: string) => {
    try {
      const res = await fetch(`/api/profiles/${profileId}/analysis`);
      if (res.ok) {
        const data = await res.json();
        setAnalysis(data.analysis);
        setIdeas(data.ideas);
        setTopPosts(data.top_posts || []);
        setAllPosts(data.all_posts || []);
        setEngagementStats(data.engagement_stats || null);
      } else {
        setAnalysis(null);
        setIdeas([]);
        setTopPosts([]);
        setAllPosts([]);
        setEngagementStats(null);
      }
    } catch {
      setAnalysis(null);
      setIdeas([]);
      setTopPosts([]);
      setAllPosts([]);
      setEngagementStats(null);
    }
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  useEffect(() => {
    if (selectedId) {
      fetchAnalysis(selectedId);
    }
  }, [selectedId, fetchAnalysis]);

  async function runAnalysis(profileId: string) {
    setAnalysisLoading(true);
    setAnalysisError(null);
    try {
      const profileRes = await fetch("/api/analyze/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile_id: profileId }),
      });
      if (!profileRes.ok) {
        const d = await profileRes.json().catch(() => ({ error: "Profile analysis failed" }));
        throw new Error(d.error || "Profile analysis failed");
      }
      const { analysis_id } = await profileRes.json();

      // Ideas generation is non-fatal
      try {
        await fetch("/api/analyze/ideas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ analysis_id, profile_id: profileId }),
        });
      } catch { /* ideas failure is non-fatal */ }

      await fetchAnalysis(profileId);
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : "Analysis failed");
      await fetchAnalysis(profileId);
    } finally {
      setAnalysisLoading(false);
    }
  }

  async function handleStatusChange(ideaId: string, status: IdeaStatus) {
    try {
      const res = await fetch(`/api/ideas/${ideaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setIdeas((prev) =>
          prev.map((idea) => (idea.id === ideaId ? updated : idea))
        );
      }
    } catch (err) {
      console.error("Failed to update idea:", err);
    }
  }

  async function handleRefreshProfile(profileId: string) {
    const profile = profiles.find((p) => p.id === profileId);
    if (!profile) return;
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          linkedin_url: profile.linkedin_url,
          category: profile.category,
          max_posts: 50,
        }),
      });
      if (res.ok) {
        await fetchProfiles();
        if (selectedId === profileId) {
          fetchAnalysis(profileId);
        }
      }
    } catch (err) {
      console.error("Failed to refresh profile:", err);
    }
  }

  async function handleDeleteProfile(profileId: string) {
    try {
      const res = await fetch(`/api/profiles/${profileId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProfiles((prev) => prev.filter((p) => p.id !== profileId));
        if (selectedId === profileId) {
          setSelectedId(null);
          setAnalysis(null);
          setIdeas([]);
          setTopPosts([]);
          setAllPosts([]);
          setEngagementStats(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete profile:", err);
    }
  }

  const selectedProfile = profiles.find((p) => p.id === selectedId) || null;

  return (
    <div className="flex h-screen bg-[#0A0A0A]">
      <Sidebar
        profiles={profiles}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onAddProfile={() => setShowModal(true)}
        onDelete={handleDeleteProfile}
        onRefresh={handleRefreshProfile}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#DA4E24] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : selectedProfile ? (
          <>
            <ProfileHeader profile={selectedProfile} />

            {/* Tabs */}
            <div className="flex border-b border-[#1E1E1E]">
              <button
                onClick={() => setTab("ideas")}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  tab === "ideas"
                    ? "text-[#DA4E24] border-b-2 border-[#DA4E24]"
                    : "text-[#666] hover:text-[#999]"
                }`}
              >
                Content Ideas
              </button>
              <button
                onClick={() => setTab("profile")}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  tab === "profile"
                    ? "text-[#DA4E24] border-b-2 border-[#DA4E24]"
                    : "text-[#666] hover:text-[#999]"
                }`}
              >
                Winning Profile
              </button>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto">
              {analysis ? (
                tab === "ideas" ? (
                  <IdeasTab
                    ideas={ideas}
                    onStatusChange={handleStatusChange}
                    engagementStats={engagementStats}
                    topPosts={topPosts}
                    allPosts={allPosts}
                    winningFormula={analysis?.winning_formula || ""}
                  />
                ) : (
                  <WinningProfileTab analysis={analysis} winningFormula={analysis.winning_formula} />
                )
              ) : (
                <div className="flex-1 flex items-center justify-center p-12 text-center">
                  <div>
                    <p className="text-[#666] text-sm mb-4">
                      No analysis yet for this profile.
                    </p>
                    {analysisError && (
                      <p className="text-red-400 text-xs mb-3">{analysisError}</p>
                    )}
                    <button
                      onClick={() => selectedId && runAnalysis(selectedId)}
                      disabled={analysisLoading}
                      className="px-5 py-2.5 bg-[#DA4E24] text-white rounded-lg font-medium text-sm hover:bg-[#DA4E24]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                    >
                      {analysisLoading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Analysing...
                        </>
                      ) : (
                        "Run Analysis"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-[#F1F1F1] mb-2">
                LinkedIn Content Engine
              </h2>
              <p className="text-[#666] text-sm mb-6">
                Analyze any LinkedIn creator&apos;s content and generate
                calibrated ideas.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-2.5 bg-[#DA4E24] text-white rounded-lg font-medium text-sm hover:bg-[#DA4E24]/90 transition-colors"
              >
                Add Your First Profile
              </button>
            </div>
          </div>
        )}
      </main>

      <AddProfileModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onComplete={() => {
          setShowModal(false);
          fetchProfiles();
        }}
      />
    </div>
  );
}
