import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import type { TacticalRmmClient } from "../services/tacticalrmm-client.js";
import { formatApiError } from "../services/errors.js";
import type { ResponseFormat } from "../types.js";
import { formatResponse, makeToolResponse, paginate, summarizeRecord } from "./format.js";

type ToolParams = Record<string, unknown>;

type CollectionReadOptions = {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, z.ZodTypeAny>;
  path: (params: ToolParams) => string;
  query?: (params: ToolParams) => Record<string, unknown> | undefined;
  body?: (params: ToolParams) => Record<string, unknown> | undefined;
  method?: "get" | "query";
  preferredFields: string[];
  heading: string;
};

type CollectionParams = {
  limit: number;
  offset: number;
  response_format: ResponseFormat;
};

export function registerCollectionReadTool(
  server: McpServer,
  client: TacticalRmmClient,
  options: CollectionReadOptions
): void {
  server.registerTool(
    options.name,
    {
      title: options.title,
      description: options.description,
      inputSchema: options.inputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: ToolParams) => {
      try {
        const paging = params as CollectionParams;
        const raw = options.method === "query"
          ? await client.query<unknown>(options.path(params), options.body?.(params))
          : await client.get<unknown>(options.path(params), options.query?.(params));
        const items = extractItems(raw);
        const data = paginate(items, paging.limit, paging.offset);
        const markdown = [
          `# ${options.heading}`,
          "",
          `Showing ${data.count} of ${data.total} records.`,
          "",
          ...data.items.map((item) => `- ${summarizeRecord(item, options.preferredFields)}`)
        ].join("\n");

        return makeToolResponse(data, formatResponse(paging.response_format, data, markdown));
      } catch (error) {
        const data = { error: formatApiError(error) };
        return makeToolResponse(data, data.error, true);
      }
    }
  );
}

export function extractItems(raw: unknown): unknown[] {
  if (Array.isArray(raw)) {
    return raw;
  }

  if (raw && typeof raw === "object") {
    const source = raw as Record<string, unknown>;
    for (const key of ["results", "items", "data", "rows"]) {
      if (Array.isArray(source[key])) {
        return source[key];
      }
    }
  }

  return raw === undefined || raw === null ? [] : [raw];
}
