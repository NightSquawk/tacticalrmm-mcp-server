import { DEFAULT_TIMEOUT_MS, ENV } from "../constants.js";
import type { TacticalRmmConfig } from "../types.js";

export function loadConfig(): TacticalRmmConfig {
  const baseUrl = process.env[ENV.baseUrl]?.trim();
  const apiKey = process.env[ENV.apiKey]?.trim();
  const timeoutRaw = process.env[ENV.timeoutMs]?.trim();

  if (!baseUrl) {
    throw new Error(`${ENV.baseUrl} is required, for example https://api.example.com`);
  }

  if (!apiKey) {
    throw new Error(`${ENV.apiKey} is required. Create an API key in TacticalRMM Settings > Global Settings > API Keys.`);
  }

  const timeoutMs = timeoutRaw ? Number.parseInt(timeoutRaw, 10) : DEFAULT_TIMEOUT_MS;
  if (!Number.isFinite(timeoutMs) || timeoutMs < 1_000) {
    throw new Error(`${ENV.timeoutMs} must be an integer of at least 1000 milliseconds.`);
  }

  return {
    baseUrl: baseUrl.replace(/\/+$/, ""),
    apiKey,
    timeoutMs
  };
}
