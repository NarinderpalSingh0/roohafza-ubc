export type NewsletterConfirmationStatus = "sent" | "not_configured" | "failed";

export type NewsletterConfirmationResult = {
  status: NewsletterConfirmationStatus;
};

type NewsletterBridgeOptions = {
  bridgeUrl?: string;
  bridgeSecret?: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
};

function isBridgeSuccess(payload: unknown): boolean {
  return Boolean(payload && typeof payload === "object" && "ok" in payload && payload.ok === true);
}

/**
 * Sends the confirmation request from the server only. A bridge outage must never
 * discard a visitor's successfully persisted newsletter subscription.
 */
export async function sendNewsletterConfirmation(
  email: string,
  options: NewsletterBridgeOptions = {},
): Promise<NewsletterConfirmationResult> {
  const bridgeUrl = options.bridgeUrl ?? process.env.GMAIL_BRIDGE_URL;
  const bridgeSecret = options.bridgeSecret ?? process.env.GMAIL_BRIDGE_SECRET;

  if (!bridgeUrl || !bridgeSecret) {
    return { status: "not_configured" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 8_000);

  try {
    const response = await (options.fetchImpl ?? fetch)(bridgeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, secret: bridgeSecret }),
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => null);
    return response.ok && isBridgeSuccess(payload) ? { status: "sent" } : { status: "failed" };
  } catch (error) {
    console.error("[Newsletter] Confirmation bridge request failed:", error);
    return { status: "failed" };
  } finally {
    clearTimeout(timeout);
  }
}
