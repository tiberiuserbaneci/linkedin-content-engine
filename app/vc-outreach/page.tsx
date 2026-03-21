"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { DmModal } from "@/components/dm-modal";

interface VcFirm {
  id: string;
  name: string;
  linkedin_url: string;
  description: string | null;
  focus_areas: string[] | null;
  location: string | null;
  employee_count: number | null;
  website: string | null;
  follower_count: number | null;
  contact_count: number;
}

interface VcContact {
  id: string;
  firm_id: string;
  linkedin_url: string;
  full_name: string;
  title: string;
  avatar_url: string | null;
  followers_count: number | null;
  last_post_date: string | null;
  last_post_content: string | null;
  is_active: boolean;
  vc_firms: { name: string; focus_areas: string[] | null } | null;
  vc_outreach: { id: string; status: string; dm_text: string | null; notes: string | null }[] | null;
}

const DEFAULT_KEYWORDS = [
  "venture capital AI",
  "blockchain fund",
  "crypto VC",
  "deep tech investor",
  "early stage AI",
];

const TITLE_PRESETS = ["GP", "MP", "Partner", "Principal", "Associate", "Venture Partner"];

const STATUS_COLORS: Record<string, string> = {
  to_contact: "bg-[#333] text-[#999]",
  contacted: "bg-[#2563EB]/20 text-[#60A5FA]",
  replied: "bg-[#059669]/20 text-[#34D399]",
  not_interested: "bg-red-500/20 text-red-400",
};

const STATUS_LABELS: Record<string, string> = {
  to_contact: "To Contact",
  contacted: "Contacted",
  replied: "Replied",
  not_interested: "Not Interested",
};

