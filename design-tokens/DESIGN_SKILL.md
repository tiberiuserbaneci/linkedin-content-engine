# Anthropic Design System Skill Guide

A condensed playbook for applying the Anthropic design system to mockups, cheatsheets, and product visuals.

## 🎨 Palette Rules

### Core Principle
**Restraint over variety.** 13 colors total. Colors named after materials (Slate, Cloud, Ivory, Book Cloth).

### Palette Map
```
NEUTRALS (Foundation)
├─ Slate Dark      #191919  → Primary dark backgrounds, text on light
├─ Slate Medium    #262625  → Secondary dark surfaces
├─ Slate Light     #40403E  → Dark text, borders on light
├─ Cloud Dark      #666663  → Icon color, secondary text
├─ Cloud Medium    #91918D  → Muted text, disabled states
├─ Cloud Light     #BFBFBA  → Borders, dividers
├─ Ivory Dark      #E5E4DF  → Light text on dark
├─ Ivory Medium    #F0FDEB  → Secondary light backgrounds
└─ Ivory Light     #FAFAF7  → Primary light background

ACCENTS (Warmth)
├─ Book Cloth      #CC785C  → Primary warm accent, highlights
├─ Kraft           #D4A27F  → Secondary accent
└─ Manilla         #EBDBBC  → Tertiary accent, disabled buttons

SEMANTIC (Interaction)
├─ Focus           #2D8AF7  → Interactive elements, links, focus states
└─ Error           #EF343B  → Errors, alerts, destructive actions

BASE
├─ Black           #000000  → Heavy text, icons
└─ White           #FFFFFF  → Overlay elements, special states
```

### Usage Rules
- **Backgrounds:** Ivory Light (light mode), Slate Dark (dark mode)
- **Body text:** Slate Light (light mode), Ivory Dark (dark mode)
- **Interactive:** Always Focus blue for primary CTAs
- **Accents:** Book Cloth only for secondary actions, highlights
- **Borders/Dividers:** Cloud Light (light) or Slate Medium (dark)
- **Disabled states:** Cloud Medium + reduce opacity
- **Never:** Mix bright multiple colors. No gradients. No neon or saturated tones.

---

## 🔤 Typography Rules

### Font Families
- **Anthropic Sans** (fallback: system sans) → All UI text, headings, body
- **JetBrains Mono** (fallback: Monaco) → Code, technical content ONLY

### Size Scale (Minimal = 4 sizes)
```
XS (0.75rem / 12px) → Captions, timestamps, small labels
SM (0.875rem / 14px) → Secondary text, help text
MD (1rem / 16px) → Body text, default, inputs, most content
LG (1.125rem / 18px) → Subheadings, callouts, emphasis
```

### Weights (Use Sparingly)
```
Regular (400)      → Body text, most content
Medium (500)       → Emphasized text within body
Semibold (600)     → Subheadings, medium emphasis
Bold (700)         → Headlines, strong emphasis ONLY
```

### Text Style Pairs (Use These, Not Custom)
```
Heading Large    = LG + Bold
Heading          = MD + Semibold  
Heading Small    = SM + Semibold
Body             = MD + Regular
Body Emphasized  = MD + Medium
Body Small       = SM + Regular
Caption          = XS + Regular
```

### Rules
- **Max 3 sizes per page** (Heading + Body + Caption pattern)
- **One font family** (no mixing sans + serif)
- **Never use light weight** (< 400)
- **Never use multiple bold** elements (confuses hierarchy)
- **Line height:** 1.5 for body, 1.2 for headings
- **Letter spacing:** 0em (no tracking adjustments)

---

## 📏 Spacing Rules

### Base Unit: 8px grid

```
0   1    2    3    4    6    8    10   12   16   20   24   32   40   48
0   8px  16px 24px 32px 48px 64px 80px 96px 128px...
```

### Application
```
Padding/Margin
├─ Compact: 8-12px (buttons, chips, small cards)
├─ Standard: 16-24px (cards, sections, inputs)
└─ Generous: 32-48px (page sections, breathing room)

Component Spacing
├─ Button: 12px padding (inside)
├─ Card: 24px padding (inside)
├─ Input: 12px padding (inside)
├─ Gap (lists): 16px
└─ Section gap: 32-48px
```

