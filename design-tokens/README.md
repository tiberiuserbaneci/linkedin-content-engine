# Design System Tokens

This directory contains the design system tokens extracted from the Anthropic UI Kit, organized in multiple formats for maximum flexibility.

## Files

- **tokens.json** - Design tokens in JSON format (design token standard)
- **../tailwind.config.ts** - Tailwind CSS configuration using these tokens
- **../styles/globals.css** - CSS custom properties and base styles
- **../lib/design-system/theme.ts** - TypeScript types and utilities

## Color Palette

The design system includes a comprehensive color palette with semantic naming:

### Primary Colors
- `primary.*` - Main brand colors (blue tones)
- **Usage**: CTA buttons, links, active states

### Secondary Colors
- `secondary.*` - Supporting accent colors (orange tones)
- **Usage**: Secondary actions, highlights

### Semantic Colors
- `success.*` - Success states (green)
- `warning.*` - Warning states (amber)
- `error.*` - Error states (red)
- `accent.*` - Additional accent color (purple)
- `neutral.*` - Gray scale for text, backgrounds, borders

## Typography

### Font Families
- **primary**: Inter (primary text and UI)
- **mono**: Menlo/Monaco (code blocks, monospace text)

### Font Sizes
From `xs` (0.75rem) to `6xl` (3.75rem)

### Font Weights
- light: 300
- regular: 400
- medium: 500
- semibold: 600
- bold: 700

### Line Heights
- tight: 1.2
- normal: 1.5
- relaxed: 1.625
- loose: 2

## Spacing

8px base unit with a modular scale:
0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64px

## Border Radius

From `none` (0) to `full` (9999px) for creating rounded corners.

## Shadows

5 levels of elevation shadows for depth and hierarchy.

## Transitions

Three standard durations:
- fast: 150ms
- base: 250ms
- slow: 350ms

## Usage

### In React Components

```tsx
import { colors, spacing, typography } from '@/lib/design-system/theme'

export function Button() {
  return (
    <button
      style={{
        backgroundColor: colors.primary['500'],
        padding: spacing['4'],
        fontSize: typography.fontSize.base,
      }}
    >
      Click me
    </button>
  )
}
```

### With Tailwind CSS

```tsx
export function Card() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-neutral-200">
      <h2 className="text-2xl font-semibold text-neutral-900">Title</h2>
      <p className="text-base text-neutral-600 mt-2">Description</p>
    </div>
  )
}
```

### With CSS Variables

```css
.button {
  background-color: var(--color-primary-500);
  padding: var(--spacing-4);
  border-radius: var(--border-radius-md);
}
```

## Customization

To customize the design system:

1. **Edit tokens.json** - Update the base token values
2. **tailwind.config.ts** - Automatically uses the updated tokens
3. **styles/globals.css** - Update CSS variables if using them directly
4. **theme.ts** - TypeScript types are automatically typed from tokens.json

## Integration

The design system is integrated into:
- **Tailwind CSS** - Via `tailwind.config.ts`
- **CSS Variables** - Via `styles/globals.css`
- **TypeScript** - Via `lib/design-system/theme.ts`

Choose the approach that works best for your components or mix and match as needed.
