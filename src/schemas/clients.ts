import { z } from "zod";
import { LimitSchema, OffsetSchema, ResponseFormatSchema } from "./common.js";

export const ListClientsSchema = z
  .object({
    limit: LimitSchema,
    offset: OffsetSchema,
    response_format: ResponseFormatSchema
  })
  .strict();

export type ListClientsInput = z.infer<typeof ListClientsSchema>;
