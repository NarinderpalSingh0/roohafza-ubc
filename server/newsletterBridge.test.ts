import { describe, expect, it, vi } from "vitest";
import { sendNewsletterConfirmation } from "./newsletterBridge";

describe("newsletter confirmation bridge", () => {
  it("does not attempt delivery until both private server settings are present", async () => {
    const fetchImpl = vi.fn();

    const result = await sendNewsletterConfirmation("hello@roohafza.in", {
      bridgeUrl: "",
      bridgeSecret: "",
      fetchImpl,
    });

    expect(result).toEqual({ status: "not_configured" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("posts the subscriber email and private bridge token from the server", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));

    const result = await sendNewsletterConfirmation("hello@roohafza.in", {
      bridgeUrl: "https://bridge.example/exec",
      bridgeSecret: "server-only-token",
      fetchImpl,
    });

    expect(result).toEqual({ status: "sent" });
    expect(fetchImpl).toHaveBeenCalledWith(
      "https://bridge.example/exec",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "hello@roohafza.in", secret: "server-only-token" }),
      }),
    );
  });

  it("keeps the subscription flow resilient when the bridge rejects a request", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: false }), { status: 401 }));

    const result = await sendNewsletterConfirmation("hello@roohafza.in", {
      bridgeUrl: "https://bridge.example/exec",
      bridgeSecret: "server-only-token",
      fetchImpl,
    });

    expect(result).toEqual({ status: "failed" });
  });

  it.skipIf(process.env.RUN_GMAIL_BRIDGE_INTEGRATION_TEST !== "1")(
    "validates the deployed bridge with the configured server-only credentials",
    async () => {
      const recipient = process.env.GMAIL_BRIDGE_TEST_RECIPIENT;
      expect(recipient).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

      const result = await sendNewsletterConfirmation(recipient!, { timeoutMs: 15_000 });

      expect(result).toEqual({ status: "sent" });
    },
    20_000,
  );
});