### Rules
- **Always multiples of 8px** (no 5px, 7px, 11px)
- **Consistent internal padding** (same vertical and horizontal)
- **Generous gaps** between sections (breathe)
- **Never cramped** (minimum 8px between elements)

---

## 🏠 Card Rules

### Structure
```
┌─────────────────────┐
│ 24px padding        │
│  ┌─────────────────┐│
│  │ Heading Small   ││
│  │ (SM + Semibold) ││
│  └─────────────────┘│
│ 16px gap            │
│  ┌─────────────────┐│
│  │ Body text       ││
│  │ (MD + Regular)  ││
│  └─────────────────┘│
│ 24px padding        │
└─────────────────────┘
```

### Light Mode
- **Background:** Ivory Light (#FAFAF7)
- **Border:** Cloud Light (#BFBFBA), 1px
- **Shadow:** sm (0 1px 2px rgba(25,25,25,0.05))
- **Text:** Slate Light (#40403E)

### Dark Mode
- **Background:** Slate Medium (#262625)
- **Border:** Slate Light (#40403E), 1px
- **Shadow:** sm (0 1px 2px rgba(0,0,0,0.2))
- **Text:** Ivory Dark (#E5E4DF)

### Border Radius
Always use `md` (0.5rem / 4px) for cards. Consistent, subtle, professional.

### Rules
- **Only rounded corners** (border-radius-md)
- **Never fill the whole background** (always have breathing room)
- **One shadow level only** (sm for cards)
- **Consistent padding** (24px is standard)
- **No nested cards** (breaks visual hierarchy)

---

## 🔘 Chip / Button / Input Rules

### Buttons

#### Primary Button (Focus CTA)
```
Background: Focus (#2D8AF7)
Text: White (#FFFFFF)
Padding: 12px 16px (vertical/horizontal)
Border Radius: md (4px)
Font: MD + Semibold
Hover: Opacity 90% (subtle)
Focus Ring: 2px Focus blue outline + 2px offset
```

#### Secondary Button (Warm Accent)
```
Background: Book Cloth (#CC785C)
Text: White (#FFFFFF)
Padding: 12px 16px
Border Radius: md (4px)
Font: MD + Semibold
Hover: Opacity 90%
```

#### Ghost Button (Minimal)
```
Background: Transparent
Text: Slate Light (#40403E)
Border: 1px Cloud Light
Padding: 12px 16px
Hover: bg-Ivory Medium
```

#### Disabled State (All buttons)
```
Background: Cloud Medium (#91918D)
Text: Cloud Light (#BFBFBA)
Opacity: 60%
Cursor: not-allowed
No hover effect
```

### Chips
```
Background: Ivory Medium (#F0FDEB)
Text: Slate Light (#40403E)
Padding: 8px 12px
Border Radius: full (pill shape)
Border: 1px Cloud Light
Font: SM + Medium
Icon: Cloud Dark (#666663)
Remove: X icon on right (Cloud Dark)
```

### Inputs
```
Background: Ivory Light (#FAFAF7)
Border: 1px Cloud Light (#BFBFBA)
Padding: 12px (inside)
Border Radius: md (4px)
Font: MD + Regular
Placeholder: Cloud Medium (#91918D)
Focus: 2px Focus blue ring + border transparent
```

#### Input States
```
Error:    Border Error red (#EF343B), text Error red
Disabled: Background Cloud Light, text Cloud Medium, opacity 60%
Success:  Border Focus blue (no special success color)
```

### Rules
- **All interactive elements have focus rings** (2px Focus blue)
- **No background color changes on hover** (opacity only)
- **Consistent padding** (vertical = horizontal)
- **Only 2 button variants in most layouts** (primary + ghost)
- **Never right-align buttons** (breaks accessibility)

---

## 🌙 Dark Mode Behavior

### Inversion Pattern (Simple Rule)
```
Light Mode          →    Dark Mode
Ivory Light         →    Slate Dark
Slate Light         →    Ivory Dark
Cloud Light         →    Slate Medium
Cloud Medium        →    Cloud Medium (stays)
Book Cloth          →    Book Cloth (stays)
Focus               →    Focus (stays)
Error               →    Error (stays)
```

### Implementation
```css
@media (prefers-color-scheme: dark) {
  body {
    background: var(--color-slate-dark);
    color: var(--color-ivory-dark);
  }
  .card {
    background: var(--color-slate-medium);
    border-color: var(--color-slate-light);
  }
}
```

### Rules
- **Background inverts** (Ivory ↔ Slate)
- **Text inverts** (Slate ↔ Ivory)
- **Accents stay the same** (Book Cloth, Focus, Error don't change)
- **Shadows darken** (use rgba with higher opacity)
- **No custom dark colors** (use the inversion)

---

## ✨ What to Preserve (The Essence)

These make it **authentically Anthropic**:

1. **Material-Inspired Color Names**
   - Never say "primary blue" → Say "Focus"
   - Never say "neutral gray" → Say "Slate", "Cloud", "Ivory"

2. **Restraint**
   - Maximum 13 colors, period
   - If adding a color, remove one
   - Simplicity over customization

3. **Warmth**
   - Terracotta/Kraft tones differentiate from cold tech
   - Book Cloth (#CC785C) is irreplaceable
   - Warm > Cool in decision-making

4. **Accessible Contrast**
   - Dark text on light: Slate Light on Ivory Light (7:1)
   - Light text on dark: Ivory Dark on Slate Dark (9:1)
   - Meet WCAG AAA in all combinations

5. **Minimal Typography**
   - 4 sizes, not 8
   - 4 weights, not 6
   - Semantic naming (Body, Heading, Caption)

6. **Focus-First Interactivity**
   - Focus blue is THE color for interactive
   - No other primary accent
   - Clear focus rings on all clickable elements

7. **Generous Spacing**
   - Never cramped
   - 8px grid system
   - Breathing room > density

---

## ❌ What to Avoid (Anti-Patterns)

### Color Mistakes
- ❌ Multiple primary colors (only Focus blue for CTA)
- ❌ Bright, saturated colors (all Anthropic colors are muted)
- ❌ Semantic color bloat (no "success green", "warning yellow")
- ❌ Gradients or color blends (solid colors only)
- ❌ Adding new colors without removing one
- ❌ Using full brightness colors (#FF0000, #00FF00)

### Typography Mistakes
- ❌ Font mixing (Anthropic Sans + serif never together)
- ❌ Light weights (< 400)
- ❌ Sizes outside the 4-size scale
- ❌ More than 3 different sizes on one page
- ❌ Tracking/letter-spacing adjustments
- ❌ All caps (breaks readability, unless tiny labels)

### Spacing Mistakes
- ❌ Odd numbers (5px, 7px, 11px)
- ❌ Not multiples of 8px
- ❌ Dense layouts (always leave breathing room)
- ❌ Inconsistent padding (12px left, 16px right)
- ❌ Too much whitespace (32-48px max gap on web)

### Component Mistakes
- ❌ Rounded corners other than md (4px is standard)
- ❌ Filled buttons everywhere (use ghost for secondary)
- ❌ Shadows on every element (sm for cards only)
- ❌ Hover color changes (opacity only)
- ❌ Multiple button styles in one layout
- ❌ Missing focus rings on interactive elements

### Accessibility Mistakes
- ❌ Focus rings that are hard to see
- ❌ Disabled state < 60% opacity
- ❌ Color alone to convey meaning (always add text/icon)
- ❌ Contrast < 4.5:1 for text, < 3:1 for icons
- ❌ Interactive elements without clear focus state

---

## 🎯 How to Apply to Future Work

### For Cheatsheets / Design Docs
1. **Header:** Slate Dark bg, Ivory Dark text, LG + Semibold
2. **Section titles:** MD + Semibold, Slate Light
3. **Body:** MD + Regular, Slate Light
4. **Code blocks:** JetBrains Mono, Cloud Dark text on Ivory Light bg
5. **Callouts/Important:** Book Cloth bg, white text (strong presence)
6. **Links:** Focus blue, underline on hover
7. **Examples:** Use card component with border-radius-md

### For Mockups / UI Designs
1. **Start with color:** Pick Slate/Cloud/Ivory first
2. **Add ONE accent:** Book Cloth or Focus only
3. **Typography:** Pick Heading + Body combination, stick to it
4. **Spacing:** Use 8px grid, 24px card padding
5. **Components:** Use 3 states: default, hover (opacity), focus (ring)
6. **Dark mode:** Invert Ivory ↔ Slate, keep accents
7. **Test contrast:** Use WebAIM contrast checker

### For Product Visuals
1. **Establish hierarchy:** Heading (LG), Body (MD), Caption (SM)
2. **Focus attention:** Use Focus blue sparingly, only for CTAs
3. **Warm elements:** Use Book Cloth for secondary highlights
4. **Breathing room:** 32px+ gaps between major sections
5. **Consistency:** Repeat 3-4 color combinations across page
6. **Accessibility:** Focus rings on all interactive, test with WCAG AA
7. **Dark mode:** Design dark first, invert for light

### Checklist for Every Design
- [ ] Using only Anthropic palette colors (13 max)
- [ ] Typography is from the 4-size scale
- [ ] Spacing is multiples of 8px
- [ ] Focus elements are only Focus blue or Book Cloth
- [ ] Cards use md border-radius only
- [ ] All interactive elements have focus rings
- [ ] Disabled states use Cloud Medium
- [ ] Dark mode inverts Ivory ↔ Slate
- [ ] Contrast meets WCAG AA (4.5:1 text, 3:1 graphics)
- [ ] No gradients, glows, or non-solid fills

---

## 🔑 Quick Reference Card

```
COLORS (13 total)
├─ Slate Dark #191919      Light-mode text / Dark-mode bg
├─ Cloud Light #BFBFBA     Borders
├─ Ivory Light #FAFAF7     Light-mode bg
├─ Book Cloth #CC785C      Warm accent (secondary CTA)
├─ Focus #2D8AF7           Interactive (primary CTA, links)
└─ Error #EF343B           Errors only

TYPOGRAPHY
├─ Font: Anthropic Sans (or system sans)
├─ Sizes: XS(12px), SM(14px), MD(16px), LG(18px)
├─ Weights: 400, 500, 600, 700
└─ Pattern: Heading (LG) + Body (MD) + Caption (XS)

SPACING
├─ Base: 8px grid
├─ Inside cards: 24px padding
├─ Button padding: 12px
├─ Section gap: 32-48px
└─ Never cramped

COMPONENTS
├─ Primary button: Focus blue + white
├─ Secondary button: Book Cloth + white
├─ Cards: Ivory Light bg, Cloud Light border, md radius
├─ Inputs: Ivory Light bg, Cloud Light border, Focus ring on focus
└─ All elements: Focus ring on interactive

DARK MODE
├─ Invert Ivory ↔ Slate only
├─ Keep accents (Book Cloth, Focus, Error)
└─ Darker shadows

PRESERVE
✓ Material color names (Slate, Cloud, Book Cloth)
✓ 13-color restraint
✓ Warmth (Book Cloth > cool blues)
✓ Minimal sizes (4 only)
✓ 8px grid (no odd numbers)
✓ Focus blue for interactive (one accent)

AVOID
✗ Multiple primary colors
✗ New colors without removing one
✗ Sizes outside 4-scale
✗ Spacing not 8px multiples
✗ Hover that changes color (opacity only)
✗ Missing focus rings
```

---

## 📚 Example Application

### Before (Generic)
```
Color: #5A5A5A text on #FFFFFF bg
Font: Inter 14px regular
Spacing: 12px padding
Button: #0066FF primary, #FF6B35 secondary
Hover: Color change to darker shade
```

### After (Anthropic)
```
Color: Slate Light text on Ivory Light bg
Font: Anthropic Sans 14px regular
Spacing: 16px padding (multiple of 8)
Button: Focus blue primary, Book Cloth secondary
Hover: Opacity to 90% (no color change)
Focus: 2px Focus blue ring with 2px offset
```

---

## 🎓 Summary: The Anthropic Way

> **Use a minimal palette of warm, material-inspired colors. Pair with restrained typography and generous spacing. Prioritize accessibility and clarity over decoration. Let the interface become invisible so the content shines.**

Apply this principle to every design decision:
- Is this color one of the 13?
- Is this size one of the 4?
- Is this spacing a multiple of 8?
- Is this interactive element clearly focusable?
- Does this feel warm and premium, not cold and technical?

If yes to all → You're applying Anthropic's design system correctly.
