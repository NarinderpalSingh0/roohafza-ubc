import { lazy } from "react";
import type { SectionConfig, SectionId } from "../types";
import { SECTION } from "../constants";

export const sections: readonly SectionConfig[] = [
  {
    id: SECTION.hero,
    component: lazy(() => import("../components/sections/HeroSection")),
    tier: 1,
    hasAnimation: true,
  },
  {
    id: SECTION.marquee,
    component: lazy(() => import("../components/sections/MarqueeSection")),
    tier: 1,
    hasAnimation: false,
  },
  {
    id: SECTION.heritage,
    component: lazy(() => import("../components/sections/HeritageSection")),
    tier: 1,
    hasAnimation: true,
  },
  {
    id: SECTION["bridge-1"],
    component: lazy(() => import("../components/sections/BridgeSection")),
    tier: 1,
    hasAnimation: false,
  },
  {
    id: SECTION.challenge,
    component: lazy(() => import("../components/sections/ChallengeSection")),
    tier: 1,
    hasAnimation: true,
  },
  {
    id: SECTION.research,
    component: lazy(() => import("../components/sections/ResearchSection")),
    tier: 1,
    hasAnimation: true,
  },
  {
    id: SECTION["market-reality"],
    component: lazy(() => import("../components/sections/MarketRealitySection")),
    tier: 1,
    hasAnimation: true,
  },
  {
    id: SECTION.personas,
    component: lazy(() => import("../components/sections/PersonasSection")),
    tier: 1,
    hasAnimation: true,
  },
  {
    id: SECTION.identity,
    component: lazy(() => import("../components/sections/IdentitySection")),
    tier: 1,
    hasAnimation: true,
  },
  {
    id: SECTION["bridge-2"],
    component: lazy(() => import("../components/sections/Bridge2Section")),
    tier: 1,
    hasAnimation: false,
  },
  {
    id: SECTION.packaging,
    component: lazy(() => import("../components/sections/PackagingSection")),
    tier: 1,
    hasAnimation: true,
  },
  {
    id: SECTION.innovation,
    component: lazy(() => import("../components/sections/InnovationSection")),
    tier: 1,
    hasAnimation: true,
  },
  {
    id: SECTION.marketing,
    component: lazy(() => import("../components/sections/MarketingSection")),
    tier: 1,
    hasAnimation: true,
  },
  {
    id: SECTION.build,
    component: lazy(() => import("../components/sections/BuildSection")),
    tier: 1,
    hasAnimation: true,
  },
  {
    id: SECTION.vision,
    component: lazy(() => import("../components/sections/VisionSection")),
    tier: 1,
    hasAnimation: true,
  },
  {
    id: SECTION["social-proof"],
    component: lazy(() => import("../components/sections/SocialProofSection")),
    tier: 1,
    hasAnimation: false,
  },
  {
    id: SECTION.final,
    component: lazy(() => import("../components/sections/FinalSection")),
    tier: 1,
    hasAnimation: false,
  },
] as const;

export function getSection(id: SectionId): SectionConfig | undefined {
  return sections.find((s) => s.id === id);
}

export function getSectionIndex(id: SectionId): number {
  return sections.findIndex((s) => s.id === id);
}

export const sectionComponentMap: Record<SectionId, SectionConfig["component"]> =
  Object.fromEntries(sections.map((s) => [s.id, s.component])) as Record<
    SectionId,
    SectionConfig["component"]
  >;
