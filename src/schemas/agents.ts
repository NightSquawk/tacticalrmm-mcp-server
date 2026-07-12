import { z } from "zod";
import { LimitSchema, OffsetSchema, ResponseFormatSchema } from "./common.js";

export const ListAgentsSchema = z
  .object({
    detail: z
      .boolean()
      .default(false)
      .describe("Whether TacticalRMM should return detailed agent records."),
    client: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("Optional TacticalRMM client numeric ID filter."),
    site: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("Optional TacticalRMM site numeric ID filter."),
    monitoring_type: z
      .string()
      .min(1)
      .optional()
      .describe("Optional TacticalRMM monitoring type filter."),
    limit: LimitSchema,
    offset: OffsetSchema,
    response_format: ResponseFormatSchema
  })
  .strict();

export const AgentIdSchema = z
  .object({
    agent_id: z.string().min(8).describe("TacticalRMM agent_id value."),
    response_format: ResponseFormatSchema
  })
  .strict();

export type ListAgentsInput = z.infer<typeof ListAgentsSchema>;
export type AgentIdInput = z.infer<typeof AgentIdSchema>;
