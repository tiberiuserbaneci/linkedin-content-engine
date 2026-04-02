# Anthropic Design System Playbook

Quick-reference playbook for applying the system in real-time design work.

---

## 🚀 Start Here: Design Decision Tree

### 1. I need to pick a background color
```
Is this light mode?
├─ YES → Use Ivory Light (#FAFAF7)
└─ NO  → Use Slate Dark (#191919)
```

### 2. I need to pick text color
```
Is background dark?
├─ YES → Use Ivory Dark (#E5E4DF)
└─ NO  → Use Slate Light (#40403E)
```

### 3. I need a border color
```
Is background light?
├─ YES → Use Cloud Light (#BFBFBA)
└─ NO  → Use Slate Medium (#262625)
```

### 4. I need an interactive color (button/link)
```
Is this the primary CTA?
├─ YES → Use Focus (#2D8AF7)
└─ NO  → Is it secondary? → Use BookCloth (#CC785C)
```

### 5. I need to show an error
```
Always use Error (#EF343B)
```

---

## 🎨 Color Combinations (Proven Pairings)

### Light Mode Card
```
Background:  Ivory Light (#FAFAF7)
Border:      Cloud Light (#BFBFBA)
Text:        Slate Light (#40403E)
Accent:      Focus (#2D8AF7) or BookCloth (#CC785C)
✓ GOOD: High contrast, warm, accessible
```

### Dark Mode Card
```
Background:  Slate Medium (#262625)
Border:      Slate Light (#40403E)
Text:        Ivory Dark (#E5E4DF)
Accent:      Focus (#2D8AF7) or BookCloth (#CC785C)
✓ GOOD: Inverted properly, same accents
```

### Error State
```
Background:  Ivory Light or Slate Dark
Border:      Error (#EF343B)
Text:        Error (#EF343B)
Icon:        Error (#EF343B)
✓ GOOD: Clear, semantic, accessible
```

### Disabled State
```
Background:  (unchanged)
Border:      Cloud Medium (#91918D)
Text:        Cloud Light (#BFBFBA)
Opacity:     60%
✓ GOOD: Visibly disabled, not confusing
```

---

## 🔤 Typography Combos (Copy-Paste Ready)

### Page Header
```
Font:        Anthropic Sans
Size:        LG (18px) → MD (16px) if mobile
Weight:      Bold (700)
Color:       Slate Light (light) or Ivory Dark (dark)
Line-Height: 1.2
Margin-bottom: 32px
```

### Section Heading
```
Font:        Anthropic Sans
Size:        MD (16px)
Weight:      Semibold (600)
Color:       Slate Light (light) or Ivory Dark (dark)
Line-Height: 1.5
Margin-bottom: 16px
```

### Body Text
```
Font:        Anthropic Sans
Size:        MD (16px)
Weight:      Regular (400)
Color:       Slate Light (light) or Ivory Dark (dark)
Line-Height: 1.5
```

### Secondary Text / Help Text
```
Font:        Anthropic Sans
Size:        SM (14px)
Weight:      Regular (400)
Color:       Cloud Dark (#666663) (light) or Cloud Medium (dark)
Line-Height: 1.5
Margin-top:  8px
```

### Code / Monospace
```
Font:        JetBrains Mono
Size:        SM (14px)
Weight:      Regular (400)
Color:       Slate Light (light) or Ivory Dark (dark)
Background:  Ivory Medium (#F0FDEB) or Slate Medium
Line-Height: 1.5
Padding:     8px (inline), 16px (block)
```

### Label / Tiny Text
```
Font:        Anthropic Sans
Size:        XS (12px)
Weight:      Medium (500)
Color:       Cloud Dark
Uppercase:   Acceptable for labels only
```

---

## 📦 Component Templates

### Primary Button
```html
<button class="px-4 py-3 bg-focus text-white rounded-md font-semibold 
                hover:opacity-90 focus:ring-2 focus:ring-offset-2 
                focus:ring-focus transition-all">
  Click me
</button>
```
**Copy into Figma:** Focus blue bg, white text, 12px padding, md radius

