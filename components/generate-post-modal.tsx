"use client";

import { useState } from "react";
import { VisualGenerator } from "./visual-generator";

interface GeneratePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  topic: string;
  angle: string;
  hookDraft: string;
  format: string;
  emotionalRegister: string;
  winningFormula: string;
}

export function GeneratePostModal({
  isOpen,
  onClose,
  title,
  topic,
  angle,
  hookDraft,
  format,
  emotionalRegister,
  winningFormula,
}: GeneratePostModalProps) {
  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showVisual, setShowVisual] = useState(false);

  if (!isOpen) return null;

  async function handleGenerate() {
    setLoading(true);
    setError("");
    setPost("");
    try {
      const res = await fetch("/api/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          topic,
          angle,
          hook_draft: hookDraft,
          format,
          emotional_register: emotionalRegister,
          winning_formula: winningFormula,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate");
      setPost(data.post);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate post");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(post);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleClose() {
    setPost("");
    setError("");
    setShowVisual(false);
    onClose();
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col">
          <div className="flex items-center justify-between p-5 border-b border-[#1E1E1E]">
            <h2 className="text-lg font-semibold text-[#F1F1F1]">Generate Post</h2>
            <button
              onClick={handleClose}
              className="text-[#666] hover:text-[#F1F1F1] text-xl leading-none"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="bg-[#0A0A0A] rounded-lg p-3">
              <p className="text-xs text-[#666] mb-1">Topic</p>
              <p className="text-sm text-[#F1F1F1]">{title}</p>
              {angle && <p className="text-xs text-[#999] mt-1">{angle}</p>}
            </div>

            {!post && !loading && (
              <button
                onClick={handleGenerate}
                className="w-full px-4 py-2.5 bg-[#DA4E24] text-white rounded-lg font-medium text-sm hover:bg-[#DA4E24]/90 transition-colors"
              >
                Generate Post
              </button>
            )}

            {loading && (
              <div className="flex items-center gap-3 py-4 justify-center">
                <div className="w-5 h-5 border-2 border-[#DA4E24] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-[#999]">Generating post...</span>
              </div>
            )}

            {post && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-[#DA4E24]">Generated Post</p>
                  <button
                    onClick={handleCopy}
                    className="text-xs px-3 py-1 bg-[#1E1E1E] text-[#999] hover:text-[#F1F1F1] rounded transition-colors"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="bg-[#0A0A0A] border border-[#1E1E1E] rounded-lg p-4">
                  <p className="text-sm text-[#F1F1F1] whitespace-pre-wrap leading-relaxed">{post}</p>
                </div>
              </div>
            )}

            {post && (
              <button
                onClick={() => setShowVisual(true)}
                className="w-full px-4 py-2.5 bg-[#7C3AED]/20 text-[#A78BFA] border border-[#7C3AED]/30 rounded-lg font-medium text-sm hover:bg-[#7C3AED]/30 transition-colors"
              >
                Generate Visual Cheatsheet
              </button>
            )}

            {error && (
              <div className="text-red-400 text-sm bg-red-400/10 rounded-lg px-3 py-2">{error}</div>
            )}
          </div>
        </div>
      </div>

      <VisualGenerator
        isOpen={showVisual}
        onClose={() => setShowVisual(false)}
        postContent={post}
      />
    </>
  );
}
