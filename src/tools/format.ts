import { RESPONSE_CHARACTER_LIMIT } from "../constants.js";
import type { PaginatedItems, ResponseFormat, ToolResponse } from "../types.js";

export function paginate<T>(items: T[], limit: number, offset: number): PaginatedItems<T> {
  const pageItems = items.slice(offset, offset + limit);
  const hasMore = offset + pageItems.length < items.length;

  return {
    total: items.length,
    count: pageItems.length,
    offset,
    items: pageItems,
    has_more: hasMore,
    ...(hasMore ? { next_offset: offset + pageItems.length } : {})
  };
}

export function makeToolResponse<T extends Record<string, unknown>>(data: T, text: string, isError = false): ToolResponse<T> {
  if (text.length > RESPONSE_CHARACTER_LIMIT) {
    const fitted = fitPaginatedJson(data, text);
    if (fitted) {
      return {
        content: [{ type: "text", text: JSON.stringify(fitted, null, 2) }],
        structuredContent: fitted as T,
        ...(isError ? { isError: true } : {})
      };
    }
  }

  const responseText = text.length > RESPONSE_CHARACTER_LIMIT
    ? `${text.slice(0, RESPONSE_CHARACTER_LIMIT)}\n\nResponse truncated at ${RESPONSE_CHARACTER_LIMIT} characters. Use filters or a smaller limit.`
    : text;

  return {
    content: [{ type: "text", text: responseText }],
    structuredContent: data,
    ...(isError ? { isError: true } : {})
  };
}

function isPaginated(data: Record<string, unknown>): data is Record<string, unknown> & PaginatedItems<unknown> {
  return Array.isArray(data.items) && typeof data.offset === "number" && typeof data.total === "number";
}

/**
 * A JSON page over the character limit used to be cut mid-string, which left invalid JSON.
 * Instead, drop items from the end of the page until it fits, and point next_offset at the
 * first dropped item so the caller can continue from there. Returns undefined when the text
 * is not the JSON rendering of a paginated payload (markdown keeps the plain cut).
 */
function fitPaginatedJson(data: Record<string, unknown>, text: string): Record<string, unknown> | undefined {
  if (!isPaginated(data) || text !== JSON.stringify(data, null, 2)) {
    return undefined;
  }

  const build = (n: number): Record<string, unknown> => {
    const hasMore = data.offset + n < data.total;
    const { next_offset: _ignored, ...rest } = data;
    return {
      ...rest,
      count: n,
      items: data.items.slice(0, n),
      has_more: hasMore,
      ...(hasMore ? { next_offset: data.offset + n } : {}),
      truncated: true,
      truncation_note: `Page reduced from ${data.items.length} to ${n} items to stay under ${RESPONSE_CHARACTER_LIMIT} characters. Continue with next_offset or use a smaller limit.`
    };
  };

  let lo = 0;
  let hi = data.items.length - 1;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (JSON.stringify(build(mid), null, 2).length <= RESPONSE_CHARACTER_LIMIT) {
      lo = mid;
    } else {
      hi = mid - 1;
    }
  }

  const fitted = build(lo);
  return JSON.stringify(fitted, null, 2).length <= RESPONSE_CHARACTER_LIMIT ? fitted : undefined;
}

export function formatResponse<T>(format: ResponseFormat, data: T, markdown: string): string {
  return format === "json" ? JSON.stringify(data, null, 2) : markdown;
}

export function summarizeRecord(record: unknown, preferredFields: string[]): string {
  if (!record || typeof record !== "object") {
    return String(record);
  }

  const source = record as Record<string, unknown>;
  const fields = preferredFields
    .filter((field) => source[field] !== undefined && source[field] !== null && source[field] !== "")
    .map((field) => `${field}: ${String(source[field])}`);

  return fields.length > 0 ? fields.join(", ") : JSON.stringify(record);
}
