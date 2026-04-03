# HOW TO INSTALL LINKEDIN CONTENT CREATOR SKILL IN CLAUDE CODE

## WHAT YOU'LL GET

A skill that generates:
- ✓ Optimized LinkedIn posts (hook + body + CTA)
- ✓ HTML infographics (1080×1350px, ready to download as PNG/PDF)
- ✓ Carousels and multi-slide content
- ✓ Concept scoring (360Brew algorithm)
- ✓ Copy that's tested on your ICP (founders)

---

## INSTALLATION (5 MINUTES)

### STEP 1: Create Skill Folder

In Claude Code terminal:

```bash
# Navigate to your project root
cd /path/to/your/claude-code-project

# Create skill directory
mkdir -p .claude/skills/linkedin-content-creator

# Verify
ls -la .claude/skills/
```

Output should show:
```
.claude/skills/linkedin-content-creator/
```

---

### STEP 2: Create SKILL.md File

**Option A: Copy-paste the file**

```bash
# Create the file
cat > .claude/skills/linkedin-content-creator/SKILL.md << 'EOF'
[PASTE ENTIRE CONTENT FROM SKILL-linkedin-content-creator.md HERE]
EOF

# Verify
ls -lh .claude/skills/linkedin-content-creator/SKILL.md
```

**Option B: Use Claude Code directly**

In Claude Code chat, ask:

```
Create a new file: .claude/skills/linkedin-content-creator/SKILL.md

[Paste the entire content]
```

Claude Code will create it automatically.

---

### STEP 3: Create Supporting Files (Optional but Recommended)

Copy these to your project root:

```bash
# Design reference (colors, typography, patterns)
cp design-reference.md /path/to/your/project/

# Export utilities (for PNG/PDF functionality)
cp export-utils.js /path/to/your/project/

# Export scripts
cp export_playwright.py /path/to/your/project/
cp export-bar.js /path/to/your/project/
```

These are reference files. The skill will work without them, but they're helpful for debugging and customization.

---

### STEP 4: Update Your CLAUDE.md

Add this section to your `.claude/CLAUDE.md`:

```markdown
## LinkedIn Content Creator Skill

### Installed
- `.claude/skills/linkedin-content-creator/SKILL.md`

### How to Use
Ask Claude to create LinkedIn content:
- "Create a LinkedIn post about [topic]"
- "Make an infographic showing [concept]"
- "Score this content for 360Brew optimization"
- "Generate a carousel about [topic]"

### Output
1. Score (Virality/Save-Worthy/Visual/System Thinking)
2. HTML artifact (1080×1350px, export PNG/PDF buttons)
3. Post copy (hook + body, ready to paste)
4. First comment CTA (routing to 51ultron.com)

### Standards
- Dimensions: 1080×1350px (LinkedIn portrait)
- Colors: #C94A22 orange, #111 black, #F8F6F1 cream
- Font: DM Sans or Arial
- No external stylesheets, no gradients, no shadows
- Export bar mandatory (html2canvas + jsPDF)

### Skill Triggers
Automatically invoked when you mention:
- LinkedIn post, infographic, cheatsheet
- Score this, frame this idea
- Generate visual, content for LinkedIn
- Make a post, founder content
```

---

### STEP 5: Verify Installation

In Claude Code terminal:

```bash
# Check skill file exists
cat .claude/skills/linkedin-content-creator/SKILL.md | head -20

# Check CLAUDE.md includes it
grep -A 5 "LinkedIn Content Creator" .claude/CLAUDE.md
```

---

## TEST THE SKILL (2 MINUTES)

In Claude Code chat, type:

```
Create a LinkedIn post about "5 AI agents for founders" with an infographic.
```

Expected output:
1. **SCORE section** (Virality/Save-Worthy/Visual/System Thinking)
2. **HTML artifact** (interactive, with Download PNG/PDF buttons)
3. **POST COPY** (ready to paste to LinkedIn)
4. **FIRST COMMENT** (CTA with link to 51ultron.com)

If you see all 4 → **Installation successful!** ✓

---

## COMMON REQUESTS TO TRY

Once installed, you can ask:

### Posts
```
Create a LinkedIn post about Claude Code best practices
Create a comparison post: Cowork vs Chat vs Projects in Claude
Create a founder-focused post about AI-powered lead research
```

### Infographics
```
Create an infographic showing the 5-agent Ultron system
Make a cheatsheet for Claude Code workflows
Generate a visual guide: How to use CLAUDE.md
```

### Scoring
```
Score this LinkedIn post for 360Brew optimization: [paste your post]
Is this content save-worthy? [paste content]
```

