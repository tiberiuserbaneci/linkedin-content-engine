# HOW TO INSTALL ULTRON COMPLETE KNOWLEDGE BASE IN CLAUDE CODE

**Time Required:** 5 minutes  
**Files Needed:** 2  
**Result:** Complete Ultron knowledge available in Claude Code projects  

---

## WHAT YOU GET

When installed, Claude Code will have access to:

✓ Complete Ultron product definition  
✓ ICP targeting rules  
✓ 5-agent system details (CORTEX, SPECTER, STRIKER, PULSE, SENTINEL)  
✓ LinkedIn strategy (360Brew algorithm, hooks, posting windows)  
✓ Content rules (banned words, structure, CTA routing)  
✓ Footer & CTA guidelines (specific examples, routing rules)  
✓ Scoring framework (85+ target, 4 dimensions)  
✓ Layout selection (10 layout types + 3 templates)  
✓ Copy architecture (hook formulas, paragraph rules)  
✓ Brand voice & messaging  
✓ Operational workflows  
✓ Rules you cannot break  
✓ Quick reference tables  

---

## STEP-BY-STEP INSTALLATION

### Step 1: Create Skill Folder

In Claude Code terminal:

```bash
mkdir -p .claude/skills/ultron-complete
```

Verify:
```bash
ls -la .claude/skills/ultron-complete/
```

### Step 2: Create SKILL.md File

**Option A: Copy-paste (easiest)**

```bash
cat > .claude/skills/ultron-complete/SKILL.md << 'EOF'
[PASTE ENTIRE CONTENT FROM SKILL-ultron-complete.md HERE]
EOF
```

**Option B: Via Claude Code chat**

Ask Claude Code:
```
Create file: .claude/skills/ultron-complete/SKILL.md

[Paste entire SKILL-ultron-complete.md content]
```

Verify:
```bash
ls -lh .claude/skills/ultron-complete/SKILL.md
```

### Step 3: Copy Full Knowledge Base

```bash
cp ULTRON_COMPLETE_KNOWLEDGE_BASE.md .claude/ultron-complete-knowledge-base.md
```

Or create it manually:
```bash
cat > .claude/ultron-complete-knowledge-base.md << 'EOF'
[PASTE ENTIRE CONTENT FROM ULTRON_COMPLETE_KNOWLEDGE_BASE.md HERE]
EOF
```

Verify:
```bash
ls -lh .claude/ultron-complete-knowledge-base.md
```

### Step 4: Update .claude/CLAUDE.md

Add this section to your `.claude/CLAUDE.md`:

```markdown
## Ultron Knowledge Base

### Installed
- `.claude/skills/ultron-complete/SKILL.md` (Claude Code skill)
- `.claude/ultron-complete-knowledge-base.md` (full reference, 1500+ lines)

### What's Included
- Complete Ultron product knowledge
- ICP definition and targeting
- 5-agent system (CORTEX, SPECTER, STRIKER, PULSE, SENTINEL)
- LinkedIn strategy (360Brew, hooks, posting windows)
- Content rules (structure, banned words, CTA routing)
- Footer & CTA guidelines (specific examples)
- Scoring framework (85+ target, 4 dimensions)
- Layout selection (10 types + 3 master templates)
- Copy architecture (hooks, paragraph rules, voice)
- Brand voice & messaging
- Operational workflows
- Non-negotiable rules

### How to Use
When creating Ultron content or working on founder-facing materials,
reference this knowledge base. All rules, strategies, and guidelines are 
documented in ULTRON_COMPLETE_KNOWLEDGE_BASE.md.

### Quick Navigation
- Product definition: PART 1
- ICP & targeting: PART 2
- 5-agent system: PART 3
- LinkedIn strategy: PART 4
- Footer/CTA rules: PART 5
- Content rules: PART 6
- Scoring framework: PART 7
- Layout selection: PART 8
- Copy architecture: PART 10
- Brand voice: PART 11
- Non-negotiable rules: PART 13
- Quick reference: PART 14

### Common Requests
"Create a LinkedIn post about [topic]"
"Score this content for Ultron standards"
"What's the footer CTA for [situation]?"
"How do I position this feature?"
```

### Step 5: Verify Installation