### Secondary Button
```html
<button class="px-4 py-3 bg-book-cloth text-white rounded-md 
                font-semibold hover:opacity-90 focus:ring-2 
                focus:ring-offset-2 focus:ring-focus transition-all">
  Secondary
</button>
```
**Copy into Figma:** BookCloth bg, white text, 12px padding, md radius

### Ghost Button
```html
<button class="px-4 py-3 bg-transparent border border-cloud-light 
                text-slate-light rounded-md font-semibold hover:bg-ivory-medium 
                focus:ring-2 focus:ring-focus transition-all">
  Tertiary
</button>
```
**Copy into Figma:** Transparent bg, Cloud Light border, Slate Light text

### Card (Light)
```html
<div class="p-6 bg-ivory-light border border-cloud-light rounded-md shadow-sm">
  <h2 class="text-base font-semibold text-slate-light mb-4">Heading</h2>
  <p class="text-base font-regular text-slate-light">Body text here...</p>
</div>
```
**Copy into Figma:** Ivory Light bg, Cloud Light border 1px, 24px padding, md radius, sm shadow

### Card (Dark)
```html
<div class="p-6 bg-slate-medium border border-slate-light rounded-md shadow-sm">
  <h2 class="text-base font-semibold text-ivory-dark mb-4">Heading</h2>
  <p class="text-base font-regular text-ivory-dark">Body text here...</p>
</div>
```
**Copy into Figma:** Slate Medium bg, Slate Light border 1px, 24px padding, md radius, sm shadow

### Input Field
```html
<input type="text" placeholder="Enter text..." 
       class="w-full px-3 py-2 border border-cloud-light rounded-md 
               bg-ivory-light text-slate-light placeholder-cloud-medium
               focus:outline-none focus:ring-2 focus:ring-focus 
               focus:border-transparent transition-all">
```
**Copy into Figma:** Ivory Light bg, Cloud Light border, 12px padding, md radius

### Chip / Tag
```html
<span class="inline-flex items-center gap-2 px-3 py-2 bg-ivory-medium 
             border border-cloud-light rounded-full text-sm font-medium 
             text-slate-light">
  Tag
  <button class="text-cloud-dark hover:text-slate-light">×</button>
</span>
```
**Copy into Figma:** Ivory Medium bg, Cloud Light border, full radius, 12px padding

---

## ⚡ Quick Decision Moments

### "This needs visual hierarchy"
→ Use sizing: LG heading, MD body, SM secondary

### "This needs to feel premium"
→ Add generous spacing (32px+ gaps), use BookCloth accent, reduce clutter

### "This needs to feel urgent"
→ Use Error red, but ONLY for errors/destructive actions

### "This needs interactivity to pop"
→ Use Focus blue, always with clear focus ring

### "I need a secondary accent"
→ Use BookCloth ONLY, never a different color

### "I need to disable something"
→ CloudMedium + 60% opacity, remove hover effect

### "I need to show dark mode"
→ Invert Ivory ↔ Slate, keep accents (Focus, BookCloth, Error)

### "I have too many colors"
→ Delete colors until you're back to 13 total

### "I have too many text sizes"
→ Delete sizes until you're back to 4 total (XS, SM, MD, LG)

### "My spacing is off"
→ Check if all values are multiples of 8 (0, 8, 16, 24, 32, 40, 48...)

---

## 🔍 Pre-Handoff Checklist

Before handing off design to engineering:

- [ ] **Color audit:** Count colors. If > 13, remove one per new color added
- [ ] **Typography audit:** Count font sizes. If > 4 (XS/SM/MD/LG), consolidate
- [ ] **Spacing audit:** All padding/margin multiples of 8? (8, 16, 24, 32, 40, 48...)
- [ ] **Button audit:** Only 2-3 button variants? (Primary, Secondary, Ghost max)
- [ ] **Focus rings:** All interactive elements have 2px Focus blue ring?
- [ ] **Disabled state:** Uses CloudMedium + 60% opacity?
- [ ] **Dark mode:** Ivory ↔ Slate inverted, accents unchanged?
- [ ] **Contrast:** Text 4.5:1, graphics 3:1 minimum (test with WebAIM)?
- [ ] **Border radius:** Cards/inputs all md (4px)? No random radii?
- [ ] **Shadows:** Only cards have shadows (sm level)?
- [ ] **Hover effect:** Opacity only, no color changes?
- [ ] **Material names:** Using Anthropic naming (Slate, Cloud, BookCloth) not generic?

