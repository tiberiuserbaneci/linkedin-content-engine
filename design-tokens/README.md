# Anthropic Design System Tokens

This directory contains the official Anthropic design system tokens, extracted from the Anthropic UI Kit Community file.

## Overview

The Anthropic design system emphasizes **restraint, warmth, and accessibility**. It uses a carefully curated palette of material-inspired colors with semantic organization, paired with open typography and a clear motion system.

## Files

- **tokens.json** - Master design tokens in JSON format
- **../tailwind.config.ts** - Tailwind CSS configuration using these tokens
- **../styles/globals.css** - CSS custom properties and semantic base styles
- **../lib/design-system/theme.ts** - TypeScript types and theme utilities

## Color System

The color palette is organized around **surfaces, accents, and semantic states**. Colors are named after physical materials to emphasize their role.

### Neutral Palette

The foundation consists of three neutral families:

- **Slate** (Dark Grays)
  - `dark`: #191919 (primary dark background)
  - `medium`: #262625 (secondary dark)
  - `light`: #40403E (dark text/borders)

- **Cloud** (Medium Grays)
  - `dark`: #666663
  - `medium`: #91918D
  - `light`: #BFBFBA (neutral borders, icons)

- **Ivory** (Light/Off-white)
  - `dark`: #E5E4DF (light text)
  - `medium`: #F0FDEB (secondary light backgrounds)
  - `light`: #FAFAF7 (primary light background)

### Accent Palette

Warm, earthy accent tones for supporting elements:

- **Book Cloth** #CC785C - Primary warm accent
- **Kraft** #D4A27F - Secondary warm accent
- **Manilla** #EBDBBC - Tertiary warm accent

### Semantic Colors

- **Focus** #2D8AF7 - Interactive elements, focus states, links
- **Error** #EF343B - Error states, alerts, destructive actions

### Base Colors

- **Black** #000000 - Text, heavy elements
- **White** #FFFFFF - Pure white overlays, special states

## Typography

The system uses two font families:

- **Anthropic Sans** - Primary UI font for all text and headings (proprietary)
- **JetBrains Mono** - Monospace font for code blocks and technical content

### Font Sizes

A minimal, purposeful scale:

- `xs`: 0.75rem (12px) - Captions, small labels
- `sm`: 0.875rem (14px) - Secondary text
- `md`: 1rem (16px) - Body text, standard size
- `lg`: 1.125rem (18px) - Subheadings, callouts

### Font Weights

- `regular` (400) - Body text, default weight
- `medium` (500) - Emphasis within body text
- `semibold` (600) - Subheadings
- `bold` (700) - Headlines, strong emphasis

### Text Styles

Predefined combinations for consistent usage:

- **Heading Large** - 3xl, bold
- **Heading** - 2xl, semibold
- **Heading Small** - xl, semibold
- **Body** - md, regular
- **Body Emphasized** - md, medium
- **Body Small** - sm, regular
- **Caption** - xs, regular
- **Caption Emphasized** - xs, medium

## Spacing

8px base unit with a clean scale:
`0, 1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64px`

## Border Radius

Six purposeful options:

- `xs` - 0.25rem (2px)
- `sm` - 0.375rem (3px)
- `md` - 0.5rem (4px) - Standard, most components
- `lg` - 0.75rem (6px)
- `xl` - 1rem (8px) - Larger surfaces
- `full` - 9999px - Circles, pills

## Shadows

Subtle elevation system using slate-dark with opacity:

- `none` - No shadow
- `sm` - 0 1px 2px (subtle depth)
- `md` - 0 2px 4px (standard elevation)
- `lg` - 0 4px 8px (raised surface)
- `xl` - 0 8px 16px (floating/modal)

## Motion

Accessible, purposeful animations:

### Durations

- `fast` - 150ms (interactive feedback)
- `base` - 250ms (standard transitions)
- `slow` - 350ms (attention-drawing)

### Easing

- `easeOut` - Appears to move faster initially (element entrances)
- `easeIn` - Slows down at the end (element exits)
- `easeInOut` - Balanced motion (content changes)

## Usage Examples

### React Component with Types

```tsx
import { colors, getColor, type FontSize } from '@/lib/design-system/theme'

export function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="surface p-6">
      <h2 className="text-lg font-semibold" style={{ color: colors.base.black }}>
        {title}
      </h2>
      <p className="text-md text-slate-light mt-4">{children}</p>
    </div>
  )
}
```

### Tailwind CSS

```tsx
export function Button({ children, variant = 'primary' }: { children: React.ReactNode; variant?: 'primary' | 'secondary' }) {
  const variants = {
    primary: 'bg-semantic-focus text-base-white hover:opacity-90',
    secondary: 'bg-accent-book-cloth text-base-white hover:opacity-90',
  }
  
  return (
    <button className={`button ${variants[variant]}`}>
      {children}
    </button>
  )
}
```

### CSS Variables

```css
.custom-element {
  background-color: var(--color-ivory-light);
  color: var(--color-slate-light);
  border: 1px solid var(--color-cloud-light);
  border-radius: var(--color-accent-book-cloth);
  transition: all var(--motion-base) ease-out;
}
```

## Customization

To update the design system:

1. Edit `tokens.json` with new values
2. Tailwind config automatically updates via import
3. CSS variables in `globals.css` auto-generate
4. TypeScript types remain accurate via the JSON schema

## Design Principles

1. **Restraint** - Only 13 colors total, minimal but sufficient
2. **Warmth** - Earthy tones over cold tech aesthetics
3. **Materiality** - Colors named after physical references
4. **Accessibility** - High contrast, clear semantic states
5. **Purposefulness** - Every token has a defined role

## Dark Mode

The system supports dark mode natively. Slate becomes the primary background, with Ivory for text. See `styles/globals.css` for implementation details.