```bash
# Check skill file exists
ls .claude/skills/ultron-complete/SKILL.md

# Check knowledge base exists
ls .claude/ultron-complete-knowledge-base.md

# Check CLAUDE.md includes the section
grep -A 5 "Ultron Knowledge Base" .claude/CLAUDE.md
```

All three should return file paths. If they do, installation is complete.

---

## TEST THE INSTALLATION

In Claude Code chat, ask one of these:

**Test 1 - Product Knowledge:**
```
What is Ultron? Explain the 5-agent system.
```

Expected: Detailed explanation of CORTEX, SPECTER, STRIKER, PULSE, SENTINEL.

**Test 2 - Content Creation:**
```
Create a LinkedIn post about Ultron for solo founders. Include the score, artifact, copy, and CTA.
```

Expected: Score (4 dimensions) + HTML artifact (1080×1350px) + post copy + first comment CTA

**Test 3 - Scoring:**
```
Score this concept for Ultron standards: "5 AI agents every founder should use"
```

Expected: All 4 scoring dimensions (Virality, Save-Worthy, Visual, System Thinking)

**Test 4 - Footer Rules:**
```
Write a footer CTA for a post about Ultron's reporting automation.
```

Expected: [Specific pain] → [Action verb] → [Routing URL]

---

## FOLDER STRUCTURE (After Installation)

```
your-claude-code-project/
├── .claude/
│   ├── CLAUDE.md                          (updated with Ultron section)
│   ├── settings.json
│   └── skills/
│       └── ultron-complete/
│           └── SKILL.md                   (← Installed skill)
│
├── .claude/
│   └── ultron-complete-knowledge-base.md  (← Full reference)
│
└── README.md
```

---

## WHAT EACH FILE DOES

### SKILL.md (Installed in .claude/skills/)

- Lightweight skill file (~400 lines)
- Gives Claude Code access to Ultron knowledge
- Auto-triggers when you mention Ultron, LinkedIn, content, scoring
- References full knowledge base for details

### ultron-complete-knowledge-base.md (In .claude/)

- Complete reference document (1500+ lines)
- All 15 parts with full details
- Examples, rules, guidelines, templates
- Quick reference tables
- Use when you need specific details

---

## COMMANDS TO TRY AFTER INSTALLATION

```bash
# In Claude Code, ask:

# Product & Company
"What is Ultron? Why is it not a Claude wrapper?"

# ICP
"Who is Ultron's target customer?"
"What's the ICP for Ultron?"

# 5-Agent System
"Explain the 5-agent system"
"What does CORTEX do?"
"What does SPECTER do?"

# LinkedIn Strategy
"What's the 360Brew algorithm?"
"What's the best posting window for LinkedIn?"
"Give me hook formulas for Ultron content"

# Content Creation
"Create a LinkedIn post about Ultron for founders"
"Make an infographic showing the 5-agent system"

# Scoring
"Score this: 'Load your context once. Claude remembers everything.'"

# Footer & CTA
"Write a footer CTA for a post about Ultron's lead research"
"What's the routing for the calculator page?"

# Rules
"What are the non-negotiable rules for Ultron content?"
"What banned words can't I use?"

# Competitive
"How is Ultron different from ChatGPT?"
"How is Ultron different from raw Claude?"
```

---

## QUICK START EXAMPLE

After installation, here's a complete workflow:

**You:** "Create a LinkedIn post about the Ultron 5-agent system with infographic."

**Claude Code (automatically):**

1. **REFERENCES:** PART 3 (5-agent system) + PART 4 (LinkedIn strategy)

2. **OUTPUTS:**

   **SCORE:**
   ```
   VIRALITY:       88/100
   SAVE-WORTHY:    92/100
   VISUAL:         86/100
   SYSTEM THINK:   90/100
   OVERALL:        89/100 ✓ GO
   ```

   **HTML ARTIFACT:** (1080×1350px with export buttons)
   
   **POST COPY:**
   ```
   Your AI has one job. Then another. Then another.
   But they don't share context.
   
   Ultron connects all 5:
   -> CORTEX (reporting automation)
   -> SPECTER (lead research)
   -> STRIKER (content creation)
   -> PULSE (competitive intelligence)
   -> SENTINEL (churn warnings)
   
   One system. One context. All problems solved.
   
   Repost if your founder team is automating workflows.
   ```

   **FIRST COMMENT CTA:**
   ```
   Ultron gives you all 5 agents in one system.
   → 51ultron.com/blueprint/
   See how founders are replacing headcount without hiring.
   ```

