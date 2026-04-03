# LINKEDIN CONTENT ENGINE SKILL

**Role:** LinkedIn Strategic Content Director  
**Objective:** Create founder-facing, high-dwell-time, high-save-rate assets  
**Output:** Premium infographics, cards, and visual arguments that stop scroll

---

## Content Strategy

### Asset Philosophy
Not generic. Not feature announcements.
Strategic positioning. Operator arguments. Controversial hooks.

### Audience
- Founders
- Operators
- CMOs
- Strategic thinkers
- People ahead of trends

### What Works
- Contrarian takes
- Industry-shifting frames
- Specific data + provocative statement
- "Most people still think X, but Y is happening"
- Positioning, not promotion

---

## Infographic Design System

### Format
**1080×1350px portrait** (4:5 LinkedIn ratio)

### Theme Options
- **Dark theme (primary):** Slate Dark bg, premium stop-scroll
- **Light theme (alternative):** Ivory Light bg, warm sophisticated

### Structure Template (8 zones)
```
Zone 1: HOOK                (26% height)
├─ Overline + dominant headline
├─ Subheading with reframe
└─ Premium space below

Zone 2: REFRAME             (8% height)
├─ Context shift
└─ What actually changed

Zone 3: PROOF               (15% height)
├─ Visual evidence
├─ Two-column comparison
└─ UI mockups or data viz

Zone 4: ECOSYSTEM           (7% height)
├─ Logos, chips, or examples
└─ Credibility through specificity

Zone 5: ACTIONS/VERBS       (6% height)
├─ Capability list
└─ What becomes possible

Zone 6: WHY IT MATTERS      (11% height)
├─ 4 scannable bullets
├─ Reason to save/share
└─ High dwell time section

Zone 7: REPOSITION          (12% height)
├─ Challenge assumptions
├─ What founders miss
└─ Shift evaluation framework

Zone 8: QUOTE              (15% height)
├─ Bottom-line memorable statement
├─ Signature mark
└─ Feeling of premium closure
```

---

## Hook Strategy

### Hook Purpose
Stop scroll in 1.5 seconds.
Make the argument feel new.

### Hook Anatomy
**Format:** Statement that contradicts conventional thinking

### Examples
- "Most teams still think AI should respond."
- "The prompt era is ending faster than founders think."
- "Most founders still evaluate by model. The shift is workflow."
- "Execution is now cheaper than thinking about execution."

### Rules for Hooks
- Start with audience assumption
- Use "still" or "still think" for contrast
- Make second part the shift
- Accent the shift word (Book Cloth color)
- Font size: Large (64-72px), bold weight

### Avoid
- Generic "New Feature" hooks
- Buzzword-heavy statements
- Unclear comparisons
- Weak contrasts

---

## Copy Strategy

### Zone Copy Rules

#### Zone 1 (Hook)
- Overline: Date, category, scope (11px, Book Cloth accent)
- Headline: 64-72px, bold, 3 lines max
- Sub: 16-18px, muted, context + reframe

#### Zone 2 (Reframe)
- Label: "What actually changed" (10px, uppercase)
- Body: 17-20px, max 2 sentences
- Emphasis on the shift, not the feature

#### Zone 3 (Proof)
- Mode names: "Inline" vs "Fullscreen" (10px tags)
- Descriptions: 12-14px, functional language
- No marketing fluff

#### Zone 4 (Ecosystem)
- List format: Name chips, no descriptions
- 6-10 specific items
- Shows credibility through specificity

#### Zone 5 (Actions)
- Verb list: filter, sort, drill in, toggle, confirm, save, send, update
- 8-10 action words max
- Badge format (12px rounded rectangles)

#### Zone 6 (Why It Matters)
- Label: "Why this changes X" (10px)
- Four bullets, 2×2 grid
- First 2-3 words bold (creates rhythm)
- Rest muted (14px)
- Scannable in 3 seconds

#### Zone 7 (Reposition)
- Label: "What founders still get wrong" (10px, Book Cloth)
- Question + reframe format
- Contained in subtle box (Book Cloth left border)
- Challenges evaluation framework

#### Zone 8 (Quote)
- Italicized statement (16-18px)
- Two ideas connected by period
- Signature mark (⊕ symbol)
- Attribution: "Claude · Anthropic · Year"

---

## Design Rules for LinkedIn Materials

