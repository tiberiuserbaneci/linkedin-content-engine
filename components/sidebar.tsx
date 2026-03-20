"use client";

import { useState } from "react";
import { ProfileWithStats, Category } from "@/lib/database.types";

const CATEGORY_COLORS: Record<Category, string> = {
  founder: "bg-[#DA4E24]",
  vc: "bg-[#7C3AED]",
  ai_creator: "bg-[#0891B2]",
  operator: "bg-[#059669]",
  other: "bg-[#64748B]",
};

const CATEGORY_LABELS: Record<Category, string> = {
  founder: "Founder",
  vc: "VC",
  ai_creator: "AI Creator",
  operator: "Operator",
  other: "Other",
};

interface SidebarProps {
  profiles: ProfileWithStats[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddProfile: () => void;
  onDelete: (id: string) => void;
  onRefresh: (id: string) => Promise<void>;
}

export function Sidebar({ profiles, selectedId, onSelect, onAddProfile, onDelete, onRefresh }: SidebarProps) {
  return (
    <aside className="w-72 border-r border-[#1E1E1E] bg-[#0A0A0A] flex flex-col h-full">
      <div className="p-4 border-b border-[#1E1E1E]">
        <button
          onClick={onAddProfile}
          className="w-full px-4 py-2.5 bg-[#DA4E24] text-white rounded-lg font-medium text-sm hover:bg-[#DA4E24]/90 transition-colors"
        >
          + Add Profile
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {profiles.length === 0 ? (
          <div className="p-4 text-[#666] text-sm text-center">
            No profiles yet. Add one to get started.
          </div>
        ) : (
          profiles.map((profile) => (
            <ProfileItem
              key={profile.id}
              profile={profile}
              isSelected={selectedId === profile.id}
              onSelect={onSelect}
              onDelete={onDelete}
              onRefresh={onRefresh}
            />
          ))
        )}
      </div>
    </aside>
  );
}

function ProfileItem({
  profile,
  isSelected,
  onSelect,
  onDelete,
  onRefresh,
}: {
  profile: ProfileWithStats;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onRefresh: (id: string) => Promise<void>;
}) {
  const [refreshing, setRefreshing] = useState(false);

  async function handleRefresh(e: React.MouseEvent) {
    e.stopPropagation();
    setRefreshing(true);
    try {
      await onRefresh(profile.id);
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <div
      className={`w-full p-3 flex items-center gap-3 text-left hover:bg-[#111111] transition-colors border-b border-[#1E1E1E] group ${
        isSelected ? "bg-[#111111]" : ""
      }`}
    >
      <button
        onClick={() => onSelect(profile.id)}
        className="flex items-center gap-3 flex-1 min-w-0"
      >
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.full_name}
            className="w-10 h-10 rounded-full flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#1E1E1E] flex items-center justify-center text-[#666] text-sm flex-shrink-0">
            {(profile.full_name || profile.linkedin_handle || "?").charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-[#F1F1F1] truncate">
            {profile.full_name && profile.full_name !== "Unknown"
              ? profile.full_name
              : profile.linkedin_handle || "Unknown"}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded text-white ${
                CATEGORY_COLORS[profile.category as Category]
              }`}
            >
              {CATEGORY_LABELS[profile.category as Category]}
            </span>
            <span className="text-[11px] text-[#666]">
              {profile.posts_count} posts
            </span>
            {profile.ideas_count > 0 && (
              <span className="text-[11px] text-[#DA4E24]">
                {profile.ideas_count} ideas
              </span>
            )}
          </div>
        </div>
      </button>
      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
        {/* Refresh button */}
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-1.5 rounded hover:bg-[#2563EB]/20 text-[#666] hover:text-[#60A5FA] transition-all disabled:opacity-50"
          title="Re-scrape profile (update followers & dates)"
        >
          {refreshing ? (
            <div className="w-3.5 h-3.5 border-2 border-[#60A5FA] border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 4v6h-6M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
            </svg>
          )}
        </button>
        {/* Delete button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm(`Delete ${profile.full_name} and all related data?`)) {
              onDelete(profile.id);
            }
          }}
          className="p-1.5 rounded hover:bg-red-500/20 text-[#666] hover:text-red-400 transition-all"
          title="Delete profile"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14M10 11v6M14 11v6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