---

## 📱 Responsive Patterns

### Typography at Different Sizes
```
Desktop              Tablet               Mobile
────────────────────────────────────────────────
LG (18px)    →      MD (16px)     →     MD (16px)
MD (16px)    →      MD (16px)     →     SM (14px)
SM (14px)    →      SM (14px)     →     SM (14px)
XS (12px)    →      XS (12px)     →     XS (12px)
```

### Spacing at Different Sizes
```
Desktop              Tablet               Mobile
────────────────────────────────────────────────
32px gaps   →       24px gaps     →      16px gaps
24px padding →      16px padding  →      16px padding
12px button →       12px button   →      14px button (tap target)
```

### When to Stack
- **Desktop:** Side-by-side cards, 2-3 columns
- **Tablet:** 2 columns, 16px gap
- **Mobile:** 1 column, 16px gap, stack everything

---

## 🎓 Common Mistakes & Fixes

### ❌ "All my buttons are blue"
→ Fix: Use Focus for primary only, BookCloth for secondary, Ghost for tertiary

### ❌ "My text is too small"
→ Fix: Increase to MD (16px) minimum, use SM (14px) for secondary only

### ❌ "Everything looks cramped"
→ Fix: Increase spacing to 24px padding (cards), 32px gaps (sections)

### ❌ "I can't tell what's disabled"
→ Fix: Use CloudMedium border + 60% opacity + remove hover effect

### ❌ "My dark mode looks weird"
→ Fix: Did you invert Ivory ↔ Slate? Did you keep BookCloth/Focus/Error the same?

### ❌ "My colors don't look warm"
→ Fix: Remove cool blues. Are you using BookCloth (#CC785C)? Increase warmth.

### ❌ "Focus rings are ugly"
→ Fix: Use 2px Focus blue ring with 2px offset. Style them in globals.css as:
```css
button:focus {
  outline: 2px solid #2D8AF7;
  outline-offset: 2px;
}
```

### ❌ "I have 20 different button styles"
→ Fix: Pick only 2-3. Stop adding variants.

### ❌ "My spacing is inconsistent"
→ Fix: Audit every padding/margin. Are they all multiples of 8?

### ❌ "Hover effects are jerky"
→ Fix: Always use opacity (0 → 0.9), never change colors. Add `transition-all duration-base`

---

## 💾 Copy-Paste Color Values

For quick paste into Figma, CSS, or code:

```
Slate Dark:     #191919
Slate Medium:   #262625
Slate Light:    #40403E

Cloud Dark:     #666663
Cloud Medium:   #91918D
Cloud Light:    #BFBFBA

Ivory Dark:     #E5E4DF
Ivory Medium:   #F0FDEB
Ivory Light:    #FAFAF7

Book Cloth:     #CC785C
Kraft:          #D4A27F
Manilla:        #EBDBBC

Focus:          #2D8AF7
Error:          #EF343B

Black:          #000000
White:          #FFFFFF
```

---

## 🎬 One-Minute Reference

> **Pick background** (Ivory Light or Slate Dark)  
> **Pick text** (Slate Light or Ivory Dark)  
> **Pick accent** (Focus or BookCloth)  
> **Pick size** (XS/SM/MD/LG)  
> **Use 8px spacing**  
> **Add focus ring**  
> **Test contrast**  
> Done.

---

## ✨ The Anthropic Feeling

If your design feels:
- ✅ **Warm** (earthy tones, not neon)
- ✅ **Restrained** (< 13 colors, < 4 sizes)
- ✅ **Clear** (high contrast, obvious interactive elements)
- ✅ **Accessible** (focus rings, semantic colors, 4.5:1 contrast)
- ✅ **Premium** (generous spacing, careful typography)

→ You're nailing it.

If it feels:
- ❌ **Cold** (too much blue, no warmth)
- ❌ **Busy** (too many colors, too many sizes)
- ❌ **Cramped** (gaps < 16px, padding < 12px)
- ❌ **Unclear** (no focus rings, color-only meaning)
- ❌ **Generic** (looks like every other product)

→ Go back and simplify. Remove, don't add.
