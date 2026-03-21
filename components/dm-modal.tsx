"use client";

import { useState, useEffect } from "react";

interface Contact {
  id: string;
  full_name: string;
  title: string;
  avatar_url: string | null;
  last_post_content: string | null;
  vc_firms: { name: string; focus_areas: string[] | null } | null;
  vc_outreach: { id: string; status: string; dm_text: string | null; notes: string | null }[] | null;
}

interface DmModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact | null;
  onStatusChange: () => void;
}

const STATUS_OPTIONS = [
  { value: "to_contact", label: "To Contact" },
  { value: "contacted", label: "Contacted" },
  { value: "replied", label: "Replied" },
  { value: "not_interested", label: "Not Interested" },
];

export function DmModal({ isOpen, onClose, contact, onStatusChange }: DmModalProps) {
  const [dmText, setDmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState("to_contact");
  const [notes, setNotes] = useState("");
  const [outreachId, setOutreachId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (contact && isOpen) {
      const outreach = contact.vc_outreach?.[0];
      if (outreach) {
        setDmText(outreach.dm_text || "");
        setStatus(outreach.status || "to_contact");
        setNotes(outreach.notes || "");
        setOutreachId(outreach.id);
      } else {
        setDmText("");
        setStatus("to_contact");
        setNotes("");
        setOutreachId(null);
        handleGenerate();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contact, isOpen]);

  async function handleGenerate() {
    if (!contact) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/vc/generate-dm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact_id: contact.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate DM");
      setDmText(data.dm_text);
      setOutreachId(data.outreach_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate DM");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!outreachId) return;
    setSaving(true);
    try {
      const update: Record<string, unknown> = { status, notes };
      if (status === "contacted") update.contacted_at = new Date().toISOString();
      if (status === "replied") update.replied_at = new Date().toISOString();

      const res = await fetch(`/api/vc/outreach/${outreachId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(update),
      });
      if (!res.ok) throw new Error("Failed to save");
      onStatusChange();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleMarkContacted() {
    if (!outreachId) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/vc/outreach/${outreachId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "contacted", contacted_at: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setStatus("contacted");
      onStatusChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  }

  if (!isOpen || !contact) return null;

  const firmName = contact.vc_firms?.name || "Unknown Firm";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl w-full max-w-lg max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-[#1E1E1E]">
          {contact.avatar_url ? (
            <img src={contact.avatar_url} alt={contact.full_name} className="w-10 h-10 rounded-full" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#1E1E1E] flex items-center justify-center text-[#666] text-sm">
              {contact.full_name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#F1F1F1] truncate">{contact.full_name}</p>
            <p className="text-xs text-[#666] truncate">{contact.title} at {firmName}</p>
          </div>
          <button onClick={onClose} className="text-[#666] hover:text-[#F1F1F1] text-xl">&times;</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Recent post context */}
          {contact.last_post_content && (
            <div className="bg-[#0A0A0A] rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider text-[#666] mb-1">Recent Post</p>
              <p className="text-xs text-[#999] italic">{contact.last_post_content}</p>
            </div>
          )}

          {/* DM */}
          {loading ? (
            <div className="flex items-center gap-3 py-6 justify-center">
              <div className="w-5 h-5 border-2 border-[#DA4E24] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-[#999]">Writing DM...</span>
            </div>
          ) : (
            <>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-[#DA4E24]">LinkedIn DM</p>
                  <span className="text-[10px] text-[#666]">{dmText.length}/300</span>
                </div>
                <textarea
                  value={dmText}
                  onChange={(e) => setDmText(e.target.value)}
                  rows={4}
                  maxLength={300}
                  className="w-full bg-[#0A0A0A] border border-[#1E1E1E] rounded-lg p-3 text-sm text-[#F1F1F1] resize-none focus:outline-none focus:border-[#DA4E24]"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex-1 px-3 py-2 bg-[#1E1E1E] text-[#999] border border-[#333] rounded-lg text-xs hover:text-[#F1F1F1] transition-colors"
                >
                  Regenerate
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(dmText);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="flex-1 px-3 py-2 bg-[#1E1E1E] text-[#999] border border-[#333] rounded-lg text-xs hover:text-[#F1F1F1] transition-colors"
                >
                  {copied ? "Copied!" : "Copy DM"}
                </button>
                <button
                  onClick={handleMarkContacted}
                  disabled={saving || status === "contacted"}
                  className="flex-1 px-3 py-2 bg-[#DA4E24]/20 text-[#DA4E24] border border-[#DA4E24]/30 rounded-lg text-xs hover:bg-[#DA4E24]/30 transition-colors disabled:opacity-50"
                >
                  Mark Contacted
                </button>
              </div>
            </>
          )}

          {/* Status + Notes */}
          <div className="space-y-3 pt-2 border-t border-[#1E1E1E]">
            <div>
              <p className="text-xs text-[#666] mb-1">Status</p>
              <div className="flex gap-2">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setStatus(opt.value)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors ${
                      status === opt.value
                        ? "bg-[#DA4E24] text-white"
                        : "bg-[#1E1E1E] text-[#666] hover:text-[#999]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-[#666] mb-1">Notes</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Add notes..."
                className="w-full bg-[#0A0A0A] border border-[#1E1E1E] rounded-lg p-2 text-xs text-[#F1F1F1] resize-none focus:outline-none focus:border-[#DA4E24]"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-xs bg-red-400/10 rounded px-3 py-2">{error}</div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[#1E1E1E]">
          <button
            onClick={handleSave}
            disabled={saving || !outreachId}
            className="w-full px-4 py-2.5 bg-[#DA4E24] text-white rounded-lg font-medium text-sm hover:bg-[#DA4E24]/90 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
