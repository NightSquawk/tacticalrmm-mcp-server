import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { TacticalRmmClient } from "../services/tacticalrmm-client.js";
import { formatApiError } from "../services/errors.js";
import { ServerInfoSchema, type ServerInfoInput } from "../schemas/server.js";
import { formatResponse, makeToolResponse } from "./format.js";

export function registerServerTools(server: McpServer, client: TacticalRmmClient): void {
  server.registerTool(
    "tacticalrmm_get_server_info",
    {
      title: "Get TacticalRMM Server Info",
      description: "Read TacticalRMM server version and dashboard information from /core/version/ and /core/dashinfo/.",
      inputSchema: ServerInfoSchema.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async ({ response_format }: ServerInfoInput) => {
      try {
        const [version, dashboard] = await Promise.allSettled([
          client.get<unknown>("/core/version/"),
          client.get<unknown>("/core/dashinfo/")
        ]);

        const data: Record<string, unknown> = {
          version: version.status === "fulfilled" ? version.value : { error: formatApiError(version.reason) },
          dashboard: dashboard.status === "fulfilled" ? dashboard.value : { error: formatApiError(dashboard.reason) }
        };

        const markdown = [
          "# TacticalRMM Server Info",
          "",
          `- Version: ${formatInline(data.version)}`,
          `- Dashboard: ${formatInline(data.dashboard)}`
        ].join("\n");

        return makeToolResponse(data, formatResponse(response_format, data, markdown));
      } catch (error) {
        const data = { error: formatApiError(error) };
        return makeToolResponse(data, data.error, true);
      }
    }
  );
}

function formatInline(value: unknown): string {
  return typeof value === "string" ? value : JSON.stringify(value);
}
