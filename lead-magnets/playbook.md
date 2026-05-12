# Lead Magnet 2 — "Your First AI Employee. Then Five More."

**Format:** Premium founder playbook. Dense, tactical, authoritative.
**Audience:** Advanced ICP — founders and GTM builders already running AI in production.
**CTA:** "The platform running this → Ultron"
**VIRALS Score: 11/12** — V:2 I:2 R:2 A:2 L:2 S:1

---

## Cover

**Headline:** Your First AI Employee. Then Five More.
**Sub-headline:** A founder's guide to deploying a multi-agent AI OS — not a chatbot, not a workflow tool. A system that runs your business while you run your business.
**Visual note:** Dark, minimal. Ultron logo. No stock photos.

---

## Introduction: The AI Tool Problem

You've hired help that needs constant supervision.

That's the real cost of using AI tools without a system. You prompt, you review, you copy-paste, you prompt again. You've outsourced the typing but not the work.

An AI employee is different from an AI tool in one fundamental way: it runs a loop. It wakes up, checks for assigned tasks, executes with live data, logs every action, stores what it learns, and goes back to sleep. You didn't trigger it. You don't have to manage it mid-run. You review the output.

This playbook covers 5 functional roles — each one a full loop, each one a real part of your business. Read through all 5. Deploy in the order listed. The output of each one feeds the next.

---

## The Core Loop (Read This Before Anything Else)

Every AI employee in this system runs the same lifecycle. Understanding the loop is understanding the whole system.

**1. Heartbeat on start**
The module signals that it's active. The dashboard shows it as running. This is the accountability mechanism — you can always see what's awake and what isn't.

**2. Task check**
The module checks its assigned task queue. No tasks? It logs one line — "standby: no tasks" — sets its status to sleeping, and stops. It does not freelance. It does not decide what to work on independently.

**3. External data pull**
Before writing a single word or taking any action, the module makes at least 3 live API calls. Web search. Scraping. Browser. No training data. Real sources only.

**4. Execution with logging**
The module works through the task and logs every step to the activity feed. Not a summary at the end. Each action, as it happens. You can watch the run in real time.

**5. Memory write**
After every run, the module saves key findings to long-term memory with tags. Next run, it reads those memories before starting. The system compounds. Mistakes become lessons. Findings become context.

**6. Human gate**
For outreach, content, and any public-facing output: the module drafts and drops to a review queue. Nothing goes out until a human approves. This is not a safety theater — it's how trust gets built with any system, human or AI.

**7. Heartbeat on finish**
Module signals sleeping. Task closes. Metrics update. You come back to a clean dashboard and a review queue.

That's the loop. Every module below runs it.

---

## Role 1 — The Research Employee

**Job title:** Research Lead
**What they own:** Market intelligence, prospect research, competitor tracking, assumption validation
**When they work:** Hourly or on-demand — every time something needs to be verified before money or time is spent

**The loop in practice:**

The research module wakes up and checks its task queue. It finds a task: "Find 15 B2B SaaS founders in fintech who posted about outreach problems in the last 7 days."

It runs 3 Brave Search queries. Pulls LinkedIn post data from Apify. Cross-references against your ICP criteria. Scores each result 1-10. Returns a structured lead list with company, name, title, recent post, and score.

It saves all findings to memory with tags: ["research", "leads", "fintech", "Q2-2026"]. Creates a new task: "Outreach campaign: 9 fintech leads, ICP score 8+" and assigns it to the outreach module.

Then it sleeps.

**What you review:** The scored lead list. You can add notes, reject leads, or adjust ICP criteria for the next run.

**What it can't do without you:** Change the ICP definition. Access private databases. Commit to an outreach action.

**Memory advantage:** After 10+ runs, the research module has a working model of your ICP built from real sourced data — not your initial assumption. It gets better at scoring because it sees which leads converted.

---

## Role 2 — The Outreach Employee

**Job title:** Outreach Operator
**What they own:** Cold email campaigns, DM sequences, follow-up cadences, reply tracking
**When they work:** Twice daily — once to send new outreach, once to process replies and trigger follow-ups

**The loop in practice:**

The outreach module picks up the task created by the research module. It reads the 9 lead profiles from memory. For each one, it writes a personalized cold email:

- Subject line: specific reference to their last post or product (under 6 words)
- Line 1: one observation about their business that proves you did research
- Body: 3 sentences — their problem, your solution, one proof point
- CTA: one ask, under 15 words
- Total: under 150 words

All 9 emails drop into the review queue. The module logs: "9 drafts in queue for approval."

It waits.

**What you review:** 9 email drafts. You approve, edit, or reject each one. Approved emails get sent. Rejected ones get a note and go back for revision.

**The 95/5 rule:** 95% of the email is about the prospect. 5% is about you. The research module makes this possible. Without research context, outreach becomes generic.

**Follow-up sequence:** 3 follow-ups at day 3, 5, and 7. Each adds new value or changes angle. Never "just following up." The module tracks which angle got replies and updates its memory.

**What it can't do without you:** Send without approval. Scrape contact lists. Send to unverified emails.

---

## Role 3 — The Sales Employee

**Job title:** Deal Closer
**What they own:** Warm lead qualification, proposal generation, objection handling, deal pipeline
**When they work:** Every 2 hours during business days — tracks open deals, sends follow-ups, updates stages