export default function VcOutreachPage() {
  // Firms state
  const [firms, setFirms] = useState<VcFirm[]>([]);
  const [firmsOpen, setFirmsOpen] = useState(true);
  const [searchTab, setSearchTab] = useState<"search" | "urls">("search");
  const [keywords, setKeywords] = useState<string[]>([...DEFAULT_KEYWORDS]);
  const [customKeyword, setCustomKeyword] = useState("");
  const [maxResults, setMaxResults] = useState(10);
  const [urlsText, setUrlsText] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  // Scrape people state
  const [selectedFirmIds, setSelectedFirmIds] = useState<Set<string>>(new Set());
  const [titleFilters, setTitleFilters] = useState<Set<string>>(new Set(["Partner", "Principal"]));
  const [customTitle, setCustomTitle] = useState("");
  const [scrapeLoading, setScrapeLoading] = useState<string | null>(null);

  // Contacts state
  const [contacts, setContacts] = useState<VcContact[]>([]);
  const [contactFirmFilter, setContactFirmFilter] = useState("");
  const [activeOnly, setActiveOnly] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [titleSearch, setTitleSearch] = useState("");

  // DM modal
  const [dmContact, setDmContact] = useState<VcContact | null>(null);

  // Error
  const [error, setError] = useState("");

  const fetchFirms = useCallback(async () => {
    try {
      const res = await fetch("/api/vc/firms");
      if (res.ok) setFirms(await res.json());
    } catch { /* ignore */ }
  }, []);

  const fetchContacts = useCallback(async () => {
    const params = new URLSearchParams();
    if (contactFirmFilter) params.set("firm_id", contactFirmFilter);
    if (activeOnly) params.set("is_active", "true");
    if (titleSearch) params.set("title_filter", titleSearch);
    if (statusFilter !== "all") params.set("status", statusFilter);

    try {
      const res = await fetch(`/api/vc/contacts?${params}`);
      if (res.ok) setContacts(await res.json());
    } catch { /* ignore */ }
  }, [contactFirmFilter, activeOnly, titleSearch, statusFilter]);

  useEffect(() => {
    fetchFirms();
  }, [fetchFirms]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Auto-collapse firms section if firms exist
  useEffect(() => {
    if (firms.length > 0) setFirmsOpen(false);
  }, [firms.length]);

  async function handleSearchFirms() {
    if (!keywords.length) return;
    setSearchLoading(true);
    setError("");
    try {
      const res = await fetch("/api/vc/search-firms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords, max_results: maxResults }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await fetchFirms();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setSearchLoading(false);
    }
  }

  async function handleAddUrls() {
    const urls = urlsText.split("\n").map((u) => u.trim()).filter(Boolean);
    if (!urls.length) return;
    setAddLoading(true);
    setError("");
    try {
      const res = await fetch("/api/vc/add-firms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkedin_urls: urls }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUrlsText("");
      await fetchFirms();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add firms");
    } finally {
      setAddLoading(false);
    }
  }

  async function handleScrapePeople(firmIds: string[]) {
    if (!firmIds.length || !titleFilters.size) return;
    const loadingKey = firmIds.join(",");
    setScrapeLoading(loadingKey);
    setError("");
    try {
      const res = await fetch("/api/vc/scrape-people", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firm_ids: firmIds,
          titles: Array.from(titleFilters),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await fetchContacts();
      await fetchFirms();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to scrape people");
    } finally {
      setScrapeLoading(null);
    }
  }

  function toggleFirmSelection(id: string) {
    setSelectedFirmIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleKeyword(kw: string) {
    setKeywords((prev) =>
      prev.includes(kw) ? prev.filter((k) => k !== kw) : [...prev, kw]
    );
  }

  function addCustomKeyword() {
    if (customKeyword.trim() && !keywords.includes(customKeyword.trim())) {
      setKeywords((prev) => [...prev, customKeyword.trim()]);
      setCustomKeyword("");
    }
  }

  function toggleTitle(title: string) {
    setTitleFilters((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  }

  return (
    <div className="flex h-screen bg-[#0A0A0A]">
      {/* Left nav */}
      <aside className="w-14 border-r border-[#1E1E1E] bg-[#0A0A0A] flex flex-col items-center py-4 gap-4">
        <Link
          href="/"
          className="w-9 h-9 rounded-lg bg-[#1E1E1E] flex items-center justify-center text-[#666] hover:text-[#F1F1F1] hover:bg-[#252525] transition-colors"
          title="Content Engine"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
          </svg>
        </Link>
        <div
          className="w-9 h-9 rounded-lg bg-[#DA4E24]/20 flex items-center justify-center text-[#DA4E24]"
          title="VC Outreach"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          {/* Page header */}
          <div>
            <h1 className="text-2xl font-bold text-[#F1F1F1]">VC Outreach Pipeline</h1>
            <p className="text-sm text-[#666] mt-1">Find VC firms, scrape decision-makers, generate personalized DMs</p>
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
              {error}
              <button onClick={() => setError("")} className="ml-3 text-red-300 underline">dismiss</button>
            </div>
          )}

          {/* SECTION 1: Find Firms */}
          <section className="bg-[#111111] border border-[#1E1E1E] rounded-xl overflow-hidden">
            <button
              onClick={() => setFirmsOpen(!firmsOpen)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-semibold text-[#F1F1F1]">Find Firms</h2>
                <span className="text-xs text-[#666]">{firms.length} firms</span>
              </div>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className={`text-[#666] transition-transform ${firmsOpen ? "rotate-180" : ""}`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {firmsOpen && (
              <div className="border-t border-[#1E1E1E] p-4 space-y-4">
                {/* Tabs */}
                <div className="flex gap-1 bg-[#0A0A0A] rounded-lg p-1 w-fit">
                  <button
                    onClick={() => setSearchTab("search")}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      searchTab === "search" ? "bg-[#1E1E1E] text-[#F1F1F1]" : "text-[#666] hover:text-[#999]"
                    }`}
                  >
                    Search
                  </button>
                  <button
                    onClick={() => setSearchTab("urls")}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      searchTab === "urls" ? "bg-[#1E1E1E] text-[#F1F1F1]" : "text-[#666] hover:text-[#999]"
                    }`}
                  >
                    Add URLs
                  </button>
                </div>

                {searchTab === "search" ? (
                  <div className="space-y-3">
                    {/* Keyword chips */}
                    <div className="flex flex-wrap gap-2">
                      {DEFAULT_KEYWORDS.map((kw) => (
                        <button
                          key={kw}
                          onClick={() => toggleKeyword(kw)}
                          className={`px-3 py-1 rounded-full text-xs transition-colors ${
                            keywords.includes(kw)
                              ? "bg-[#DA4E24]/20 text-[#DA4E24] border border-[#DA4E24]/30"
                              : "bg-[#1E1E1E] text-[#666] border border-[#333] hover:text-[#999]"
                          }`}
                        >
                          {kw}
                        </button>
                      ))}
                      {keywords.filter((k) => !DEFAULT_KEYWORDS.includes(k)).map((kw) => (
                        <button
                          key={kw}
                          onClick={() => toggleKeyword(kw)}
                          className="px-3 py-1 rounded-full text-xs bg-[#DA4E24]/20 text-[#DA4E24] border border-[#DA4E24]/30"
                        >
                          {kw} &times;
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customKeyword}
                        onChange={(e) => setCustomKeyword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addCustomKeyword()}
                        placeholder="Add custom keyword..."
                        className="flex-1 px-3 py-1.5 bg-[#0A0A0A] border border-[#1E1E1E] rounded-lg text-xs text-[#F1F1F1] focus:outline-none focus:border-[#DA4E24]"
                      />
                      <select
                        value={maxResults}
                        onChange={(e) => setMaxResults(Number(e.target.value))}
                        className="px-2 py-1.5 bg-[#0A0A0A] border border-[#1E1E1E] rounded-lg text-xs text-[#F1F1F1]"
                      >
                        <option value={10}>10 results</option>
                        <option value={25}>25 results</option>
                        <option value={50}>50 results</option>
                      </select>
                      <button
                        onClick={handleSearchFirms}
                        disabled={searchLoading || !keywords.length}
                        className="px-4 py-1.5 bg-[#DA4E24] text-white rounded-lg text-xs font-medium hover:bg-[#DA4E24]/90 disabled:opacity-50"
                      >
                        {searchLoading ? "Searching..." : "Search Firms"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <textarea
                      value={urlsText}
                      onChange={(e) => setUrlsText(e.target.value)}
                      rows={4}
                      placeholder="Paste LinkedIn company URLs (one per line)&#10;https://linkedin.com/company/sequoia-capital&#10;https://linkedin.com/company/a16z"
                      className="w-full bg-[#0A0A0A] border border-[#1E1E1E] rounded-lg p-3 text-xs text-[#F1F1F1] resize-none focus:outline-none focus:border-[#DA4E24] font-mono"
                    />
                    <button
                      onClick={handleAddUrls}
                      disabled={addLoading || !urlsText.trim()}
                      className="px-4 py-1.5 bg-[#DA4E24] text-white rounded-lg text-xs font-medium hover:bg-[#DA4E24]/90 disabled:opacity-50"
                    >
                      {addLoading ? "Adding..." : "Add Firms"}
                    </button>
                  </div>
                )}

                {/* Title filter for scraping */}
                {firms.length > 0 && (
                  <div className="pt-3 border-t border-[#1E1E1E]">
                    <p className="text-xs text-[#666] mb-2">Title filter for scraping:</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {TITLE_PRESETS.map((t) => (
                        <button
                          key={t}
                          onClick={() => toggleTitle(t)}
                          className={`px-2.5 py-1 rounded text-xs transition-colors ${
                            titleFilters.has(t)
                              ? "bg-[#7C3AED]/20 text-[#A78BFA] border border-[#7C3AED]/30"
                              : "bg-[#1E1E1E] text-[#666] border border-[#333]"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                      <div className="flex gap-1">
                        <input
                          type="text"
                          value={customTitle}
                          onChange={(e) => setCustomTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && customTitle.trim()) {
                              toggleTitle(customTitle.trim());
                              setCustomTitle("");
                            }
                          }}
                          placeholder="Custom title..."
                          className="px-2 py-1 bg-[#0A0A0A] border border-[#1E1E1E] rounded text-xs text-[#F1F1F1] w-28 focus:outline-none focus:border-[#DA4E24]"
                        />
                      </div>
                    </div>

                    {selectedFirmIds.size > 0 && (
                      <button
                        onClick={() => handleScrapePeople(Array.from(selectedFirmIds))}
                        disabled={scrapeLoading !== null}
                        className="px-4 py-1.5 bg-[#7C3AED] text-white rounded-lg text-xs font-medium hover:bg-[#7C3AED]/90 disabled:opacity-50 mb-3"
                      >
                        {scrapeLoading ? "Scraping..." : `Scrape Selected (${selectedFirmIds.size})`}
                      </button>
                    )}
                  </div>
                )}

                {/* Firms list */}
                {firms.length > 0 && (
                  <div className="space-y-2">
                    {firms.map((firm) => (
                      <div
                        key={firm.id}
                        className="flex items-center gap-3 bg-[#0A0A0A] rounded-lg p-3 group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFirmIds.has(firm.id)}
                          onChange={() => toggleFirmSelection(firm.id)}
                          className="accent-[#DA4E24]"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-[#F1F1F1] truncate">{firm.name}</p>
                            {firm.contact_count > 0 && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#059669]/20 text-[#34D399]">
                                {firm.contact_count} contacts
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            {firm.focus_areas?.slice(0, 3).map((area) => (
                              <span key={area} className="text-[10px] px-1.5 py-0.5 rounded bg-[#1E1E1E] text-[#666]">
                                {area}
                              </span>
                            ))}
                            {firm.location && <span className="text-[10px] text-[#666]">{firm.location}</span>}
                            {firm.employee_count && <span className="text-[10px] text-[#666]">{firm.employee_count} employees</span>}
                          </div>
                        </div>
                        <button
                          onClick={() => handleScrapePeople([firm.id])}
                          disabled={scrapeLoading !== null}
                          className="px-3 py-1.5 bg-[#1E1E1E] text-[#999] rounded text-xs hover:text-[#F1F1F1] hover:bg-[#252525] transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                        >
                          {scrapeLoading === firm.id ? "Scraping..." : "Scrape People"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* SECTION 2: Contacts */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[#F1F1F1]">
                Contacts <span className="text-[#666] font-normal">({contacts.length})</span>
              </h2>
            </div>

            {/* Filter bar */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <select
                value={contactFirmFilter}
                onChange={(e) => setContactFirmFilter(e.target.value)}
                className="px-3 py-1.5 bg-[#111] border border-[#1E1E1E] rounded-lg text-xs text-[#F1F1F1]"
              >
                <option value="">All Firms</option>
                {firms.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>

              <button
                onClick={() => setActiveOnly(!activeOnly)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeOnly
                    ? "bg-[#059669]/20 text-[#34D399] border border-[#059669]/30"
                    : "bg-[#1E1E1E] text-[#666] border border-[#333]"
                }`}
              >
                Active Only
              </button>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-[#111] border border-[#1E1E1E] rounded-lg text-xs text-[#F1F1F1]"
              >
                <option value="all">All Statuses</option>
                <option value="to_contact">To Contact</option>
                <option value="contacted">Contacted</option>
                <option value="replied">Replied</option>
                <option value="not_interested">Not Interested</option>
              </select>

              <input
                type="text"
                value={titleSearch}
                onChange={(e) => setTitleSearch(e.target.value)}
                placeholder="Search title..."
                className="px-3 py-1.5 bg-[#111] border border-[#1E1E1E] rounded-lg text-xs text-[#F1F1F1] w-40 focus:outline-none focus:border-[#DA4E24]"
              />
            </div>

            {/* Contact cards grid */}
            {contacts.length === 0 ? (
              <div className="text-center py-12 text-[#666] text-sm">
                {firms.length === 0
                  ? "Add firms first, then scrape their people."
                  : "No contacts found. Scrape people from firms above."}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {contacts.map((contact) => {
                  const outreach = contact.vc_outreach?.[0];
                  const outreachStatus = outreach?.status || "to_contact";
                  const daysAgo = contact.last_post_date
                    ? Math.floor((Date.now() - new Date(contact.last_post_date).getTime()) / 86400000)
                    : null;

                  return (
                    <div
                      key={contact.id}
                      className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-4 hover:border-[#333] transition-colors"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        {contact.avatar_url ? (
                          <img src={contact.avatar_url} alt={contact.full_name} className="w-10 h-10 rounded-full flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#1E1E1E] flex items-center justify-center text-[#666] text-sm flex-shrink-0">
                            {contact.full_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#F1F1F1] truncate">{contact.full_name}</p>
                          <p className="text-xs text-[#999] truncate">{contact.title}</p>
                          <p className="text-xs text-[#666] truncate">{contact.vc_firms?.name}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap ${STATUS_COLORS[outreachStatus]}`}>
                          {STATUS_LABELS[outreachStatus]}
                        </span>
                      </div>

                      {/* Activity */}
                      <div className="flex items-center gap-2 mb-2">
                        {contact.is_active ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#059669]/20 text-[#34D399]">
                            Active {daysAgo !== null ? `${daysAgo}d ago` : ""}
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#333] text-[#666]">Inactive</span>
                        )}
                        {contact.followers_count && (
                          <span className="text-[10px] text-[#666]">{contact.followers_count.toLocaleString()} followers</span>
                        )}
                      </div>

                      {/* Last post */}
                      {contact.last_post_content && (
                        <p className="text-xs text-[#666] italic mb-3 line-clamp-2">
                          {contact.last_post_content.slice(0, 80)}{contact.last_post_content.length > 80 ? "..." : ""}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setDmContact(contact)}
                          className="flex-1 px-3 py-1.5 bg-[#DA4E24] text-white rounded-lg text-xs font-medium hover:bg-[#DA4E24]/90 transition-colors"
                        >
                          Generate DM
                        </button>
                        <button
                          onClick={async () => {
                            if (!outreach?.id) return;
                            await fetch(`/api/vc/outreach/${outreach.id}`, {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ status: "contacted", contacted_at: new Date().toISOString() }),
                            });
                            fetchContacts();
                          }}
                          disabled={outreachStatus === "contacted" || !outreach?.id}
                          className="px-3 py-1.5 bg-[#1E1E1E] text-[#999] rounded-lg text-xs hover:text-[#F1F1F1] hover:bg-[#252525] transition-colors disabled:opacity-50"
                        >
                          Mark Contacted
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* DM Modal */}
      <DmModal
        isOpen={dmContact !== null}
        onClose={() => setDmContact(null)}
        contact={dmContact}
        onStatusChange={fetchContacts}
      />
    </div>
  );
}
