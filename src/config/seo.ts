import { SITE, TEAM } from "../constants";

export const seo = {
  title: SITE.title,
  description: SITE.description,
  url: SITE.url,
  og: {
    type: "website",
    title: SITE.title,
    description: SITE.description,
    image: `${SITE.url}/og-image.png`,
  },
  twitter: {
    card: "summary_large_image" as const,
    title: SITE.title,
    description: SITE.description,
  },
  team: TEAM.members.map((m) => m.name).join(", "),
} as const;