**The loop in practice:**

A lead replies to an outreach email with interest. The outreach module flags it and creates a new task: "Qualify and follow up: [Name] at [Company] — replied positively."

The sales module picks it up. It reads the research module's lead profile from memory. Checks the conversation history. Drafts a discovery response: acknowledges their specific point, answers directly, bridges to one question that moves the deal forward.

If a call gets booked, it creates a discovery prep document: company background, known pain points, likely objections, suggested pricing tier.

After the call, it drafts a follow-up email with a proposal outline. Drops it in the review queue.

**What you review:** Discovery prep docs, proposal drafts, follow-up sequences. You approve, edit, or flag for revision.

**Objection handling:** The sales module has a working playbook — 5 common objections with tested responses. It uses the playbook and logs which responses worked, building a sharper version over time.

**What it can't do without you:** Change pricing. Sign contracts. Handle deals above your defined value threshold (set your own — e.g., $50k+ requires human closer).

---

## Role 4 — The Content Employee

**Job title:** Content Engine
**What they own:** Social posts, blog drafts, launch content, repurposed assets
**When they work:** Every 4 hours — pulls from research findings and product updates, drafts, scores, queues

**The loop in practice:**

The content module wakes up and checks the task queue. It finds: "Draft 3 LinkedIn posts based on this week's research findings."

Before writing, it runs 3 live searches — trending topics in your space, competitor content, recent industry news. It reads the research module's latest findings from memory.

It drafts 3 posts. Before putting any of them in the review queue, it scores each one against the VIRALS framework:

- V (0-2): Does this make the reader look smart or give them something useful?
- I (0-2): Does it hook into their daily work or current moment?
- R (0-2): Does it trigger a real emotion?
- A (0-2): Does it invite participation?
- L (0-2): Does it offer a practical tool?
- S (0-2): Does it have a narrative arc?

Minimum score to pass: 7/12. Posts that score below get rewritten. Posts that score 7+ drop to the review queue.

**What you review:** Post drafts with VIRALS scores attached. You approve, edit, or reject.

**What it can't do without you:** Publish without approval. Post during off-hours without explicit schedule. Use customer names without permission.

**Content rotation:** The module follows a 7-day cycle — controversial, how-to, personal story, listicle, industry news, community engagement, product post. It tracks which types perform best and adjusts the cadence.

---

## Role 5 — The Code Builder

**Job title:** Engineering Module
**What they own:** Feature implementation, bug fixes, code review prep, PR creation
**When they work:** Every 30 minutes — picks up the highest-priority engineering task, implements, tests, opens PR

**The loop in practice:**

The code builder module picks up a P0 task: "Add ICP scoring field to lead profile card."

It reads the codebase context from memory — existing patterns, relevant components, lint configuration. It implements the change in a feature branch. Runs lint and tests. Opens a PR with a clear description and linked task ID.

Logs: "PR #47 opened — add ICP score field to lead card — tests passing — awaiting review."

Status moves from in_progress to review.

**What you review:** The PR. If it passes your review, you merge. If not, you leave a comment — the module picks it up on the next run.

**What it can't do without you:** Push to main. Auto-merge. Deploy to production. Make breaking changes without your sign-off.

**Why this matters for GTM:** When the research module discovers a feature gap or the sales engine flags a proposal blocker, the task gets created automatically and lands in the code builder's queue. The loop closes without a meeting.

---

## Cross-Agent Chains: The System Working as a System

Each module runs independently. But they're designed to hand off to each other.

**Lead-to-Close Chain:**
Research module finds leads → scores and passes 8+ to outreach → outreach drafts and queues for approval → you approve → outreach sends → lead replies → sales engine qualifies → proposal drafted → deal closes

**Research-to-Content Chain:**
Research module finds trend or insight → saves to memory → content engine reads memory on next run → drafts post based on real finding → VIRALS scored → queued for approval → you approve → published

**Build-and-Announce Chain:**
Code builder ships feature → logs PR merged → creates task for content engine "announce feature X" → content engine drafts launch post → queued for approval → published

These chains run without coordination meetings. Without status update emails. Without "hey did you see that lead?" Slack messages.

The dispatch layer handles the routing. You handle the gates.

---

## The Memory Advantage

This is what separates an AI OS from a collection of AI tools.

After 30 days of running, the research module has a working model of what your ICP looks like — built from scored leads that converted, not from your initial assumptions. The outreach module knows which email angles get replies. The content module knows which VIRALS scores led to engagement.

Every lesson gets stored with tags. Every run reads the relevant lessons before starting.

The system doesn't reset. It compounds.

After 90 days, you have an AI OS that understands your business better than most contractors you'd hire.

---

## Deployment Order

1. Research layer (feeds everything else)
2. Outreach layer (needs research output to personalize)
3. Sales engine (needs warm leads from outreach)
4. Content engine (needs research findings to be non-generic)
5. Code builder (needs scoped tasks — research and sales surface them)
6. Dispatch layer (activate last, once all 5 specialists are running)

Start with one. Run it for a week. Add the next.

---

## CTA

Everything in this playbook runs on Ultron.

Pre-configured modules. Approval gates wired. Activity logs built in. Memory system running from day one.

You don't build this from scratch. You deploy it.

[Get access to Ultron]
