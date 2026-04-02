import type { Config } from 'tailwindcss'
import tokens from './design-tokens/tokens.json'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        slate: tokens.colors.slate,
        cloud: tokens.colors.cloud,
        ivory: tokens.colors.ivory,
        accent: tokens.colors.accent,
        semantic: tokens.colors.semantic,
        base: tokens.colors.base,
      },
      fontFamily: {
        sans: tokens.typography.fontFamily.primary,
        mono: tokens.typography.fontFamily.mono,
      },
      fontSize: tokens.typography.fontSize,
      fontWeight: tokens.typography.fontWeight,
      lineHeight: tokens.typography.lineHeight,
      spacing: tokens.spacing,
      borderRadius: tokens.borderRadius,
      boxShadow: tokens.shadows,
      transitionDuration: tokens.motion.duration,
      transitionTimingFunction: tokens.motion.easing,
    },
  },
  plugins: [],
}

export default config
