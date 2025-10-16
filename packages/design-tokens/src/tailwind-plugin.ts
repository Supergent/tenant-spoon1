/**
 * Tailwind CSS Plugin
 *
 * Injects theme tokens as CSS variables and extends Tailwind config
 */

import plugin from "tailwindcss/plugin";
import { theme } from "./theme";

export const tailwindPlugin = plugin(
  // Add CSS variables
  function ({ addBase }) {
    addBase({
      ":root": {
        // Colors - Primary
        "--color-primary": theme.palette.primary.base,
        "--color-primary-foreground": theme.palette.primary.foreground,
        "--color-primary-emphasis": theme.palette.primary.emphasis,

        // Colors - Secondary
        "--color-secondary": theme.palette.secondary.base,
        "--color-secondary-foreground": theme.palette.secondary.foreground,
        "--color-secondary-emphasis": theme.palette.secondary.emphasis,

        // Colors - Accent
        "--color-accent": theme.palette.accent.base,
        "--color-accent-foreground": theme.palette.accent.foreground,
        "--color-accent-emphasis": theme.palette.accent.emphasis,

        // Colors - Success
        "--color-success": theme.palette.success.base,
        "--color-success-foreground": theme.palette.success.foreground,
        "--color-success-emphasis": theme.palette.success.emphasis,

        // Colors - Warning
        "--color-warning": theme.palette.warning.base,
        "--color-warning-foreground": theme.palette.warning.foreground,
        "--color-warning-emphasis": theme.palette.warning.emphasis,

        // Colors - Danger
        "--color-danger": theme.palette.danger.base,
        "--color-danger-foreground": theme.palette.danger.foreground,
        "--color-danger-emphasis": theme.palette.danger.emphasis,

        // Neutrals
        "--color-background": theme.neutrals.background,
        "--color-surface": theme.neutrals.surface,
        "--color-muted": theme.neutrals.muted,
        "--color-text-primary": theme.neutrals.textPrimary,
        "--color-text-secondary": theme.neutrals.textSecondary,

        // Border radius
        "--radius-sm": `${theme.radius.sm}px`,
        "--radius-md": `${theme.radius.md}px`,
        "--radius-lg": `${theme.radius.lg}px`,
        "--radius-pill": `${theme.radius.pill}px`,

        // Spacing
        "--spacing-xs": `${theme.spacing.scale.xs}px`,
        "--spacing-sm": `${theme.spacing.scale.sm}px`,
        "--spacing-md": `${theme.spacing.scale.md}px`,
        "--spacing-lg": `${theme.spacing.scale.lg}px`,
        "--spacing-xl": `${theme.spacing.scale.xl}px`,
        "--spacing-2xl": `${theme.spacing.scale["2xl"]}px`,

        // Typography
        "--font-family": theme.typography.fontFamily,
        "--font-headings": theme.typography.headingsFamily,

        // Motion
        "--ease": theme.motion.ease,
        "--duration-fast": `${theme.motion.duration.fast}ms`,
        "--duration-base": `${theme.motion.duration.base}ms`,
        "--duration-slow": `${theme.motion.duration.slow}ms`,
      },
    });
  },
  // Extend Tailwind theme
  {
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: "var(--color-primary)",
            foreground: "var(--color-primary-foreground)",
            emphasis: "var(--color-primary-emphasis)",
          },
          secondary: {
            DEFAULT: "var(--color-secondary)",
            foreground: "var(--color-secondary-foreground)",
            emphasis: "var(--color-secondary-emphasis)",
          },
          accent: {
            DEFAULT: "var(--color-accent)",
            foreground: "var(--color-accent-foreground)",
            emphasis: "var(--color-accent-emphasis)",
          },
          success: {
            DEFAULT: "var(--color-success)",
            foreground: "var(--color-success-foreground)",
            emphasis: "var(--color-success-emphasis)",
          },
          warning: {
            DEFAULT: "var(--color-warning)",
            foreground: "var(--color-warning-foreground)",
            emphasis: "var(--color-warning-emphasis)",
          },
          danger: {
            DEFAULT: "var(--color-danger)",
            foreground: "var(--color-danger-foreground)",
            emphasis: "var(--color-danger-emphasis)",
          },
          background: "var(--color-background)",
          surface: "var(--color-surface)",
          muted: "var(--color-muted)",
          textPrimary: "var(--color-text-primary)",
          textSecondary: "var(--color-text-secondary)",
        },
        borderRadius: {
          sm: "var(--radius-sm)",
          DEFAULT: "var(--radius-md)",
          md: "var(--radius-md)",
          lg: "var(--radius-lg)",
          pill: "var(--radius-pill)",
        },
        fontFamily: {
          sans: theme.typography.fontFamily.split(","),
          headings: theme.typography.headingsFamily.split(","),
        },
        fontSize: {
          xs: [`${theme.typography.scale.xs}px`, { lineHeight: "1.5" }],
          sm: [`${theme.typography.scale.sm}px`, { lineHeight: "1.5" }],
          base: [`${theme.typography.scale.base}px`, { lineHeight: "1.6" }],
          lg: [`${theme.typography.scale.lg}px`, { lineHeight: "1.6" }],
          xl: [`${theme.typography.scale.xl}px`, { lineHeight: "1.4" }],
          "2xl": [`${theme.typography.scale["2xl"]}px`, { lineHeight: "1.3" }],
        },
        fontWeight: {
          regular: theme.typography.weight.regular,
          medium: theme.typography.weight.medium,
          semibold: theme.typography.weight.semibold,
          bold: theme.typography.weight.bold,
        },
        boxShadow: {
          sm: theme.shadows.sm,
          DEFAULT: theme.shadows.md,
          md: theme.shadows.md,
          lg: theme.shadows.lg,
        },
        transitionTimingFunction: {
          DEFAULT: theme.motion.ease,
        },
        transitionDuration: {
          fast: `${theme.motion.duration.fast}ms`,
          DEFAULT: `${theme.motion.duration.base}ms`,
          base: `${theme.motion.duration.base}ms`,
          slow: `${theme.motion.duration.slow}ms`,
        },
      },
    },
  }
);
