export const SERVER_NAME = "tacticalrmm-mcp-server";
export const SERVER_VERSION = "0.1.0";

export const ENV = {
  baseUrl: "TACTICALRMM_BASE_URL",
  apiKey: "TACTICALRMM_API_KEY",
  timeoutMs: "TACTICALRMM_TIMEOUT_MS"
} as const;

export const DEFAULT_TIMEOUT_MS = 30_000;
export const RESPONSE_CHARACTER_LIMIT = 25_000;
