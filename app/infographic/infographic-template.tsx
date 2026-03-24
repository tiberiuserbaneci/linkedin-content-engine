"use client";

/* ─────────────────────────────────────────────────────────
   FOUNDER AI STACK 2026 – LinkedIn Infographic Template
   1080×1350px (4:5 LinkedIn)  ·  Warm light palette
   ───────────────────────────────────────────────────────── */

const C = {
  accent: "#C94A22",
  accentLight: "#F0D6CC",
  dark: "#2D2A26",
  bg: "#FAF8F5",
  text: "#2D2A26",
  muted: "#8A857D",
  border: "#E8E4DE",
  white: "#FFFFFF",
  tagBg: "#F3F0EB",
  tableBg: "#F7F5F1",
  headerBg: "#3D3833",
};

/* ── Shared small components ─────────────────────────── */

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded"
      style={{ background: C.accentLight, color: C.accent }}
    >
      {children}
    </span>
  );
}

function SectionNumber({ n }: { n: string }) {
  return (
    <span
      className="text-[11px] font-bold tracking-widest"
      style={{ color: C.accent }}
    >
      {n}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="text-[15px] font-bold leading-snug mt-1"
      style={{ color: C.text }}
    >
      {children}
    </h3>
  );
}

function SectionSub({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[11px] mt-0.5 mb-3"
      style={{ color: C.accent }}
    >
      {children}
    </p>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-1.5 text-[12px] leading-relaxed mb-1.5">
      <span style={{ color: C.accent }} className="mt-px select-none">
        →
      </span>
      <span style={{ color: C.text }}>{children}</span>
    </div>
  );
}

function FlowArrow() {
  return (
    <span
      className="mx-1.5 text-[11px] select-none"
      style={{ color: C.accent }}
    >
      →
    </span>
  );
}

