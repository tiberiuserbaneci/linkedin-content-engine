"use client";

import { useState } from "react";
import type { ContentIdea, IdeaStatus, PatternMatch } from "@/lib/database.types";

const PATTERN_COLORS: Record<string, string> = {
  topic: "bg-[#2563EB]/20 text-[#60A5FA] border-[#2563EB]/30",
  format: "bg-[#7C3AED]/20 text-[#A78BFA] border-[#7C3AED]/30",
  hook: "bg-[#D97706]/20 text-[#FBBF24] border-[#D97706]/30",
  emotion: "bg-[#059669]/20 text-[#34D399] border-[#059669]/30",
  specificity: "bg-[#64748B]/20 text-[#94A3B8] border-[#64748B]/30",
};

const STATUS_CONFIG: Record<IdeaStatus, { label: string; style: string }> = {
  idea: { label: "Idea", style: "bg-[#1E1E1E] text-[#999]" },
  writing: { label: "Writing", style: "bg-[#D97706]/20 text-[#FBBF24]" },
  done: { label: "Done", style: "bg-[#059669]/20 text-[#34D399]" },
  skipped: { label: "Skip", style: "bg-[#1E1E1E] text-[#666]" },
};

const FORMAT_LABELS: Record<string, string> = {
  narrative: "Narrative",
  how_to: "How-To",
  opinion: "Opinion",
  data_driven: "Data-Driven",
};

interface TopPost {
  id: string;
  content: string;
  reactions_count: number;
  comments_count: number;
  shares_count: number;
  linkedin_post_url: string;
  published_at: string | null;
}

interface EngagementStats {
  total_posts: number;
  total_reactions: number;
  total_comments: number;
  avg_reactions: number;
  avg_comments: number;
}

interface IdeasTabProps {
  ideas: ContentIdea[];
  onStatusChange: (id: string, status: IdeaStatus) => Promise<void>;
  engagementStats: EngagementStats | null;
  topPosts: TopPost[];
}