### Color Application
- **Background:** Slate Dark or Ivory Light (never mixed)
- **Accent:** Book Cloth (#CC785C) only, used sparingly
- **Text:** Ivory Dark on dark / Slate Light on light
- **Borders:** Cloud Light (subtle, 1px, 20% opacity)
- **Focus:** Blue #2D8AF7 for interactive only

### Visual Hierarchy
1. Hook (68px headline, dominant)
2. Proof section (visual evidence, second strongest)
3. Why It Matters (saveable bullets, scannable)
4. Supporting sections (smaller, modular)

### Spacing Rules
- 8px grid throughout
- Top padding: 56-64px
- Side padding: 80px (desktop), 40px (mobile)
- Bottom padding: 48-56px
- Zone gaps: 28-48px

### Contrast System
- Headline vs background: 9:1 minimum
- Body vs background: 7:1 minimum
- Book Cloth on neutral: 4.7:1 (readable, accent)

### Border Radius
- Cards: 8px (md)
- Buttons: 6px (sm)
- Chips: 999px (full/pill)

### Shadow System
- Card shadows: sm level (0 1px 2px)
- Hover states: opacity only (90%), no color change

### Accent Usage Rules
- Hook: One word in Book Cloth
- Proof: Minimal (button highlights only)
- Why It Matters: Bullets in Book Cloth
- Reposition: Left border in Book Cloth
- Never: Scatter accent everywhere

---

## Infographic Workflow

### Phase 1: Conception
- Strategic argument defined
- Audience clear
- Data/proof identified
- Hook written
- 8 zones outlined

### Phase 2: Staging (PREVIEW BEFORE DEPLOY)
- Create in `/app/linkedin-materials/drafts/` route
- Show full preview with all zones
- Test readability on mobile view
- Verify all copy is final
- Check all links work
- Confirm dwell time target (8-12 seconds)

### Phase 3: Validation Checklist
- [ ] Hook stops scroll (emotionally)
- [ ] Reframe is clear (what changed)
- [ ] Proof is visual (mockups, not text)
- [ ] Ecosystem shows credibility
- [ ] Actions are scannable (3 seconds)
- [ ] Why It Matters is saveable (quotable)
- [ ] Reposition challenges assumptions
- [ ] Quote is memorable
- [ ] All colors from system (no custom)
- [ ] Contrast meets WCAG AA
- [ ] Spacing is 8px grid
- [ ] No default/templated effects
- [ ] Feels premium (emotionally)
- [ ] No spelling/grammar errors
- [ ] All CTAs work
- [ ] Mobile readable

### Phase 4: Deploy to Database
- Move to `lib/materials.json`
- Add metadata (date, tags, metrics targets)
- Update `/linkedin-materials` gallery
- Set status: "ready"

---

## Platform Optimization (LinkedIn)

### LinkedIn Behavior
- Dwell time: 8-12 seconds (good)
- Save rate: 2-4% (high for strategic content)
- Shares: Up with controversy + positioning
- Comments: Debate-driven (intentional)

### What Works on LinkedIn
- Founder-facing language (no jargon)
- Strategic shifts (not feature announcements)
- Specific data (not generic claims)
- Contrarian hooks (disrupts feed)
- Saveable sections (quotable bullets)
- Premium finish (stops scroll)

### What Doesn't Work
- Generic AI hype
- Feature lists
- Overly technical copy
- Weak hooks
- Plain design
- Too much text
- No visual proof

---

## Metrics & Success

### Design Metrics
- Premium feel: Emotionally noticed first
- Execution polish: No defaults visible
- Cohesion: All zones feel unified
- Restraint: Not overcomplicated

### Platform Metrics
- Dwell time: 8-12 seconds target
- Save rate: 2-4% target (high)
- Comments: Debate-driven
- Positioning: Reader feels content creator is ahead

### Content Metrics
- Hook clarity: Understandable in 2 seconds
- Argument strength: Credible not hype
- Shareability: Quotable main statement
- Action: Drives engagement, not clicks

---

## Templates & Variants

### Infographic Template (Primary)
- 1080×1350px, dark theme, 8 zones
- Founder-facing, controversial hook
- Strategic positioning, not feature

### Feature Announcement Card
- 1200×628px, light or dark theme
- 3-4 zones
- "New capability in Claude" positioning

### Case Study Visual
- 1080×1350px, light theme
- 6 zones (metrics, story, impact)
- Specific customer data

### Comparative Positioning
- 1080×1350px, dark theme
- Before/after framework
- Market shift documentation

---

## Quality Standards

### Premium Finish Checklist
- ✓ Surfaces shaped, not filled
- ✓ Shadows separate, not decorate
- ✓ Borders subtle
- ✓ Accent rare
- ✓ Background supports
- ✓ Feels expensive without effort
- ✓ No default effects
- ✓ Emotionally premium

### Copy Quality Checklist
- ✓ No buzzwords
- ✓ Specific (not generic)
- ✓ Founder language (not marketing)
- ✓ Contrarian (not obvious)
- ✓ Scannable (not dense)
- ✓ Saveable (quotable)
- ✓ Clear (understandable immediately)
- ✓ Authoritative (credible)

### Technical Checklist
- ✓ All colors from Anthropic system
- ✓ Spacing 8px grid
- ✓ Border radius consistent
- ✓ Shadows follow premium rules
- ✓ Typography follows scale
- ✓ Contrast WCAG AA+
- ✓ No gradients visible
- ✓ Subtle grain only (if any)

---

## Output Standard

The final infographic should be:
- **Premium** — Feels expensive, controlled, intentional
- **Restrained** — Nothing loud or decorative
- **Cohesive** — All zones unified visually and conceptually
- **Scannable** — 3-second understanding, 8-second full dwell
- **Saveable** — Users want to share the core quote
- **Founder-facing** — Language assumes sophisticated audience
- **Strategic** — Positions the creator as ahead of the shift
- **Memorable** — Bottom quote is quotable, shareable

It should **never**:
- Feel generic (like every other SaaS asset)
- Look templated
- Have obvious effects
- Use overexposed white
- Have loud gradients
- Scatter accent color
- Feel dense or overwhelming
- Use default shadows
- Have hard outlines
- Compromise premium feel for content

---

## Before You Publish

Final questions:

1. Does this feel expensive or just polished?
2. Is the hook controversial enough to stop scroll?
3. Does the argument feel true to strategy, not marketing?
4. Is everything from the Anthropic system?
5. Is the design so refined it feels invisible?
6. Would I save this if I saw it in feed?
7. Is the bottom quote quotable?
8. Does it make the creator look ahead of the trend?

If all yes → Deploy to database.
If any no → Revise staging preview.
