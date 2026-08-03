import type { SectionId } from "../types";

export const SECTION: Record<SectionId, SectionId> = {
  hero: "hero",
  heritage: "heritage",
  challenge: "challenge",
  research: "research",
  personas: "personas",
  identity: "identity",
  packaging: "packaging",
  innovation: "innovation",
  marketing: "marketing",
  build: "build",
  vision: "vision",
  final: "final",
} as const;

export const SECTION_ORDER: readonly SectionId[] = [
  "hero",
  "heritage",
  "challenge",
  "research",
  "personas",
  "identity",
  "packaging",
  "innovation",
  "marketing",
  "build",
  "vision",
  "final",
] as const;

export const SITE = {
  title: "Rooh Afza — Reimagined",
  description:
    "An immersive brand experience exploring the relaunch of Rooh Afza for a new generation.",
  url: "https://roohafza-ubc.ca",
  instagram: "https://www.instagram.com/roohafza_",
  email: "sipandslayroohafza@gmail.com",
} as const;

export const TEAM = {
  members: [
    { name: "Narinderpal Singh", role: "Developer" },
    { name: "Mannat Arora", role: "Designer" },
    { name: "Kashika Bhatia", role: "Strategist" },
    { name: "Manraj Singh Chandi", role: "Researcher" },
  ],
} as const;

export const PERFORMANCE = {
  MAX_BUNDLE_SIZE_KB_GZIP: 500,
  TARGET_FPS: 60,
  LIGHTHOUSE: {
    performance: 90,
    accessibility: 100,
    bestPractices: 95,
    seo: 95,
  },
} as const;
