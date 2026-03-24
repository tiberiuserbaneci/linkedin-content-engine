"use client";

/* ─────────────────────────────────────────────────────────
   FOUNDER AI STACK 2026 – LinkedIn Infographic Template
   6-section grid  ·  Green corporate aesthetic
   ───────────────────────────────────────────────────────── */

const GREEN = {
  darkest: "#0B2B1A",
  dark: "#14532D",
  mid: "#166534",
  accent: "#22C55E",
  light: "#BBF7D0",
  lightest: "#F0FDF4",
  white: "#FFFFFF",
  muted: "#6B7280",
  border: "#D1FAE5",
  tableBg: "#ECFDF5",
  tagBg: "#DCFCE7",
  ctaBg: "#15803D",
};

/* ── Shared small components ─────────────────────────── */

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded"
      style={{ background: GREEN.tagBg, color: GREEN.dark }}
    >
      {children}
    </span>
  );
}

function SectionNumber({ n }: { n: string }) {
  return (
    <span
      className="text-xs font-bold tracking-widest"
      style={{ color: GREEN.accent }}
    >
      {n}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="text-[15px] font-bold leading-snug mt-1"
      style={{ color: GREEN.darkest }}
    >
      {children}
    </h3>
  );
}

function SectionSub({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[11px] italic mt-0.5 mb-3"
      style={{ color: GREEN.mid }}
    >
      {children}
    </p>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-1.5 text-[11px] leading-relaxed mb-1">
      <span style={{ color: GREEN.accent }} className="mt-px select-none">
        →
      </span>
      <span style={{ color: GREEN.darkest }}>{children}</span>
    </div>
  );
}

/* ── Flow arrow for section 2 ────────────────────────── */

function FlowArrow() {
  return (
    <span
      className="mx-1 text-[10px] select-none"
      style={{ color: GREEN.accent }}
    >
      →
    </span>
  );
}

/* ── Icon placeholders (simple SVG circles w/ letter) ── */

