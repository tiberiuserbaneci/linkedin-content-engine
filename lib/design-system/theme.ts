import tokens from '../../design-tokens/tokens.json'

/**
 * Design System Color Palette
 */
export const colors = tokens.colors as Record<string, Record<string, string>>

/**
 * Design System Typography
 */
export const typography = tokens.typography as {
  fontFamily: Record<string, string>
  fontSize: Record<string, string>
  fontWeight: Record<string, number>
  lineHeight: Record<string, number>
  letterSpacing: Record<string, string>
}

/**
 * Design System Spacing Scale
 */
export const spacing = tokens.spacing as Record<string, string>

/**
 * Design System Border Radius
 */
export const borderRadius = tokens.borderRadius as Record<string, string>

/**
 * Design System Shadows
 */
export const shadows = tokens.shadows as Record<string, string>

/**
 * Design System Transitions
 */
export const transitions = tokens.transitions as Record<string, string>

/**
 * Get color value by path (e.g., 'primary.500')
 */
export function getColor(path: string): string {
  const [category, shade] = path.split('.')
  return colors[category]?.[shade] || path
}

/**
 * Utility type for color keys
 */
export type ColorPath =
  | `primary.${keyof typeof colors.primary}`
  | `secondary.${keyof typeof colors.secondary}`
  | `accent.${keyof typeof colors.accent}`
  | `success.${keyof typeof colors.success}`
  | `warning.${keyof typeof colors.warning}`
  | `error.${keyof typeof colors.error}`
  | `neutral.${keyof typeof colors.neutral}`

/**
 * Utility type for typography keys
 */
export type FontSize = keyof typeof typography.fontSize
export type FontWeight = keyof typeof typography.fontWeight
export type LineHeight = keyof typeof typography.lineHeight
export type LetterSpacing = keyof typeof typography.letterSpacing

/**
 * Utility type for spacing
 */
export type Spacing = keyof typeof spacing

/**
 * Utility type for border radius
 */
export type BorderRadius = keyof typeof borderRadius

/**
 * Utility type for shadows
 */
export type Shadow = keyof typeof shadows

/**
 * Utility type for transitions
 */
export type Transition = keyof typeof transitions
