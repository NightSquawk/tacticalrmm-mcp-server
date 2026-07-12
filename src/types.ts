export type TacticalRmmMethod = "GET" | "PATCH";

export type ResponseFormat = "markdown" | "json";

export interface TacticalRmmConfig {
  baseUrl: string;
  apiKey: string;
  timeoutMs: number;
}

export interface PaginatedItems<T> {
  [key: string]: unknown;
  total: number;
  count: number;
  offset: number;
  items: T[];
  has_more: boolean;
  next_offset?: number;
}

export interface ToolResponse<T extends Record<string, unknown>> {
  [key: string]: unknown;
  content: Array<{ type: "text"; text: string }>;
  structuredContent: T;
  isError?: boolean;
}
