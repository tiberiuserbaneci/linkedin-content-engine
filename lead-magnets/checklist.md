# Lead Magnet 1 — "The AI OS Checklist: 6 Modules, 48 Hours"

**Format:** PDF-ready document. Scannable. Founder-friendly.
**CTA:** "Want the dashboard pre-built? → Ultron"
**VIRALS Score: 10/12** — V:2 I:2 R:1 A:2 L:2 S:1

---

## Cover / Title Slide

**Headline:** The AI OS Checklist
**Sub-headline:** 6 modules. 48 hours. A system that works while you don't.
**By line:** Built on Ultron — the AI multi-agent OS for founders
**Visual note:** Dark background, Ultron logo bottom right, clean sans-serif font.

---

## Intro (1 short page)

You don't have an AI problem.

You have a coordination problem.

You've tried ChatGPT. Maybe Claude. A few Notion AI blocks. A Zapier workflow that half-works. But each tool requires you to prompt it, review it, and move the output somewhere manually.

That's not automation. That's AI-assisted manual labor.

An AI OS is different. It runs a set of specialized modules — each with a clear role, a defined input, and a measurable output. They chain together automatically. You review at the gates, not at every step.

This checklist shows you the 6 modules, what each one does, what it needs to run, and when to activate it.

Work through it in order. The first 2 modules compound everything that follows.

---

## Module 1 — Research Layer

**What it does:**
Finds high-signal information from live web sources. Validates product assumptions. Surfaces competitor activity, market shifts, and prospect intelligence. Feeds every other module with real data.

**What it needs to run:**
- Web search API access (Brave Search recommended)
- Scraping tool access (Apify or equivalent)
- A task queue with at least 1 assigned research question

**What daily output looks like:**
- 5-10 sourced findings per run
- Confidence level marked on each claim (high / medium / low)
- New tasks auto-created for other modules based on findings
- All findings saved to long-term memory for future runs

**When to activate it:**
First. Always first. Every other module gets better when it's fed by live data instead of assumptions.

**Checkpoint:**
- [ ] Web search API connected
- [ ] Scraper configured
- [ ] At least 1 standing research task in the queue ("track competitor pricing weekly" / "find 10 new ICP leads")
- [ ] Memory storage enabled (findings persist across runs)

---

## Module 2 — Outreach Layer

**What it does:**
Builds and runs outbound campaigns by segment. Personalizes each message based on research module output. Tracks replies and hands qualified leads to the sales engine.

**What it needs to run:**
- Lead list with ICP scoring from the research module
- Email sending API (SendGrid / Resend / Gmail)
- Approved outreach templates (see Lead Magnet 3 for templates)
- Approval gate: module drafts, human approves, then it sends

**What daily output looks like:**
- Up to 50 personalized outreach messages per run
- Campaign metrics logged (sent / opened / replied / converted)
- Qualified leads passed to sales engine automatically
- Replies tracked, follow-up sequences triggered

**When to activate it:**
After the research layer has scored at least 10 leads above your ICP threshold (8+).

**Checkpoint:**
- [ ] Email API connected
- [ ] Lead list with ICP scores from research module available
- [ ] Approval gate configured (module does NOT send without human review)
- [ ] Follow-up sequences written (F1 at day 3 / F2 at day 5 / F3 at day 7)
- [ ] Rate limit set (50 sends max per run — avoid spam filters)

---

## Module 3 — Sales Engine

**What it does:**
Converts warm leads into commitments. Handles qualification, proposals, follow-through, and deal tracking. Runs on leads handed off by the outreach layer.

**What it needs to run:**
- Qualified leads from outreach layer (scored 8+ with research context)
- CRM access or task board for deal tracking
- Approved pricing tiers (the engine works within approved ranges only)
- Human approval gate for deals above a set value

**What daily output looks like:**
- Discovery summaries and qualification notes per lead
- Proposal drafts dropped in review queue
- Follow-up sequences triggered automatically
- Deal status updated in real time (qualified → proposal → negotiation → done)

**When to activate it:**
After the outreach layer has generated at least 5 warm replies or booked leads.

