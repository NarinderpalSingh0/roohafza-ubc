import tokens from "./design-tokens.json";

export const theme = {
  color: {
    raw: tokens.raw.colors,
    background: tokens.semantic.color.background,
    surface: tokens.semantic.color.surface,
    text: tokens.semantic.color.text,
    border: tokens.semantic.color.border,
    interactive: tokens.semantic.color.interactive,
    status: tokens.semantic.color.status,
  },
  typography: {
    raw: tokens.raw.typography,
    heading: tokens.semantic.typography.heading,
    body: tokens.semantic.typography.body,
    label: tokens.semantic.typography.label,
    caption: tokens.semantic.typography.caption,
  },
  spacing: {
    raw: tokens.raw.spacing,
    section: tokens.semantic.spacing.section,
    container: tokens.semantic.spacing.container,
  },
  borderRadius: tokens.raw.borderRadius,
  boxShadow: tokens.raw.boxShadow,
  animation: tokens.raw.animation,
  breakpoint: tokens.raw.breakpoint,
  zIndex: tokens.raw.zIndex,
} as const;

export type Theme = typeof theme;
