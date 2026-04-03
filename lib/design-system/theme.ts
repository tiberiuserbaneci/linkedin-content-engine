import tokens from '../../design-tokens/tokens.json'

/**
 * Anthropic Design System Theme
 *
 * Color palette based on material inspiration:
 * - Slate, Cloud, Ivory: Neutral grays for surfaces and text
 * - Book Cloth, Kraft, Manilla: Warm accent tones
 * - Focus: Blue for interactive elements and focus states
 * - Error: Red for error states and alerts
 */

export const colors = {
  slate: tokens.colors.slate,
  cloud: tokens.colors.cloud,
  ivory: tokens.colors.ivory,
  accent: tokens.colors.accent,
  semantic: tokens.colors.semantic,
  base: tokens.colors.base,
} as const

/**
 * Typography system
 *
 * Font families:
 * - Anthropic Sans: Primary UI font
 * - JetBrains Mono: Code and monospace text
 *
 * Sizes: XS, SM, MD, LG (minimal scale)
 * Weights: Regular (400), Medium (500), Semibold (600), Bold (700)
 */
export const typography = {
  fontFamily: tokens.typography.fontFamily,
  fontSize: tokens.typography.fontSize,
  fontWeight: tokens.typography.fontWeight,
  lineHeight: tokens.typography.lineHeight,
  textStyles: tokens.typography.textStyles,
} as const

/**
 * Spacing scale (8px base unit)
 */
export const spacing = tokens.spacing

/**
 * Border radius tokens
 * XS → SM → MD → LG → XL → Full
 */
export const borderRadius = tokens.borderRadius

/**
 * Elevation shadows
 */
export const shadows = tokens.shadows

/**
 * Motion system
 */
export const motion = tokens.motion

/**
 * Get color value by path
 * @example getColor('slate.dark') → '#191919'
 */
export function getColor(path: string): string {
  const [category, shade] = path.split('.')
  const col = colors[category as keyof typeof colors]
  if (col && typeof col === 'object' && shade in col) {
    return col[shade as keyof typeof col] as string
  }
  return path
}

/**
 * Utility types
 */
export type SlateShade = keyof typeof colors.slate
export type CloudShade = keyof typeof colors.cloud
export type IvoryShade = keyof typeof colors.ivory
export type AccentTone = keyof typeof colors.accent
export type SemanticColor = keyof typeof colors.semantic

export type ColorPath =
  | `slate.${SlateShade}`
  | `cloud.${CloudShade}`
  | `ivory.${IvoryShade}`
  | `accent.${AccentTone}`
  | `semantic.${SemanticColor}`
  | `base.black`
  | `base.white`

export type FontSize = keyof typeof typography.fontSize
export type FontWeight = keyof typeof typography.fontWeight
export type TextStyle = keyof typeof typography.textStyles

export type Spacing = keyof typeof spacing
export type BorderRadius = keyof typeof borderRadius
export type Shadow = keyof typeof shadows
export type MotionDuration = keyof typeof motion.duration
export type MotionEasing = keyof typeof motion.easing
