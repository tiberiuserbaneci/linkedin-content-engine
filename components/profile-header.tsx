"use client";

import type { ProfileWithStats, Category } from "@/lib/database.types";

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

export function ProfileHeader({ profile }: { profile: ProfileWithStats }) {
  return (
    <div className="flex items-center gap-4 p-6 border-b border-[#1E1E1E]">
      {profile.avatar_url ? (
        <img
          src={profile.avatar_url}
          alt={profile.full_name}
          className="w-14 h-14 rounded-full"
        />
      ) : (
        <div className="w-14 h-14 rounded-full bg-[#1E1E1E] flex items-center justify-center text-[#666] text-xl">
          {profile.full_name.charAt(0)}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-[#F1F1F1]">
            {profile.full_name}
          </h1>
          <span
            className={`text-xs px-2 py-0.5 rounded text-white ${
              CATEGORY_COLORS[profile.category as Category]
            }`}
          >
            {CATEGORY_LABELS[profile.category as Category]}
          </span>
        </div>
        {profile.headline && (
          <p className="text-sm text-[#999] mt-0.5 truncate">{profile.headline}</p>
        )}
        <div className="flex items-center gap-4 mt-1 text-xs text-[#666]">
          <span>{profile.followers_count.toLocaleString()} followers</span>
          <span>{profile.posts_count} posts</span>
          {profile.ideas_count > 0 && (
            <span>{profile.ideas_count} ideas</span>
          )}
        </div>
      </div>
    </div>
  );
}