function MiniIcon({ letter }: { letter: string }) {
  return (
    <span
      className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold mr-1 shrink-0"
      style={{ background: GREEN.accent, color: GREEN.white }}
    >
      {letter}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN TEMPLATE
   ══════════════════════════════════════════════════════════ */

export function InfographicTemplate() {
  return (
    <div
      className="min-h-screen flex items-start justify-center py-8 px-4"
      style={{ background: "#E8F5E9" }}
    >
      {/* Card – fixed width to approximate LinkedIn image ratio */}
      <div
        className="w-full max-w-[820px] shadow-2xl rounded-xl overflow-hidden"
        style={{ background: GREEN.white }}
      >
        {/* ── TOP BANNER ─────────────────────────────── */}
        <header
          className="px-8 pt-8 pb-6"
          style={{
            background: `linear-gradient(135deg, ${GREEN.darkest} 0%, ${GREEN.dark} 100%)`,
          }}
        >
          <p
            className="text-[10px] font-semibold tracking-[0.25em] uppercase mb-3"
            style={{ color: GREEN.accent }}
          >
            Founder AI Stack · 2026
          </p>

          <div className="flex items-end justify-between flex-wrap gap-4">
            <h1 className="text-[28px] md:text-[34px] font-extrabold leading-[1.1] text-white max-w-[420px]">
              7 automations{" "}
              <span style={{ color: GREEN.accent }}>replacing</span>
              <br />
              full-time hires
            </h1>

            {/* Key metrics */}
            <div className="flex gap-6 text-right">
              {[
                { value: "$85", label: "Total Cost /mo" },
                { value: "68h", label: "Saved /week" },
                { value: "$0", label: "Human Labor" },
              ].map((m) => (
                <div key={m.label}>
                  <p
                    className="text-[32px] font-extrabold leading-none"
                    style={{ color: GREEN.accent }}
                  >
                    {m.value}
                  </p>
                  <p className="text-[9px] uppercase tracking-widest text-white/60 mt-1">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] mt-4 text-white/50 max-w-[480px]">
            Each runs 24/7. No management needed. Built with Claude, n8n, and
            specialized AI tools.
          </p>
        </header>

        {/* ── GRID BODY ──────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* ────── SECTION 1 : R.E.P.L.A.C.E. Philosophy ────── */}
          <section
            className="p-6 border-b border-r"
            style={{ borderColor: GREEN.border }}
          >
            <SectionNumber n="01" />
            <SectionTitle>The R.E.P.L.A.C.E. Philosophy</SectionTitle>
            <SectionSub>Replacing Roles with Expert Code</SectionSub>

            <div className="space-y-2">
              {[
                {
                  letter: "R",
                  text: "Reliable 24/7 — never calls in sick",
                },
                {
                  letter: "E",
                  text: "Error-free output — deterministic pipelines",
                },
                {
                  letter: "P",
                  text: "Profitable from day one — under $85/mo",
                },
                {
                  letter: "L",
                  text: "Labor-free operations — zero headcount",
                },
                {
                  letter: "A",
                  text: "Automated workflows — n8n orchestrated",
                },
                {
                  letter: "C",
                  text: "Claude Opus powered — frontier reasoning",
                },
                {
                  letter: "E",
                  text: "Expert systems — domain-specific agents",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center text-[11px]">
                  <MiniIcon letter={item.letter} />
                  <span style={{ color: GREEN.darkest }}>{item.text}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ────── SECTION 2 : Lead Gen & Nurture Flowchart ─── */}
          <section
            className="p-6 border-b"
            style={{ borderColor: GREEN.border }}
          >
            <SectionNumber n="02" />
            <SectionTitle>AI Lead Gen &amp; Nurture Process</SectionTitle>
            <SectionSub>
              Perfect for SDR + Content roles · Claude + n8n + Cal.com
            </SectionSub>

            {/* Flowchart steps */}
            <div className="space-y-2 mb-4">
              {[
                {
                  step: "1. Source Intelligence",
                  desc: "Competitor data → Post ideas",
                },
                {
                  step: "2. Engage",
                  desc: "Publish LinkedIn posts & send cold outreach",
                },
                {
                  step: "3. Qualify",
                  desc: "Filter with ICP criteria (budget, urgency, fit)",
                },
                {
                  step: "4. Convert",
                  desc: "Book only high-intent calls automatically",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-[11px]"
                >
                  <span
                    className="shrink-0 w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold"
                    style={{
                      background: GREEN.tagBg,
                      color: GREEN.dark,
                    }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <span
                      className="font-semibold"
                      style={{ color: GREEN.dark }}
                    >
                      {s.step}
                    </span>
                    <span style={{ color: GREEN.muted }}> — {s.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Mini visual flow */}
            <div
              className="flex items-center flex-wrap text-[9px] font-semibold rounded-lg px-3 py-2"
              style={{ background: GREEN.lightest, color: GREEN.dark }}
            >
              <span className="px-1.5 py-0.5 rounded" style={{ background: GREEN.tagBg }}>Post</span>
              <FlowArrow />
              <span className="px-1.5 py-0.5 rounded" style={{ background: GREEN.tagBg }}>View</span>
              <FlowArrow />
              <span className="px-1.5 py-0.5 rounded" style={{ background: GREEN.tagBg }}>DM</span>
              <FlowArrow />
              <span className="px-1.5 py-0.5 rounded" style={{ background: GREEN.tagBg }}>Qualify</span>
              <FlowArrow />
              <span className="px-1.5 py-0.5 rounded" style={{ background: GREEN.accent, color: GREEN.white }}>
                Call Booked
              </span>
            </div>

            <div className="flex gap-2 mt-3">
              <Badge>Claude Sonnet 4.6</Badge>
              <Badge>Replaces SDR</Badge>
              <Badge>8-12h saved/wk</Badge>
            </div>
          </section>

          {/* ────── SECTION 3 : Competitor Intelligence Agent ── */}
          <section
            className="p-6 border-b border-r"
            style={{ borderColor: GREEN.border }}
          >
            <SectionNumber n="03" />
            <SectionTitle>Competitor Intelligence Agent</SectionTitle>
            <SectionSub>
              Replaces Manual Market Research · Perplexity + Claude + n8n
            </SectionSub>

            {/* Decision-tree style */}
            <div className="space-y-2">
              {[
                {
                  icon: "🔍",
                  step: "Monitor",
                  desc: "Scan 10-20 competitor websites daily",
                },
                {
                  icon: "⚡",
                  step: "Detect",
                  desc: "Real-time price & product change detection",
                },
                {
                  icon: "📊",
                  step: "Synthesize",
                  desc: "Weekly brief written by Claude Opus",
                },
                {
                  icon: "🔔",
                  step: "Alert",
                  desc: "Urgent Telegram notifications within 1 hour",
                },
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px]">
                  <span className="text-sm">{s.icon}</span>
                  <div>
                    <span
                      className="font-semibold"
                      style={{ color: GREEN.dark }}
                    >
                      {s.step}:
                    </span>{" "}
                    <span style={{ color: GREEN.darkest }}>{s.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Decision tree mini */}
            <div
              className="mt-4 rounded-lg p-3 text-[10px]"
              style={{ background: GREEN.lightest }}
            >
              <p className="font-semibold mb-1" style={{ color: GREEN.dark }}>
                Alert Decision Tree
              </p>
              <div className="flex flex-col gap-1 ml-2" style={{ color: GREEN.darkest }}>
                <span>
                  Change detected? →{" "}
                  <strong style={{ color: GREEN.mid }}>YES</strong> → Is it
                  pricing? →{" "}
                  <strong style={{ color: GREEN.accent }}>Urgent Alert</strong>
                </span>
                <span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→{" "}
                  <strong style={{ color: GREEN.muted }}>NO</strong> → Add to
                  weekly digest
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <Badge>Claude Opus 4.6</Badge>
              <Badge>5-8h saved/wk</Badge>
            </div>
          </section>

          {/* ────── SECTION 4 : Deal Pipeline Monitor ────────── */}
          <section
            className="p-6 border-b"
            style={{ borderColor: GREEN.border }}
          >
            <SectionNumber n="04" />
            <SectionTitle>Deal Pipeline Monitor</SectionTitle>
            <SectionSub>
              Your 24/7 Sales-Ops Assistant · Claude + n8n + CRM
            </SectionSub>

            <div className="space-y-1.5">
              <Bullet>
                <strong>Scan:</strong> Inbox check 2× daily for stalled deals
              </Bullet>
              <Bullet>
                <strong>Draft:</strong> Full-context follow-up emails
              </Bullet>
              <Bullet>
                <strong>Update:</strong> Automatic CRM status updates
              </Bullet>
              <Bullet>
                <strong>Resurface:</strong> 2-4 cold deals brought back to life
                weekly
              </Bullet>
            </div>

            {/* Mini pipeline visual */}
            <div
              className="mt-4 rounded-lg p-3"
              style={{ background: GREEN.lightest }}
            >
              <p
                className="text-[10px] font-semibold mb-2"
                style={{ color: GREEN.dark }}
              >
                Pipeline Flow
              </p>
              <div className="flex items-center gap-1 text-[9px] font-medium flex-wrap">
                {[
                  { label: "New Lead", bg: GREEN.tagBg, color: GREEN.dark },
                  { label: "Contacted", bg: GREEN.tagBg, color: GREEN.dark },
                  { label: "Proposal", bg: GREEN.light, color: GREEN.dark },
                  { label: "Stalled?", bg: "#FEF3C7", color: "#92400E" },
                  {
                    label: "Auto Follow-up",
                    bg: GREEN.accent,
                    color: GREEN.white,
                  },
                  { label: "Won ✓", bg: GREEN.dark, color: GREEN.white },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span
                      className="px-2 py-0.5 rounded"
                      style={{ background: s.bg, color: s.color }}
                    >
                      {s.label}
                    </span>
                    {i < 5 && (
                      <span
                        className="text-[8px]"
                        style={{ color: GREEN.accent }}
                      >
                        →
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <Badge>Sonnet 4.6</Badge>
              <Badge>Replaces Sales-Ops</Badge>
              <Badge>4-6h saved/wk</Badge>
            </div>
          </section>

          {/* ────── SECTION 5 : Metrics Table ────────────────── */}
          <section
            className="p-6 border-b md:col-span-2"
            style={{ borderColor: GREEN.border }}
          >
            <SectionNumber n="05" />
            <SectionTitle>The Automation Metrics Panel</SectionTitle>
            <SectionSub>Total Automation Coverage &amp; ROI</SectionSub>

            <div className="overflow-x-auto">
              <table className="w-full text-[11px] border-collapse">
                <thead>
                  <tr
                    style={{
                      background: GREEN.dark,
                      color: GREEN.white,
                    }}
                  >
                    <th className="text-left px-3 py-2 rounded-tl-lg font-semibold">
                      Automation
                    </th>
                    <th className="text-left px-3 py-2 font-semibold">
                      Replaces Role
                    </th>
                    <th className="text-center px-3 py-2 font-semibold">
                      Time Saved
                    </th>
                    <th className="text-right px-3 py-2 rounded-tr-lg font-semibold">
                      Cost /mo
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      name: "Lead Qualifier",
                      role: "SDR / VA manual",
                      time: "8-12h",
                      cost: "~$15",
                    },
                    {
                      name: "Competitor Intel",
                      role: "Manual research",
                      time: "5-8h",
                      cost: "~$20",
                    },
                    {
                      name: "Content Pipeline",
                      role: "Content writer",
                      time: "6-10h",
                      cost: "~$15",
                    },
                    {
                      name: "Cold Outreach",
                      role: "BDR (personalized)",
                      time: "10-15h",
                      cost: "~$10",
                    },
                    {
                      name: "Deal Pipeline",
                      role: "Sales-ops manager",
                      time: "4-6h",
                      cost: "~$10",
                    },
                    {
                      name: "Support Agent",
                      role: "Support team",
                      time: "8-12h",
                      cost: "~$5",
                    },
                    {
                      name: "Health Monitor",
                      role: "DevOps + Monitoring",
                      time: "3-5h",
                      cost: "~$10",
                    },
                  ].map((row, i) => (
                    <tr
                      key={i}
                      style={{
                        background:
                          i % 2 === 0 ? GREEN.tableBg : GREEN.white,
                      }}
                    >
                      <td
                        className="px-3 py-2 font-semibold"
                        style={{ color: GREEN.darkest }}
                      >
                        {row.name}
                      </td>
                      <td className="px-3 py-2" style={{ color: GREEN.muted }}>
                        <span className="line-through">{row.role}</span>
                      </td>
                      <td
                        className="px-3 py-2 text-center font-bold"
                        style={{ color: GREEN.accent }}
                      >
                        {row.time}
                      </td>
                      <td
                        className="px-3 py-2 text-right font-semibold"
                        style={{ color: GREEN.dark }}
                      >
                        {row.cost}
                      </td>
                    </tr>
                  ))}
                  {/* Totals row */}
                  <tr
                    style={{
                      background: GREEN.dark,
                      color: GREEN.white,
                    }}
                  >
                    <td className="px-3 py-2 font-bold rounded-bl-lg">
                      TOTAL
                    </td>
                    <td className="px-3 py-2 text-white/60">
                      7 roles replaced
                    </td>
                    <td className="px-3 py-2 text-center font-bold">
                      ~68h /wk
                    </td>
                    <td className="px-3 py-2 text-right font-bold rounded-br-lg">
                      ~$85 /mo
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p
              className="text-[10px] mt-3 italic"
              style={{ color: GREEN.muted }}
            >
              A full-time employee covering the same work costs $4,000–8,000
              /month.
            </p>
          </section>

          {/* ────── SECTION 6 : System Health & Security ─────── */}
          <section
            className="p-6 md:col-span-2"
            style={{ borderColor: GREEN.border }}
          >
            <SectionNumber n="06" />
            <SectionTitle>System Health &amp; Security Monitor</SectionTitle>
            <SectionSub>
              Base layer for all automations · Sentinel + n8n + Telegram
            </SectionSub>

            {/* Reliability pyramid */}
            <div className="flex justify-center my-4">
              <div className="flex flex-col items-center w-full max-w-[480px] gap-1">
                {/* Top */}
                <div
                  className="w-[55%] rounded-t-lg px-4 py-3 text-center text-[10px] font-semibold"
                  style={{ background: GREEN.dark, color: GREEN.white }}
                >
                  <p className="text-[9px] uppercase tracking-widest mb-0.5 opacity-70">
                    Top Level
                  </p>
                  Weekly churn signals &amp; security audits
                </div>

                {/* Middle */}
                <div
                  className="w-[75%] px-4 py-3 text-center text-[10px] font-semibold"
                  style={{ background: GREEN.mid, color: GREEN.white }}
                >
                  <p className="text-[9px] uppercase tracking-widest mb-0.5 opacity-70">
                    Middle Level
                  </p>
                  Telegram alerts before clients notice issues
                </div>

                {/* Bottom */}
                <div
                  className="w-full rounded-b-lg px-4 py-3 text-center text-[10px] font-semibold"
                  style={{ background: GREEN.accent, color: GREEN.darkest }}
                >
                  <p className="text-[9px] uppercase tracking-widest mb-0.5 opacity-80">
                    Foundation
                  </p>
                  Uptime &amp; health checks every 6h (SSL, Performance, DNS)
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-center mt-2">
              <Badge>Claude Opus 4.6</Badge>
              <Badge>Replaces DevOps</Badge>
              <Badge>3-5h saved/wk</Badge>
            </div>
          </section>
        </div>

        {/* ── BOTTOM CTA BANNER ──────────────────────── */}
        <footer
          className="px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ background: GREEN.ctaBg }}
        >
          <div>
            <p className="text-[13px] font-bold text-white">
              All 7 run in parallel. Under $85/month total.
            </p>
            <p className="text-[10px] text-white/70 mt-0.5">
              Built by a solo founder — no team, no payroll, just AI agents.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-white/60">Created by</p>
              <p className="text-[11px] font-semibold text-white">
                @YourHandle
              </p>
            </div>
            <a
              href="#"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-[12px] font-bold transition-transform hover:scale-105"
              style={{
                background: GREEN.white,
                color: GREEN.dark,
              }}
            >
              Get the Full Blueprint →
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
