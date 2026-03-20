"use client";

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
}

export function Sidebar({ profiles, selectedId, onSelect, onAddProfile, onDelete }: SidebarProps) {
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
            <div
              key={profile.id}
              className={`w-full p-3 flex items-center gap-3 text-left hover:bg-[#111111] transition-colors border-b border-[#1E1E1E] group ${
                selectedId === profile.id ? "bg-[#111111]" : ""
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
                    {profile.full_name || profile.linkedin_handle}
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Delete ${profile.full_name} and all related data?`)) {
                    onDelete(profile.id);
                  }
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-red-500/20 text-[#666] hover:text-red-400 transition-all flex-shrink-0"
                title="Delete profile"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14M10 11v6M14 11v6" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
