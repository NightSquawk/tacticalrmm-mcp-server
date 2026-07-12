import { z } from "zod";

export const ResponseFormatSchema = z
  .enum(["markdown", "json"])
  .default("markdown")
  .describe("Output format: markdown for human-readable summaries, json for structured output.");

export const LimitSchema = z
  .number()
  .int()
  .min(1)
  .max(100)
  .default(25)
  .describe("Maximum number of items to return.");

export const OffsetSchema = z
  .number()
  .int()
  .min(0)
  .default(0)
  .describe("Number of items to skip locally after receiving the API response.");