---

## TROUBLESHOOTING

**"Skill not triggering"**
- Check: `.claude/skills/ultron-complete/SKILL.md` exists
- Check: File contains full SKILL.md content (400+ lines)
- Fix: Recreate the file if content is missing

**"Can't find references"**
- Check: `.claude/ultron-complete-knowledge-base.md` exists
- Check: File contains all 15 parts (1500+ lines)
- Fix: Copy full content if missing

**"What's the routing for X?"**
- Reference: PART 5 (Footer & CTA Guidelines)
- Routing options: /blueprint/, /calculator/, /competitor/, /stack/, /

**"Which layout should I use?"**
- Reference: PART 8 (Layout Selection System)
- Quick check: 5 agents? → ACROSTIC. Comparison? → COMPARISON. System? → HERO_GRID.

**"Is this a banned word?"**
- Reference: PART 10 (Copy Architecture Rules)
- Banned: leverage, optimize, seamless, delve, robust, ecosystem, revolutionary, game-changing, transformative, holistic, synergy, empower, unlock, journey

---

## INTEGRATION WITH EXISTING SETUP

If you already have:

- ✓ LinkedIn content skill → Keep it. Ultron knowledge complements it.
- ✓ Design system → Keep it. This knowledge base doesn't include design (you have that locked).
- ✓ Export tools → Keep them. This knowledge base references them.

**This knowledge base = complete strategic context for Ultron work**

---

## FILE CHECKLIST

Before starting, confirm you have:

- [ ] `SKILL-ultron-complete.md` (skill file)
- [ ] `ULTRON_COMPLETE_KNOWLEDGE_BASE.md` (full reference)

After installation, verify:

- [ ] `.claude/skills/ultron-complete/SKILL.md` exists
- [ ] `.claude/ultron-complete-knowledge-base.md` exists
- [ ] `.claude/CLAUDE.md` includes "## Ultron Knowledge Base" section
- [ ] Test command works (ask Claude Code a simple question about Ultron)

---

## QUICK REFERENCE AFTER INSTALLATION

**When you need to:**

| Task | Location |
|------|----------|
| Create Ultron content | PART 4 (LinkedIn) + PART 10 (Copy) |
| Write a footer CTA | PART 5 (Footer & CTA Guidelines) |
| Select a layout | PART 8 (Layout Selection) |
| Score a concept | PART 7 (Scoring Framework) |
| Check a rule | PART 13 (Rules You Cannot Break) |
| Understand the product | PART 1 + PART 3 (Product + 5-agent system) |
| Target the right ICP | PART 2 (ICP & Market) |
| Make a LinkedIn decision | PART 4 (Strategy) |

---

## SUPPORT & QUESTIONS

**File location issue?**
→ Check folder structure matches the install guide

**Content doesn't load?**
→ Verify ULTRON_COMPLETE_KNOWLEDGE_BASE.md is copied, not just referenced

**Can't find a specific rule?**
→ Check PART 14 (Quick Reference) or search for keyword in full file

**Want to customize?**
→ Edit `.claude/ultron-complete-knowledge-base.md` directly to add notes, examples, or company-specific rules

---

## NEXT STEPS

1. ✓ Follow STEP 1-5 (5 minutes)
2. ✓ Run one test command (2 minutes)
3. ✓ Start creating Ultron content

**Total time to first use: 10 minutes**

---

## WHAT'S NEXT?

After installation, you can:

1. **Create content** — Ask Claude Code to make LinkedIn posts, infographics, carousels
2. **Reference rules** — Ask about footer CTAs, banned words, posting windows
3. **Score concepts** — Ask Claude to score content for Ultron standards
4. **Position features** — Ask how to position new product features for founders
5. **Plan strategy** — Ask about competitive positioning, ICP targeting, messaging

All with complete Ultron context loaded.

---

**Installation Time:** 5 minutes  
**First Use:** 2 minutes  
**Total Setup:** 7 minutes  

**Created for Ultron / 51ultron.com**  
**Ultron Complete Knowledge Base v2.0**  
**Ready for Claude Code**