### Carousels
```
Create a 5-slide carousel about Claude Code setup
Make a carousel: Step-by-step Ultron onboarding
```

---

## FOLDER STRUCTURE (After Installation)

```
your-project/
├── .claude/
│   ├── CLAUDE.md                 (updated with skill section)
│   ├── settings.json
│   └── skills/
│       └── linkedin-content-creator/
│           └── SKILL.md           (LinkedIn content skill)
├── design-reference.md            (colors, typography, patterns)
├── export-bar.js                  (browser export module)
├── export_playwright.py           (server-side PNG export)
├── export-utils.js                (reference implementation)
└── README.md
```

---

## WHAT THE SKILL DOES

When you ask Claude Code to create LinkedIn content, it automatically:

✓ **Analyzes** your request (topic, format, audience)
✓ **Selects** the best layout (grid, timeline, comparison, etc.)
✓ **Scores** the concept (target: 85+)
✓ **Generates** an HTML artifact (1080×1350px)
✓ **Writes** post copy (hook + body)
✓ **Creates** first comment CTA (with routing)

All in one response. No back-and-forth needed.

---

## ADVANCED: CUSTOMIZE FOR YOUR BRAND

Edit `.claude/skills/linkedin-content-creator/SKILL.md`:

**Change the ICP (Ideal Customer Profile):**
```markdown
# Find this section:
**Primary ICP:** Solo founders and small teams (1-10 people)...

# Edit to match your audience
**Primary ICP:** [Your audience]
```

**Change brand colors:**
```markdown
# Find this section:
Claude Orange:    #BE4628
Ultron Orange:    #C84623

# Edit to your colors (keep hex format)
Your Brand Orange: #YOUR_HEX_CODE
```

**Add your own hook formulas:**
```markdown
# Find HOOK FORMULAS section
# Add your proven patterns
YOUR_PATTERN: "[Your formula here]"
```

**Update CTA routing:**
```markdown
# Find FIRST COMMENT CTA ROUTING
# Change URLs to your endpoints
Your Service -> yoursite.com/[path]
```

---

## TROUBLESHOOTING

### "Skill not triggering"
**Check:** Does `.claude/skills/linkedin-content-creator/SKILL.md` exist?
```bash
ls .claude/skills/linkedin-content-creator/SKILL.md
```

**Fix:** Recreate the file if missing.

### "Export buttons not working"
**Check:** Are CDN scripts loaded?
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
```

**Fix:** Ensure both scripts are in your artifact before `</body>`.

### "Score is below 70"
**Expected:** This is by design. Redesign the visual until score reaches 80+.

**Fix:** Check "WEAK POINTS" section of score. Usually:
- Hook needs to be more contrarian
- Visual hierarchy needs adjustment
- Font sizes too small
- Colors not contrasting enough

### "HTML looks off"
**Check:** Only inline CSS, no external stylesheets
**Check:** Colors are hex format (#C94A22), not RGB
**Check:** No gradients or shadows (they're not used in Ultron designs)

---

## NEXT STEPS

1. ✓ Follow STEP 1-5 above (5 minutes)
2. ✓ Run the test request (2 minutes)
3. ✓ Try one of the COMMON REQUESTS
4. ✓ Customize for your brand (optional)
5. ✓ Start creating LinkedIn content!

---

## QUICK COMMAND REFERENCE

```bash
# Check if skill is installed
ls .claude/skills/linkedin-content-creator/SKILL.md

# View the skill file
cat .claude/skills/linkedin-content-creator/SKILL.md

# Update CLAUDE.md with skill info
# (Use your editor or ask Claude Code to add the section)

# Test the skill
# (In Claude Code chat: "Create a LinkedIn post about...")
```

---

## FILE CHECKLIST

Before you start, you should have:

- [ ] `.claude/skills/linkedin-content-creator/SKILL.md` (main skill file)
- [ ] `.claude/CLAUDE.md` (updated with skill section)
- [ ] `design-reference.md` (optional but recommended)
- [ ] `export-bar.js` (for PNG/PDF downloads)
- [ ] `export_playwright.py` (for server-side exports, optional)

---

## SUPPORT

All files are in your `/mnt/user-data/outputs/` directory:

- `SKILL-linkedin-content-creator.md` ← Copy this to `.claude/skills/linkedin-content-creator/SKILL.md`
- `design-reference.md` ← Copy to project root
- `export-bar.js` ← Copy to project root
- `export_playwright.py` ← Copy to project root
- `EXPORT_QUICK_REFERENCE.md` ← Reference guide

---

**You're all set. Ask Claude Code to "Create a LinkedIn post about [topic]" and watch it work.**

Created for Ultron / 51ultron.com  
LinkedIn Content Creator Skill v2.0
