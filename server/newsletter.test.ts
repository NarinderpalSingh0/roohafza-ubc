import { describe, expect, it } from "vitest";
import { newsletterSubscriptionInput } from "./newsletter";

describe("newsletter subscription input", () => {
  it("normalizes a valid email address before persistence", () => {
    const parsed = newsletterSubscriptionInput.parse({ email: "  HELLO@ROOHAFZA.IN  " });
    expect(parsed.email).toBe("hello@roohafza.in");
  });

  it("rejects an invalid email address", () => {
    expect(() => newsletterSubscriptionInput.parse({ email: "not-an-email" })).toThrow();
  });
});

