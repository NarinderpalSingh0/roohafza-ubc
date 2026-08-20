import { describe, expect, it } from "vitest";
import { CAMPAIGN_AUTOPLAY_ENABLED, CAMPAIGN_AUTOPLAY_MS, campaignSlides, getCampaignShopTarget, getNextCampaignIndex } from "../client/src/data/campaignSlides";

describe("campaign carousel configuration", () => {
  it("defines three distinct campaign slides with matching published shop handles", () => {
    expect(campaignSlides).toHaveLength(3);
    expect(campaignSlides.map(slide => slide.handle)).toEqual([
      "roohafza-rose-330ml",
      "roohafza-straberry-330ml",
      "roohafza-berry-bust-330ml",
    ]);
    expect(new Set(campaignSlides.map(slide => slide.image)).size).toBe(3);
  });

  it("uses a positive auto-play interval", () => {
    expect(CAMPAIGN_AUTOPLAY_ENABLED).toBe(true);
    expect(CAMPAIGN_AUTOPLAY_MS).toBeGreaterThan(0);
  });

  it("cycles every slide and maps each CTA to its matching shop card", () => {
    expect(getNextCampaignIndex(0)).toBe(1);
    expect(getNextCampaignIndex(1)).toBe(2);
    expect(getNextCampaignIndex(2)).toBe(0);
    expect(campaignSlides.map(slide => getCampaignShopTarget(slide.handle))).toEqual([
      "shop-roohafza-rose-330ml",
      "shop-roohafza-straberry-330ml",
      "shop-roohafza-berry-bust-330ml",
    ]);
  });
});
