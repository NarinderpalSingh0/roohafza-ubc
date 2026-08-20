import type { IncomingMessage, ServerResponse } from "node:http";
import { createApp } from "../server/_core/app";

const app = createApp();

/**
 * Vercel routes /api/:path* here through vercel.json. Reconstruct the original
 * path so the shared Express app continues to receive /api/trpc, /api/oauth,
 * and other API requests exactly as it does in local development.
 */
export default function handler(req: IncomingMessage, res: ServerResponse) {
  const host = req.headers.host ?? "localhost";
  const requestUrl = new URL(req.url ?? "/api", `https://${host}`);
  const path = requestUrl.searchParams.get("path")?.replace(/^\/+/, "") ?? "";

  requestUrl.searchParams.delete("path");
  const query = requestUrl.searchParams.toString();
  req.url = `/api${path ? `/${path}` : ""}${query ? `?${query}` : ""}`;

  return app(req, res);
}
