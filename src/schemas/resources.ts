import { z } from "zod";
import { LimitSchema, OffsetSchema, ResponseFormatSchema } from "./common.js";

export const ListResourcesSchema = z
  .object({
    limit: LimitSchema,
    offset: OffsetSchema,
    response_format: ResponseFormatSchema
  })
  .strict();

export const AgentResourceSchema = z
  .object({
    agent_id: z.string().min(8).describe("TacticalRMM agent_id value."),
    limit: LimitSchema,
    offset: OffsetSchema,
    response_format: ResponseFormatSchema
  })
  .strict();

export const CheckHistorySchema = z
  .object({
    check_id: z.union([z.string().min(1), z.number().int().positive()]).describe("TacticalRMM check ID."),
    limit: LimitSchema,
    offset: OffsetSchema,
    response_format: ResponseFormatSchema
  })
  .strict();

export const AuditLogsSchema = z
  .object({
    page: z.number().int().min(1).default(1).describe("TacticalRMM audit log page number."),
    rows_per_page: z.number().int().min(1).max(1000).default(100).describe("Audit log rows per page."),
    sort_by: z.string().min(1).default("entry_time").describe("Audit log sort field."),
    descending: z.boolean().default(true).describe("Whether to sort descending."),
    agent_ids: z.array(z.string().min(1)).default([]).describe("Optional TacticalRMM agent IDs to filter."),
    actions: z.array(z.string().min(1)).default([]).describe("Optional audit action names to filter."),
    response_format: ResponseFormatSchema
  })
  .strict();

export type ListResourcesInput = z.infer<typeof ListResourcesSchema>;
export type AgentResourceInput = z.infer<typeof AgentResourceSchema>;
export type CheckHistoryInput = z.infer<typeof CheckHistorySchema>;
export type AuditLogsInput = z.infer<typeof AuditLogsSchema>;
