import { z } from "zod";
import { newsletterSubscribers } from "../drizzle/schema";
import { getDb } from "./db";

export const newsletterSubscriptionInput = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address.").max(320),
});

export type NewsletterSubscriptionInput = z.infer<typeof newsletterSubscriptionInput>;

export async function subscribeToNewsletter(input: NewsletterSubscriptionInput) {
  const db = await getDb();
  if (!db) {
    throw new Error("Newsletter subscriptions are temporarily unavailable.");
  }

  await db
    .insert(newsletterSubscribers)
    .values({ email: input.email, source: "homepage" })
    .onDuplicateKeyUpdate({ set: { source: "homepage" } });

  return { email: input.email };
}
