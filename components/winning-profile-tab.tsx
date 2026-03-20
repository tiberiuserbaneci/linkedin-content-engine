"use client";

import type { ContentAnalysis, TopicCluster } from "@/lib/database.types";

interface WinningProfileTabProps {
  analysis: ContentAnalysis;
}

export function WinningProfileTab({ analysis }: WinningProfileTabProps) {
  return (
    <div className="space-y-6 p-6">
      {/* Winning Formula - Prominent */}
      <div className="bg-[#DA4E24]/10 border border-[#DA4E24]/30 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-[#DA4E24] mb-3">
          Winning Formula
        </h2>
        <p className="text-[#F1F1F1] leading-relaxed">{analysis.winning_formula}</p>

        {analysis.winning_checklist && (
          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-medium text-[#DA4E24]">Checklist</h3>
            {(analysis.winning_checklist as string[]).map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-[#BBB]">
                <span className="text-[#DA4E24] mt-0.5">&#10003;</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Overview */}
      <Section title="Overview">
        <p className="text-sm text-[#BBB] leading-relaxed">{analysis.overview}</p>
      </Section>

      {/* Topic Clusters */}
      <Section title="Topic Clusters">
        <div className="grid gap-3">
          {(analysis.topic_clusters as TopicCluster[]).map((cluster, i) => (
            <div key={i} className="bg-[#0A0A0A] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-[#F1F1F1]">{cluster.name}</h4>
                <div className="flex items-center gap-3 text-xs text-[#666]">
                  <span>{Math.round(cluster.frequency * 100)}% of posts</span>
                  <span>{cluster.avg_engagement} avg engagement</span>
                </div>
              </div>
              <p className="text-xs text-[#999] mt-1">{cluster.description}</p>
              {cluster.examples && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {cluster.examples.map((ex, j) => (
                    <span
                      key={j}
                      className="text-[11px] px-2 py-0.5 bg-[#2563EB]/10 text-[#60A5FA] rounded"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Hook Formula */}
      <Section title="Hook Formula">
        <JsonSection data={analysis.hook_formula as Record<string, unknown>} />
        <ExamplePosts data={analysis.hook_formula as Record<string, unknown>} />
      </Section>

      {/* Emotional Playbook */}
      <Section title="Emotional Playbook">
        <JsonSection data={analysis.emotional_playbook as Record<string, unknown>} />
        <ExamplePosts data={analysis.emotional_playbook as Record<string, unknown>} />
      </Section>

      {/* Winning Format */}
      <Section title="Winning Format">
        <JsonSection data={analysis.winning_format as Record<string, unknown>} />
        <ExamplePosts data={analysis.winning_format as Record<string, unknown>} />
      </Section>

      {/* Structural DNA */}
      <Section title="Structural DNA">
        <JsonSection data={analysis.structural_dna as Record<string, unknown>} />
        <ExamplePosts data={analysis.structural_dna as Record<string, unknown>} />
      </Section>

      {/* Specificity */}
      <Section title="Specificity">
        <JsonSection data={analysis.specificity as Record<string, unknown>} />
        <ExamplePosts data={analysis.specificity as Record<string, unknown>} />
      </Section>

      {/* Close Patterns */}
      <Section title="Close Patterns">
        <JsonSection data={analysis.close_patterns as Record<string, unknown>} />
        <ExamplePosts data={analysis.close_patterns as Record<string, unknown>} />
      </Section>

      {/* What Doesn't Work */}
      <Section title="What Doesn't Work">
        <JsonSection data={analysis.what_doesnt_work as Record<string, unknown>} />
        <ExamplePosts data={analysis.what_doesnt_work as Record<string, unknown>} />
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-5">
      <h3 className="text-sm font-semibold text-[#F1F1F1] mb-3">{title}</h3>
      {children}
    </div>
  );
}

function ExamplePosts({ data }: { data: Record<string, unknown> }) {
  const examples = data.example_posts;
  if (!Array.isArray(examples) || examples.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-[#1E1E1E]">
      <h4 className="text-xs font-medium text-[#DA4E24] mb-2">Post Suggestions</h4>
      <div className="space-y-2">
        {examples.map((post, i) => (
          <div
            key={i}
            className="bg-[#DA4E24]/5 border border-[#DA4E24]/20 rounded-lg p-3"
          >
            <p className="text-sm text-[#F1F1F1] italic">&ldquo;{String(post)}&rdquo;</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function JsonSection({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="space-y-3">
      {Object.entries(data).filter(([key]) => key !== "example_posts").map(([key, value]) => (
        <div key={key}>
          <h4 className="text-xs text-[#666] capitalize mb-1">
            {key.replace(/_/g, " ")}
          </h4>
          {Array.isArray(value) ? (
            <div className="space-y-1">
              {value.map((item, i) => (
                <div key={i} className="text-sm text-[#BBB]">
                  {typeof item === "object" ? (
                    <div className="bg-[#0A0A0A] rounded p-2 text-xs">
                      {Object.entries(item as Record<string, unknown>).map(
                        ([k, v]) => (
                          <div key={k} className="flex gap-2">
                            <span className="text-[#666]">{k}:</span>
                            <span className="text-[#BBB]">{String(v)}</span>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <span className="text-sm">&#8226; {String(item)}</span>
                  )}
                </div>
              ))}
            </div>
          ) : typeof value === "object" && value !== null ? (
            <div className="bg-[#0A0A0A] rounded p-2 text-xs space-y-1">
              {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <span className="text-[#666]">{k}:</span>
                  <span className="text-[#BBB]">{String(v)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#BBB]">{String(value)}</p>
          )}
        </div>
      ))}
    </div>
  );
}