function MiniIcon({ letter }: { letter: string }) {
  return (
    <span
      className="inline-flex items-center justify-center w-[22px] h-[22px] rounded-full text-[10px] font-bold mr-1.5 shrink-0"
      style={{ background: C.accent, color: C.white }}
    >
      {letter}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN TEMPLATE — 1080 × 1350 px (LinkedIn 4:5)
   ══════════════════════════════════════════════════════════ */

export function InfographicTemplate() {
  return (
    <div
      style={{
        width: 1080,
        height: 1350,
        background: C.bg,
        fontFamily:
          '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* ── TOP BANNER ─────────────────────────────── */}
      <header
        style={{
          background: C.headerBg,
          padding: "40px 48px 32px",
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.25em",
            textTransform: "uppercase" as const,
            color: C.accent,
            marginBottom: 16,
          }}
        >
          Founder AI Stack · 2026
        </p>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <h1
            style={{
              fontSize: 40,
              fontWeight: 800,
              lineHeight: 1.1,
              color: C.white,
              maxWidth: 520,
              margin: 0,
            }}
          >
            7 AI Automations.{" "}
            <span style={{ color: C.accent }}>1 Founder.</span>
          </h1>

          <div style={{ display: "flex", gap: 40, textAlign: "right" as const }}>
            {[
              { value: "$85", label: "Total Cost /mo" },
              { value: "68h", label: "Saved /week" },
              { value: "$0", label: "Human Labor" },
            ].map((m) => (
              <div key={m.label}>
                <p style={{ fontSize: 38, fontWeight: 800, lineHeight: 1, color: C.accent, margin: 0 }}>
                  {m.value}
                </p>
                <p style={{ fontSize: 9, textTransform: "uppercase" as const, letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 12, marginTop: 20, color: "rgba(255,255,255,0.4)" }}>
          Each runs 24/7. No management needed. Built with Claude, n8n, and specialized AI tools.
        </p>
      </header>

      {/* ── 6-SECTION GRID (fills remaining height) ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr auto auto",
          height: 1350 - 190, /* total minus header height */
          background: C.bg,
        }}
      >
        {/* ────── SECTION 1 : R.E.P.L.A.C.E. Philosophy ────── */}
        <section
          style={{
            padding: 28,
            borderBottom: `1px solid ${C.border}`,
            borderRight: `1px solid ${C.border}`,
          }}
        >
          <SectionNumber n="01" />
          <SectionTitle>The R.E.P.L.A.C.E. Philosophy</SectionTitle>
          <SectionSub>Replacing Roles with Expert Code</SectionSub>

          <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
            {[
              { letter: "R", text: "Reliable 24/7 — never calls in sick" },
              { letter: "E", text: "Error-free output — deterministic pipelines" },
              { letter: "P", text: "Profitable from day one — under $85/mo" },
              { letter: "L", text: "Labor-free operations — zero headcount" },
              { letter: "A", text: "Automated workflows — n8n orchestrated" },
              { letter: "C", text: "Claude Opus powered — frontier reasoning" },
              { letter: "E", text: "Expert systems — domain-specific agents" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", fontSize: 12 }}>
                <MiniIcon letter={item.letter} />
                <span style={{ color: C.text }}>{item.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ────── SECTION 2 : Lead Gen & Nurture Flowchart ─── */}
        <section
          style={{
            padding: 28,
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <SectionNumber n="02" />
          <SectionTitle>AI Lead Gen &amp; Nurture Process</SectionTitle>
          <SectionSub>Perfect for SDR + Content roles · Claude + n8n + Cal.com</SectionSub>

          <div style={{ display: "flex", flexDirection: "column" as const, gap: 8, marginBottom: 16 }}>
            {[
              { step: "1. Source Intelligence", desc: "Competitor data → Post ideas" },
              { step: "2. Engage", desc: "Publish LinkedIn posts & send cold outreach" },
              { step: "3. Qualify", desc: "Filter with ICP criteria (budget, urgency, fit)" },
              { step: "4. Convert", desc: "Book only high-intent calls automatically" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12 }}>
                <span
                  style={{
                    flexShrink: 0,
                    width: 22,
                    height: 22,
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    background: C.accentLight,
                    color: C.accent,
                  }}
                >
                  {i + 1}
                </span>
                <div>
                  <span style={{ fontWeight: 600, color: C.dark }}>{s.step}</span>
                  <span style={{ color: C.muted }}> — {s.desc}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Mini visual flow */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap" as const,
              fontSize: 10,
              fontWeight: 600,
              borderRadius: 8,
              padding: "8px 12px",
              background: C.white,
              border: `1px solid ${C.border}`,
              color: C.dark,
            }}
          >
            <span style={{ padding: "2px 8px", borderRadius: 4, background: C.tagBg }}>Post</span>
            <FlowArrow />
            <span style={{ padding: "2px 8px", borderRadius: 4, background: C.tagBg }}>View</span>
            <FlowArrow />
            <span style={{ padding: "2px 8px", borderRadius: 4, background: C.tagBg }}>DM</span>
            <FlowArrow />
            <span style={{ padding: "2px 8px", borderRadius: 4, background: C.tagBg }}>Qualify</span>
            <FlowArrow />
            <span style={{ padding: "2px 8px", borderRadius: 4, background: C.accent, color: C.white }}>
              Call Booked
            </span>
          </div>

          <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
            <Badge>Claude Sonnet 4.6</Badge>
            <Badge>Replaces SDR</Badge>
            <Badge>8-12h saved/wk</Badge>
          </div>
        </section>

        {/* ────── SECTION 3 : Competitor Intelligence Agent ── */}
        <section
          style={{
            padding: 28,
            borderBottom: `1px solid ${C.border}`,
            borderRight: `1px solid ${C.border}`,
          }}
        >
          <SectionNumber n="03" />
          <SectionTitle>Competitor Intelligence Agent</SectionTitle>
          <SectionSub>Replaces Manual Market Research · Perplexity + Claude + n8n</SectionSub>

          <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
            {[
              { step: "Monitor", desc: "Scan 10-20 competitor websites daily" },
              { step: "Detect", desc: "Real-time price & product change detection" },
              { step: "Synthesize", desc: "Weekly brief written by Claude Opus" },
              { step: "Alert", desc: "Urgent Telegram notifications within 1 hour" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12 }}>
                <span style={{ fontSize: 8, marginTop: 3, color: C.accent }}>◉</span>
                <div>
                  <span style={{ fontWeight: 600, color: C.dark }}>{s.step}:</span>{" "}
                  <span style={{ color: C.text }}>{s.desc}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Decision tree */}
          <div
            style={{
              marginTop: 16,
              borderRadius: 8,
              padding: 12,
              fontSize: 11,
              background: C.white,
              border: `1px solid ${C.border}`,
            }}
          >
            <p style={{ fontWeight: 600, marginBottom: 6, color: C.dark, fontSize: 11 }}>
              Alert Decision Tree
            </p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 3, marginLeft: 8, color: C.text }}>
              <span>
                Change detected? →{" "}
                <strong style={{ color: C.accent }}>YES</strong> → Is it pricing? →{" "}
                <strong style={{ color: C.accent }}>Urgent Alert</strong>
              </span>
              <span style={{ paddingLeft: 134 }}>
                → <strong style={{ color: C.muted }}>NO</strong> → Add to weekly digest
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
            <Badge>Claude Opus 4.6</Badge>
            <Badge>5-8h saved/wk</Badge>
          </div>
        </section>

        {/* ────── SECTION 4 : Deal Pipeline Monitor ────────── */}
        <section
          style={{
            padding: 28,
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <SectionNumber n="04" />
          <SectionTitle>Deal Pipeline Monitor</SectionTitle>
          <SectionSub>Your 24/7 Sales-Ops Assistant · Claude + n8n + CRM</SectionSub>

          <Bullet><strong>Scan:</strong> Inbox check 2× daily for stalled deals</Bullet>
          <Bullet><strong>Draft:</strong> Full-context follow-up emails</Bullet>
          <Bullet><strong>Update:</strong> Automatic CRM status updates</Bullet>
          <Bullet><strong>Resurface:</strong> 2-4 cold deals brought back to life weekly</Bullet>

          {/* Pipeline flow */}
          <div
            style={{
              marginTop: 16,
              borderRadius: 8,
              padding: 12,
              background: C.white,
              border: `1px solid ${C.border}`,
            }}
          >
            <p style={{ fontSize: 11, fontWeight: 600, marginBottom: 8, color: C.dark }}>
              Pipeline Flow
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 500, flexWrap: "wrap" as const }}>
              {[
                { label: "New Lead", bg: C.tagBg, color: C.dark },
                { label: "Contacted", bg: C.tagBg, color: C.dark },
                { label: "Proposal", bg: C.accentLight, color: C.accent },
                { label: "Stalled?", bg: "#FEF3C7", color: "#92400E" },
                { label: "Auto Follow-up", bg: C.accent, color: C.white },
                { label: "Won ✓", bg: C.headerBg, color: C.white },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ padding: "2px 8px", borderRadius: 4, background: s.bg, color: s.color }}>
                    {s.label}
                  </span>
                  {i < 5 && <span style={{ fontSize: 9, color: C.accent }}>→</span>}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
            <Badge>Sonnet 4.6</Badge>
            <Badge>Replaces Sales-Ops</Badge>
            <Badge>4-6h saved/wk</Badge>
          </div>
        </section>

        {/* ────── SECTION 5 : Metrics Table ────────────────── */}
        <section
          style={{
            padding: "24px 28px",
            borderBottom: `1px solid ${C.border}`,
            gridColumn: "1 / -1",
          }}
        >
          <SectionNumber n="05" />
          <SectionTitle>The Automation Metrics Panel</SectionTitle>
          <SectionSub>Total Automation Coverage &amp; ROI</SectionSub>

          <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" as const }}>
            <thead>
              <tr style={{ background: C.headerBg, color: C.white }}>
                <th style={{ textAlign: "left" as const, padding: "8px 14px", fontWeight: 600, borderTopLeftRadius: 8 }}>
                  Automation
                </th>
                <th style={{ textAlign: "left" as const, padding: "8px 14px", fontWeight: 600 }}>
                  Replaces Role
                </th>
                <th style={{ textAlign: "center" as const, padding: "8px 14px", fontWeight: 600 }}>
                  Time Saved
                </th>
                <th style={{ textAlign: "right" as const, padding: "8px 14px", fontWeight: 600, borderTopRightRadius: 8 }}>
                  Cost /mo
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Lead Qualifier", role: "SDR / VA manual", time: "8-12h", cost: "~$15" },
                { name: "Competitor Intel", role: "Manual research", time: "5-8h", cost: "~$20" },
                { name: "Content Pipeline", role: "Content writer", time: "6-10h", cost: "~$15" },
                { name: "Cold Outreach", role: "BDR (personalized)", time: "10-15h", cost: "~$10" },
                { name: "Deal Pipeline", role: "Sales-ops manager", time: "4-6h", cost: "~$10" },
                { name: "Support Agent", role: "Support team", time: "8-12h", cost: "~$5" },
                { name: "Health Monitor", role: "DevOps + Monitoring", time: "3-5h", cost: "~$10" },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? C.tableBg : C.white }}>
                  <td style={{ padding: "6px 14px", fontWeight: 600, color: C.text }}>{row.name}</td>
                  <td style={{ padding: "6px 14px", color: C.muted, textDecoration: "line-through" }}>{row.role}</td>
                  <td style={{ padding: "6px 14px", textAlign: "center" as const, fontWeight: 700, color: C.accent }}>{row.time}</td>
                  <td style={{ padding: "6px 14px", textAlign: "right" as const, fontWeight: 600, color: C.dark }}>{row.cost}</td>
                </tr>
              ))}
              <tr style={{ background: C.headerBg, color: C.white }}>
                <td style={{ padding: "8px 14px", fontWeight: 700, borderBottomLeftRadius: 8 }}>TOTAL</td>
                <td style={{ padding: "8px 14px", color: "rgba(255,255,255,0.6)" }}>7 roles replaced</td>
                <td style={{ padding: "8px 14px", textAlign: "center" as const, fontWeight: 700 }}>~68h /wk</td>
                <td style={{ padding: "8px 14px", textAlign: "right" as const, fontWeight: 700, borderBottomRightRadius: 8 }}>~$85 /mo</td>
              </tr>
            </tbody>
          </table>

          <p style={{ fontSize: 10, marginTop: 8, fontStyle: "italic", color: C.muted }}>
            A full-time employee covering the same work costs $4,000–8,000 /month.
          </p>
        </section>

        {/* ────── SECTION 6 : System Health & Security ─────── */}
        <section
          style={{
            padding: "24px 28px",
            gridColumn: "1 / -1",
          }}
        >
          <SectionNumber n="06" />
          <SectionTitle>System Health &amp; Security Monitor</SectionTitle>
          <SectionSub>Base layer for all automations · Sentinel + n8n + Telegram</SectionSub>

          {/* Reliability pyramid */}
          <div style={{ display: "flex", justifyContent: "center", margin: "12px 0" }}>
            <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", width: "100%", maxWidth: 560, gap: 3 }}>
              {/* Top */}
              <div
                style={{
                  width: "50%",
                  borderRadius: "8px 8px 0 0",
                  padding: "10px 16px",
                  textAlign: "center" as const,
                  fontSize: 11,
                  fontWeight: 600,
                  background: C.headerBg,
                  color: C.white,
                }}
              >
                <p style={{ fontSize: 9, textTransform: "uppercase" as const, letterSpacing: "0.15em", marginBottom: 2, opacity: 0.7 }}>
                  Top Level
                </p>
                Weekly churn signals &amp; security audits
              </div>

              {/* Middle */}
              <div
                style={{
                  width: "72%",
                  padding: "10px 16px",
                  textAlign: "center" as const,
                  fontSize: 11,
                  fontWeight: 600,
                  background: C.accent,
                  color: C.white,
                }}
              >
                <p style={{ fontSize: 9, textTransform: "uppercase" as const, letterSpacing: "0.15em", marginBottom: 2, opacity: 0.8 }}>
                  Middle Level
                </p>
                Telegram alerts before clients notice issues
              </div>

              {/* Bottom */}
              <div
                style={{
                  width: "100%",
                  borderRadius: "0 0 8px 8px",
                  padding: "10px 16px",
                  textAlign: "center" as const,
                  fontSize: 11,
                  fontWeight: 600,
                  background: C.accentLight,
                  color: C.dark,
                }}
              >
                <p style={{ fontSize: 9, textTransform: "uppercase" as const, letterSpacing: "0.15em", marginBottom: 2, color: C.muted }}>
                  Foundation
                </p>
                Uptime &amp; health checks every 6h (SSL, Performance, DNS)
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 8 }}>
            <Badge>Claude Opus 4.6</Badge>
            <Badge>Replaces DevOps</Badge>
            <Badge>3-5h saved/wk</Badge>
          </div>
        </section>
      </div>
    </div>
  );
}
