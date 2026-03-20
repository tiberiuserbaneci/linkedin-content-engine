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
}

export function Sidebar({ profiles, selectedId, onSelect, onAddProfile }: SidebarProps) {
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
            <button
              key={profile.id}
              onClick={() => onSelect(profile.id)}
              className={`w-full p-3 flex items-center gap-3 text-left hover:bg-[#111111] transition-colors border-b border-[#1E1E1E] ${
                selectedId === profile.id ? "bg-[#111111]" : ""
              }`}
            >
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-10 h-10 rounded-full flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#1E1E1E] flex items-center justify-center text-[#666] text-sm flex-shrink-0">
                  {profile.full_name.charAt(0)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-[#F1F1F1] truncate">
                  {profile.full_name}
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
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
