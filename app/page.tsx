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

type Tab = "ideas" | "profile";

export default function Dashboard() {
  const [profiles, setProfiles] = useState<ProfileWithStats[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null);
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [tab, setTab] = useState<Tab>("ideas");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

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
      } else {
        setAnalysis(null);
        setIdeas([]);
      }
    } catch {
      setAnalysis(null);
      setIdeas([]);
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

  const selectedProfile = profiles.find((p) => p.id === selectedId) || null;

  return (
    <div className="flex h-screen bg-[#0A0A0A]">
      <Sidebar
        profiles={profiles}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onAddProfile={() => setShowModal(true)}
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
                  <IdeasTab ideas={ideas} onStatusChange={handleStatusChange} />
                ) : (
                  <WinningProfileTab analysis={analysis} />
                )
              ) : (
                <div className="flex-1 flex items-center justify-center p-12 text-center">
                  <div>
                    <p className="text-[#666] text-sm">
                      No analysis yet for this profile.
                    </p>
                    <p className="text-[#444] text-xs mt-1">
                      Add the profile again to run analysis.
                    </p>
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
