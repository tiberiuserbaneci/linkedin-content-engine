# LINKEDIN CONTENT CREATOR SKILL - 5 MINUTE SETUP

## WHAT YOU GET

✓ Create optimized LinkedIn posts + infographics in one go  
✓ Concept scoring (360Brew algorithm for max reach)  
✓ HTML artifacts ready to export as PNG/PDF  
✓ First comment CTAs with routing  

---

## INSTALLATION (Copy-Paste Steps)

### Step 1: Create Folder
```bash
mkdir -p .claude/skills/linkedin-content-creator
```

### Step 2: Create SKILL.md

Copy the entire content from:
**`SKILL-linkedin-content-creator.md`**

Then paste into Claude Code:

```bash
cat > .claude/skills/linkedin-content-creator/SKILL.md << 'EOF'
[PASTE ENTIRE SKILL-linkedin-content-creator.md CONTENT HERE]
EOF
```

Or ask Claude Code directly:
```
Create file: .claude/skills/linkedin-content-creator/SKILL.md
[paste content]
```

### Step 3: Update CLAUDE.md

Add to your `.claude/CLAUDE.md`:

```markdown
## LinkedIn Content Creator

### Installed
- `.claude/skills/linkedin-content-creator/SKILL.md`

### Usage
"Create a LinkedIn post about [topic]"
→ Outputs: Score + HTML artifact + post copy + CTA

### Supported Content Types
- Posts with infographics
- Comparison tables
- Carousels (multi-slide)
- Cheatsheets
- System diagrams
- Frameworks

### Standards
- 1080×1350px (LinkedIn portrait)
- #C94A22 orange, #111 black, #F8F6F1 cream
- DM Sans or Arial
- Export to PNG/PDF via buttons
```

### Step 4: Verify

```bash
# Check skill file exists
ls .claude/skills/linkedin-content-creator/SKILL.md

# Should output: .claude/skills/linkedin-content-creator/SKILL.md
```

---

## TEST IT (2 Minutes)

In Claude Code chat, ask:

```
Create a LinkedIn post about "5 AI agents for founders" with an infographic.
```

Expected output:
1. **SCORE** (Virality/Save-Worthy/Visual/System Thinking)
2. **HTML ARTIFACT** (with Download PNG/PDF buttons)
3. **POST COPY** (ready to paste to LinkedIn)
4. **FIRST COMMENT CTA** (with link to 51ultron.com)

✓ **If you see all 4 → Skill is installed!**

---

## TRY THESE REQUESTS

```
# Simple post
Create a LinkedIn post about Claude Code best practices

# Comparison
Create a post comparing Cowork vs Chat vs Projects in Claude

# Infographic
Create an infographic showing the Ultron 5-agent system

# Carousel
Create a 5-slide carousel about Claude Code setup

# Score existing content
Score this for 360Brew optimization: [paste your post]
```

---

## FILES YOU NEED

All in `/mnt/user-data/outputs/`:

| File | Where to Copy | Purpose |
|------|---------------|---------|
| SKILL-linkedin-content-creator.md | → `.claude/skills/linkedin-content-creator/SKILL.md` | Main skill |
| design-reference.md | → project root | Colors & patterns (reference) |
| export-bar.js | → project root | PNG/PDF export (recommended) |
| export_playwright.py | → project root | Server-side PNG (optional) |

---

## FOLDER STRUCTURE (After Setup)

```
your-claude-code-project/
├── .claude/
│   ├── CLAUDE.md
│   ├── settings.json
│   └── skills/
│       └── linkedin-content-creator/
│           └── SKILL.md  ← Your newly installed skill
├── design-reference.md
├── export-bar.js
└── README.md
```

---

## CUSTOMIZE FOR YOUR BRAND

Edit `.claude/skills/linkedin-content-creator/SKILL.md`:

**Change target audience:**
```markdown
Find: "Primary ICP: Solo founders and small teams..."
Edit: Your actual audience
```

**Change brand colors:**
```markdown
Find: "Claude Orange: #BE4628"
Edit: Your color hex codes
```

**Change CTA links:**
```markdown
Find: "51ultron.com/[path]"
Edit: Your URLs
```

---

## WHAT HAPPENS NEXT

When you ask Claude Code to create LinkedIn content:

1. Analyzes your topic
2. Selects best layout (grid, timeline, comparison, etc.)
3. Scores concept (target 85+)
4. Generates HTML artifact (1080×1350px)
5. Writes post copy (hook + body + save prompt)
6. Creates first comment CTA

All automatically. One request = complete content package.

---

## TROUBLESHOOTING

| Problem | Fix |
|---------|-----|
| Skill not triggering | Check `.claude/skills/linkedin-content-creator/SKILL.md` exists |
| Export buttons don't work | Ensure CDN scripts in HTML before `</body>` |
| Score too low | Redesign visual. Check "WEAK POINTS" in score. |
| HTML looks wrong | Verify inline CSS only, hex colors, no gradients |

---

## NEXT STEPS

1. ✓ Copy SKILL.md to `.claude/skills/linkedin-content-creator/`
2. ✓ Update `.claude/CLAUDE.md`
3. ✓ Test with: "Create a LinkedIn post about..."
4. ✓ Start creating content!

---

**Installation Time: 5 minutes**  
**First content generation: 2 minutes**  
**Ready to deploy: Immediately**

---

Created for Ultron / 51ultron.com  
LinkedIn Content Creator Skill v2.0
