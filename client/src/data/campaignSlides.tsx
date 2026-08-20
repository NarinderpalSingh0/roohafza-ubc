import React from "react";

import { BRAND_ASSETS } from "./brandAssets";

export const CAMPAIGN_AUTOPLAY_MS = 5600;
export const CAMPAIGN_AUTOPLAY_ENABLED = true;

export const campaignSlides = [
  {
    flavor: "Rose",
    handle: "roohafza-rose-330ml",
    label: "Roohafza hydration break",
    eyebrow: "A bright pause, in your hands",
    title: <>A fresh little<br />break for your<br /><em>everyday.</em></>,
    image: BRAND_ASSETS.roseHydration,
    alt: "A Roohafza Rose can held in two hands against a deep green background.",
    caption: <>Rose.<br />In hand.</>,
    imageNote: "Rose + vitamin C · a bright little pause",
    detail: "A floral-feeling refreshment story for the moments when the day calls for something cool, bright, and uncomplicated.",
    footer: "First sip, fresh start",
    tone: "campaign-rose",
  },
  {
    flavor: "Straberry",
    handle: "roohafza-straberry-330ml",
    label: "Roohafza table talk",
    eyebrow: "A can for the good company",
    title: <>Pass the plate.<br />Pass the<br /><em>bright side.</em></>,
    image: BRAND_ASSETS.sharedTable,
    alt: "Friends sharing Roohafza cans across a table with a Straberry can in front.",
    caption: <>Straberry.<br />Share it.</>,
    imageNote: "Straberry + zinc · made for the table",
    detail: "A lively red can designed for sharing plates, passing stories, and keeping the table conversation flowing.",
    footer: "Made for the table",
    tone: "campaign-straberry",
  },
  {
    flavor: "Berry Bust",
    handle: "roohafza-berry-bust-330ml",
    label: "Roohafza living room drop",
    eyebrow: "When the whole gang is in",
    title: <>Turn the chill<br />into a<br /><em>bright break.</em></>,
    image: BRAND_ASSETS.sharedLounge,
    alt: "Friends gathered around a green sofa holding a Roohafza Berry Bust can.",
    caption: <>Berry Bust.<br />Bring the gang.</>,
    imageNote: "Berry Bust + antioxidants · chill with the crew",
    detail: "A playful berry-led drop for sofa sessions, familiar faces, and a brighter kind of break with the whole crew.",
    footer: "Best with the whole crew",
    tone: "campaign-berry-bust",
  },
] as const;

export function getNextCampaignIndex(currentIndex: number) {
  return (currentIndex + 1) % campaignSlides.length;
}

export function getPreviousCampaignIndex(currentIndex: number) {
  return (currentIndex - 1 + campaignSlides.length) % campaignSlides.length;
}

export function getCampaignIndexForKey(key: string, currentIndex: number) {
  if (key === "ArrowRight") return getNextCampaignIndex(currentIndex);
  if (key === "ArrowLeft") return getPreviousCampaignIndex(currentIndex);
  if (key === "Home") return 0;
  if (key === "End") return campaignSlides.length - 1;
  return currentIndex;
}

export function getRelatedCampaignSlides(handle: string) {
  return campaignSlides.filter(slide => slide.handle !== handle);
}

export function getCampaignShopTarget(handle: string) {
  return `shop-${handle}`;
}