export function IdeasTab({ ideas, onStatusChange, engagementStats, topPosts }: IdeasTabProps) {
  return (
    <div className="space-y-4 p-6">
      {/* Engagement Stats Banner */}
      {engagementStats && (
        <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-4">
          <h3 className="text-sm font-medium text-[#F1F1F1] mb-3">Posts Analyzed</h3>
          <div className="grid grid-cols-5 gap-4">
            <div>
              <p className="text-2xl font-semibold text-[#DA4E24]">{engagementStats.total_posts}</p>
              <p className="text-xs text-[#666]">Posts</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#F1F1F1]">{engagementStats.total_reactions.toLocaleString()}</p>
              <p className="text-xs text-[#666]">Total Reactions</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#F1F1F1]">{engagementStats.total_comments.toLocaleString()}</p>
              <p className="text-xs text-[#666]">Total Comments</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#60A5FA]">{engagementStats.avg_reactions}</p>
              <p className="text-xs text-[#666]">Avg Reactions</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#60A5FA]">{engagementStats.avg_comments}</p>
              <p className="text-xs text-[#666]">Avg Comments</p>
            </div>
          </div>
        </div>
      )}

      {/* Top 5 Performing Posts */}
      {topPosts.length > 0 && (
        <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-5">
          <h3 className="text-sm font-medium text-[#F1F1F1] mb-3">Top 5 Performing Posts</h3>
          <div className="space-y-3">
            {topPosts.map((post, i) => (
              <div key={post.id} className="bg-[#0A0A0A] rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <span className="text-xs font-semibold text-[#DA4E24] mt-0.5">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#BBB] line-clamp-2">
                      {post.content.slice(0, 200)}{post.content.length > 200 ? "..." : ""}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-[#666]">
                      <span className="text-[#FBBF24]">{post.reactions_count.toLocaleString()} reactions</span>
                      <span>{post.comments_count.toLocaleString()} comments</span>
                      <span>{post.shares_count.toLocaleString()} shares</span>
                      {post.published_at && (
                        <span>{new Date(post.published_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {ideas.map((idea) => (
        <IdeaCard
          key={idea.id}
          idea={idea}
          onStatusChange={onStatusChange}
          avgReactions={engagementStats?.avg_reactions}
          avgComments={engagementStats?.avg_comments}
        />
      ))}

      {ideas.length > 0 && <SummaryTable ideas={ideas} />}
    </div>
  );
}

function IdeaCard({
  idea,
  onStatusChange,
  avgReactions,
  avgComments,
}: {
  idea: ContentIdea;
  onStatusChange: (id: string, status: IdeaStatus) => Promise<void>;
  avgReactions?: number;
  avgComments?: number;
}) {
  const [updating, setUpdating] = useState(false);

  async function handleStatus(status: IdeaStatus) {
    setUpdating(true);
    try {
      await onStatusChange(idea.id, status);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-5">
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 rounded-lg bg-[#DA4E24]/20 text-[#DA4E24] flex items-center justify-center font-semibold text-sm flex-shrink-0">
          {idea.position}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[#F1F1F1] font-medium">{idea.title}</h3>
          <p className="text-sm text-[#999] mt-1">{idea.topic}</p>

          {/* Pattern matches */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {(idea.pattern_matches as PatternMatch[]).map((match, i) => (
              <span
                key={i}
                className={`text-[11px] px-2 py-0.5 rounded-full border ${
                  PATTERN_COLORS[match.type] || PATTERN_COLORS.specificity
                }`}
              >
                {match.label}
              </span>
            ))}
          </div>

          {/* Angle */}
          <p className="text-sm text-[#BBB] mt-3">{idea.angle}</p>

          {/* Hook draft */}
          <div className="mt-3 p-3 bg-[#DA4E24]/5 border border-[#DA4E24]/20 rounded-lg">
            <p className="text-xs text-[#DA4E24] mb-1 font-medium">Hook Draft</p>
            <p className="text-sm text-[#F1F1F1] italic">&ldquo;{idea.hook_draft}&rdquo;</p>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-3 mt-3 text-xs text-[#666]">
            <span className="px-2 py-0.5 bg-[#1E1E1E] rounded">
              {FORMAT_LABELS[idea.format] || idea.format}
            </span>
            <span>{idea.emotional_register}</span>
            {(avgReactions !== undefined || avgComments !== undefined) && (
              <span className="text-[#60A5FA]">
                ~{avgReactions} reactions, ~{avgComments} comments avg
              </span>
            )}
            <span className="text-[#999]">{idea.trending_signal}</span>
          </div>

          {/* Status buttons */}
          <div className="flex gap-2 mt-3">
            {(["idea", "writing", "done", "skipped"] as IdeaStatus[]).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => handleStatus(status)}
                  disabled={updating}
                  className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                    idea.status === status
                      ? STATUS_CONFIG[status].style + " ring-1 ring-white/20"
                      : "bg-[#1E1E1E] text-[#666] hover:text-[#999]"
                  }`}
                >
                  {STATUS_CONFIG[status].label}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryTable({ ideas }: { ideas: ContentIdea[] }) {
  const statusCounts = ideas.reduce(
    (acc, idea) => {
      acc[idea.status] = (acc[idea.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const formatCounts = ideas.reduce(
    (acc, idea) => {
      acc[idea.format] = (acc[idea.format] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="mt-8 bg-[#111111] border border-[#1E1E1E] rounded-xl p-5">
      <h3 className="text-sm font-medium text-[#F1F1F1] mb-4">Summary</h3>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="text-xs text-[#666] mb-2">By Status</h4>
          <div className="space-y-1.5">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between text-sm">
                <span className="text-[#999]">
                  {STATUS_CONFIG[status as IdeaStatus]?.label || status}
                </span>
                <span className="text-[#F1F1F1]">{count}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs text-[#666] mb-2">By Format</h4>
          <div className="space-y-1.5">
            {Object.entries(formatCounts).map(([format, count]) => (
              <div key={format} className="flex items-center justify-between text-sm">
                <span className="text-[#999]">
                  {FORMAT_LABELS[format] || format}
                </span>
                <span className="text-[#F1F1F1]">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
