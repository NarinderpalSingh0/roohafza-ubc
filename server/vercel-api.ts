import type { IncomingMessage, ServerResponse } from "node:http";
import { createApp } from "./_core/app";

const app = createApp();

/**
 * Source entry for Vercel's generated api/index.js function. The build script
 * bundles this module so all local Express+tRPC dependencies ship with the
 * serverless function.
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
