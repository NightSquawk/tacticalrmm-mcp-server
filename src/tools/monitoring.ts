import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { TacticalRmmClient } from "../services/tacticalrmm-client.js";
import { AgentResourceSchema, CheckHistorySchema, ListResourcesSchema, type CheckHistoryInput } from "../schemas/resources.js";
import { formatApiError } from "../services/errors.js";
import { formatResponse, makeToolResponse, paginate, summarizeRecord } from "./format.js";
import { extractItems, registerCollectionReadTool } from "./read-tools.js";

export function registerMonitoringTools(server: McpServer, client: TacticalRmmClient): void {
  registerCollectionReadTool(server, client, {
    name: "tacticalrmm_list_alerts",
    title: "List TacticalRMM Alerts",
    description: "List TacticalRMM alerts from /alerts/. This tool is read-only; TacticalRMM expects a PATCH query for alert filters.",
    inputSchema: ListResourcesSchema.shape,
    path: () => "/alerts/",
    method: "query",
    body: () => ({}),
    preferredFields: ["id", "alert_type", "severity", "hostname", "agent_hostname", "message", "status"],
    heading: "TacticalRMM Alerts"
  });

  registerCollectionReadTool(server, client, {
    name: "tacticalrmm_list_checks",
    title: "List TacticalRMM Checks",
    description: "List TacticalRMM checks from /checks/. This tool is read-only.",
    inputSchema: ListResourcesSchema.shape,
    path: () => "/checks/",
    preferredFields: ["id", "name", "check_type", "status", "agent", "agent_hostname"],
    heading: "TacticalRMM Checks"
  });

  registerCollectionReadTool(server, client, {
    name: "tacticalrmm_list_agent_checks",
    title: "List TacticalRMM Agent Checks",
    description: "List checks assigned to one TacticalRMM agent from /agents/<agent_id>/checks/. This tool is read-only.",
    inputSchema: AgentResourceSchema.shape,
    path: (params) => `/agents/${encodeURIComponent(String(params.agent_id))}/checks/`,
    preferredFields: ["id", "name", "check_type", "status", "last_run"],
    heading: "TacticalRMM Agent Checks"
  });

  server.registerTool(
    "tacticalrmm_get_check_history",
    {
      title: "Get TacticalRMM Check History",
      description: "Read history for one TacticalRMM check from /checks/<check_id>/history/. This tool is read-only.",
      inputSchema: CheckHistorySchema.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async ({ check_id, limit, offset, response_format }: CheckHistoryInput) => {
      try {
        const raw = await client.query<unknown>(`/checks/${encodeURIComponent(String(check_id))}/history/`, {
          timeFilter: 0
        });
        const history = extractItems(raw);
        const data = {
          check_id,
          ...paginate(history, limit, offset)
        };
        const markdown = [
          "# TacticalRMM Check History",
          "",
          `Showing ${data.count} of ${data.total} history records for check ${check_id}.`,
          "",
          ...data.items.map((item) => `- ${summarizeRecord(item, ["id", "status", "output", "created", "entry_time", "timestamp"])}`)
        ].join("\n");

        return makeToolResponse(data, formatResponse(response_format, data, markdown));
      } catch (error) {
        const data = { error: formatApiError(error) };
        return makeToolResponse(data, data.error, true);
      }
    }
  );
}
