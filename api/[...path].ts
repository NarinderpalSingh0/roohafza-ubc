import { createApp } from "../server/_core/app";

// Vercel deploys this Express application as a Node serverless function for
// /api/* routes, including the tRPC, OAuth, and storage-proxy handlers.
export default createApp();
