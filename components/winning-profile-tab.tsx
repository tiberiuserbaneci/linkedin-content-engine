"use client";

import { useState } from "react";
import type { ContentAnalysis, TopicCluster } from "@/lib/database.types";
import { GeneratePostModal } from "./generate-post-modal";

interface WinningProfileTabProps {
  analysis: ContentAnalysis;
  winningFormula: string;
}

export function WinningProfileTab({ analysis, winningFormula }: WinningProfileTabProps) {
  const [generateModal, setGenerateModal] = useState<string | null>(null);

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
        <PostSuggestions data={analysis.hook_formula as Record<string, unknown>} onGenerate={setGenerateModal} />
      </Section>

      {/* Emotional Playbook */}
      <Section title="Emotional Playbook">
        <JsonSection data={analysis.emotional_playbook as Record<string, unknown>} />
        <PostSuggestions data={analysis.emotional_playbook as Record<string, unknown>} onGenerate={setGenerateModal} />
      </Section>

      {/* Winning Format */}
      <Section title="Winning Format">
        <JsonSection data={analysis.winning_format as Record<string, unknown>} />
        <PostSuggestions data={analysis.winning_format as Record<string, unknown>} onGenerate={setGenerateModal} />
      </Section>

      {/* Structural DNA */}
      <Section title="Structural DNA">
        <JsonSection data={analysis.structural_dna as Record<string, unknown>} />
        <PostSuggestions data={analysis.structural_dna as Record<string, unknown>} onGenerate={setGenerateModal} />
      </Section>

      {/* Specificity */}
      <Section title="Specificity">
        <JsonSection data={analysis.specificity as Record<string, unknown>} />
        <PostSuggestions data={analysis.specificity as Record<string, unknown>} onGenerate={setGenerateModal} />
      </Section>

      {/* Close Patterns */}
      <Section title="Close Patterns">
        <JsonSection data={analysis.close_patterns as Record<string, unknown>} />
        <PostSuggestions data={analysis.close_patterns as Record<string, unknown>} onGenerate={setGenerateModal} />
      </Section>

      {/* What Doesn't Work — Examples to Avoid WITHOUT generate button */}
      <Section title="What Doesn't Work">
        <JsonSection data={analysis.what_doesnt_work as Record<string, unknown>} />
        <ExamplesToAvoid data={analysis.what_doesnt_work as Record<string, unknown>} />
      </Section>

      {/* Generate Post Modal */}
      {generateModal && (
        <GeneratePostModal
          isOpen={true}
          onClose={() => setGenerateModal(null)}
          title={generateModal}
          topic={generateModal}
          angle=""
          hookDraft={generateModal}
          format="narrative"
          emotionalRegister=""
          winningFormula={winningFormula}
        />
      )}
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

/** Post Suggestions — good examples with Generate Post button (used in all sections except "What Doesn't Work") */
function PostSuggestions({ data, onGenerate }: { data: Record<string, unknown>; onGenerate: (text: string) => void }) {
  const examples = data.example_posts;
  if (!Array.isArray(examples) || examples.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-[#1E1E1E]">
      <h4 className="text-xs font-medium text-[#DA4E24] mb-2">Post Suggestions</h4>
      <div className="space-y-2">
        {examples.map((post, i) => (
          <div
            key={i}
            className="bg-[#DA4E24]/5 border border-[#DA4E24]/20 rounded-lg p-3 flex items-start justify-between gap-3"
          >
            <p className="text-sm text-[#F1F1F1] italic flex-1">&ldquo;{String(post)}&rdquo;</p>
            <button
              onClick={() => onGenerate(String(post))}
              className="flex-shrink-0 text-xs px-2.5 py-1 bg-[#DA4E24] text-white rounded hover:bg-[#DA4E24]/90 transition-colors whitespace-nowrap"
            >
              Generate Post &#8599;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Examples to Avoid — bad examples with NO generate button (only used in "What Doesn't Work") */
function ExamplesToAvoid({ data }: { data: Record<string, unknown> }) {
  const examples = data.example_posts;
  if (!Array.isArray(examples) || examples.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-[#1E1E1E]">
      <h4 className="text-xs font-medium text-[#EF4444]/80 mb-2">Examples to Avoid &mdash; Did Not Perform</h4>
      <div className="space-y-2">
        {examples.map((post, i) => (
          <div
            key={i}
            className="bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-lg p-3"
          >
            <p className="text-sm text-[#999] italic">&ldquo;{String(post)}&rdquo;</p>
            <p className="text-[10px] text-[#666] mt-1">What not to do &mdash; underperformed for this creator</p>
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