**Checkpoint:**
- [ ] CRM or task board connected
- [ ] Approved pricing tiers defined
- [ ] Discount authority set (e.g., max 20% off without human approval)
- [ ] Human gate for high-value deals (define your threshold)
- [ ] Proposal template reviewed and approved

---

## Module 4 — Content Engine

**What it does:**
Keeps a steady publishing cadence across platforms. Turns research findings, product updates, and customer wins into platform-ready content. Applies the VIRALS scoring framework before anything goes to the review queue.

**What it needs to run:**
- Research module output (trending topics, competitor activity, insights)
- Platform access (LinkedIn, Twitter/X, Instagram)
- VIRALS scoring threshold set (minimum 7/12 to pass to review)
- Approval gate: module drafts, human reviews, then it publishes

**What daily output looks like:**
- Up to 3 posts per run (rate limit enforced)
- Each post scored against the VIRALS framework before review
- Repurposed content flagged (one finding → multiple formats)
- Engagement tracked and fed back to improve next run

**When to activate it:**
After the research module is running and producing insights. Content should be downstream of research, not upstream.

**Checkpoint:**
- [ ] Platform APIs connected (LinkedIn / Twitter / Instagram)
- [ ] VIRALS score threshold set (7/12 minimum)
- [ ] Approval gate configured (nothing publishes without human review)
- [ ] Rate limit set (3 posts max per run)
- [ ] Brand voice rules loaded into the module

---

## Module 5 — Code Builder

**What it does:**
Picks up engineering tasks, writes clean code, runs tests, opens pull requests. Escalates blockers with clear error details instead of guessing.

**What it needs to run:**
- GitHub repository access
- Task queue with at least 1 scoped engineering task
- Lint and test configuration in the repo
- Human approval gate: module opens PRs, humans merge

**What daily output looks like:**
- Working code committed to feature branches
- Pull requests with linked task IDs and clear descriptions
- Activity logs for every implementation step
- Blockers flagged immediately with error details

**When to activate it:**
When you have scoped engineering tasks. Not before. Unscoped tasks produce unscoped code.

**Checkpoint:**
- [ ] GitHub access configured (branch push, no main push)
- [ ] Lint / test suite available
- [ ] At least 1 P0 or P1 task in queue for the module
- [ ] PR approval workflow in place (module cannot auto-merge)

---

## Module 6 — Dispatch Layer

**What it does:**
Reads the task queue, routes work to the right module, monitors agent health, and keeps all task states current. It's the OS layer — not a specialist, but the coordinator that makes specialists work together.

**What it needs to run:**
- Access to all module task queues (read + write)
- Routing rules defined per task type
- Heartbeat monitoring (checks module status every 20 minutes)
- Human escalation path for blocked tasks

**What daily output looks like:**
- Task assignments to specialist modules
- Stalled tasks detected and escalated
- End-of-cycle status summary
- No direct execution — coordination only

**When to activate it:**
Last. Once all specialist modules are running and producing output.

**Checkpoint:**
- [ ] All 5 module queues accessible
- [ ] Routing rules written (research tasks → research module / outreach tasks → outreach module, etc.)
- [ ] Heartbeat monitoring enabled
- [ ] Escalation path defined for blocked tasks (human notification)
- [ ] Dispatch layer rate limit set (max 10 assignments per cycle)

---

## Final Checklist — System Ready When:

- [ ] Research module running and producing scored leads
- [ ] Outreach module drafting with approval gate active
- [ ] Sales engine receiving warm leads from outreach
- [ ] Content engine publishing from research output
- [ ] Code builder processing scoped engineering tasks
- [ ] Dispatch layer routing and monitoring all 5 modules
- [ ] Memory system enabled (agents save and read lessons across runs)
- [ ] Activity log active (full audit trail for every module action)

---

## CTA

You can build this yourself.

Or you can get the dashboard pre-built, the modules pre-configured, and the approval gates already wired.

Ultron is the AI OS for founders who are done duct-taping tools together.

[ultron.ai] — get access
