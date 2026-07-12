import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { TacticalRmmClient } from "../services/tacticalrmm-client.js";
import { formatApiError } from "../services/errors.js";
import { ListClientsSchema, type ListClientsInput } from "../schemas/clients.js";
import { formatResponse, makeToolResponse, paginate, summarizeRecord } from "./format.js";

export function registerClientTools(server: McpServer, client: TacticalRmmClient): void {
  server.registerTool(
    "tacticalrmm_list_clients",
    {
      title: "List TacticalRMM Clients",
      description: "List clients visible to the TacticalRMM API key from /clients/. This tool is read-only.",
      inputSchema: ListClientsSchema.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async ({ limit, offset, response_format }: ListClientsInput) => {
      try {
        const clients = await client.get<unknown[]>("/clients/");
        const data = paginate(clients, limit, offset);
        const markdown = [
          "# TacticalRMM Clients",
          "",
          `Showing ${data.count} of ${data.total} clients.`,
          "",
          ...data.items.map((item) => `- ${summarizeRecord(item, ["id", "name"])}`)
        ].join("\n");

        return makeToolResponse(data, formatResponse(response_format, data, markdown));
      } catch (error) {
        const data = { error: formatApiError(error) };
        return makeToolResponse(data, data.error, true);
      }
    }
  );
}
