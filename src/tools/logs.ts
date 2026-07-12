import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { TacticalRmmClient } from "../services/tacticalrmm-client.js";
import { AgentResourceSchema, AuditLogsSchema, ListResourcesSchema, type AuditLogsInput } from "../schemas/resources.js";
import { formatApiError } from "../services/errors.js";
import { formatResponse, makeToolResponse, summarizeRecord } from "./format.js";
import { registerCollectionReadTool } from "./read-tools.js";

export function registerLogTools(server: McpServer, client: TacticalRmmClient): void {
  registerCollectionReadTool(server, client, {
    name: "tacticalrmm_list_agent_history",
    title: "List TacticalRMM Agent History",
    description: "List history for one TacticalRMM agent from /agents/<agent_id>/history/. This tool is read-only.",
    inputSchema: AgentResourceSchema.shape,
    path: (params) => `/agents/${encodeURIComponent(String(params.agent_id))}/history/`,
    preferredFields: ["id", "entry_time", "event_type", "message", "description"],
    heading: "TacticalRMM Agent History"
  });

  registerCollectionReadTool(server, client, {
    name: "tacticalrmm_list_agent_notes",
    title: "List TacticalRMM Agent Notes",
    description: "List notes for one TacticalRMM agent from /agents/<agent_id>/notes/. This tool is read-only.",
    inputSchema: AgentResourceSchema.shape,
    path: (params) => `/agents/${encodeURIComponent(String(params.agent_id))}/notes/`,
    preferredFields: ["id", "title", "note", "created_by", "entry_time"],
    heading: "TacticalRMM Agent Notes"
  });

  registerCollectionReadTool(server, client, {
    name: "tacticalrmm_list_pending_actions",
    title: "List TacticalRMM Pending Actions",
    description: "List global pending actions from /logs/pendingactions/. This tool is read-only.",
    inputSchema: ListResourcesSchema.shape,
    path: () => "/logs/pendingactions/",
    preferredFields: ["id", "agent", "hostname", "action_type", "status", "entry_time"],
    heading: "TacticalRMM Pending Actions"
  });

  registerCollectionReadTool(server, client, {
    name: "tacticalrmm_list_agent_pending_actions",
    title: "List TacticalRMM Agent Pending Actions",
    description: "List pending actions for one TacticalRMM agent from /agents/<agent_id>/pendingactions/. This tool is read-only.",
    inputSchema: AgentResourceSchema.shape,
    path: (params) => `/agents/${encodeURIComponent(String(params.agent_id))}/pendingactions/`,
    preferredFields: ["id", "action_type", "status", "entry_time", "result"],
    heading: "TacticalRMM Agent Pending Actions"
  });

  registerCollectionReadTool(server, client, {
    name: "tacticalrmm_get_custom_fields",
    title: "Get TacticalRMM Custom Fields",
    description: "List TacticalRMM custom fields from /core/customfields/. This tool is read-only.",
    inputSchema: ListResourcesSchema.shape,
    path: () => "/core/customfields/",
    preferredFields: ["id", "name", "model", "field_type", "required"],
    heading: "TacticalRMM Custom Fields"
  });

  server.registerTool(
    "tacticalrmm_get_audit_logs",
    {
      title: "Get TacticalRMM Audit Logs",
      description: "Query TacticalRMM audit logs from /logs/audit/. This is a read-only audit-log query; TacticalRMM examples use a PATCH request body for filters.",
      inputSchema: AuditLogsSchema.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: AuditLogsInput) => {
      try {
        const payload = {
          pagination: {
            sortBy: params.sort_by,
            descending: params.descending,
            page: params.page,
            rowsPerPage: params.rows_per_page,
            rowsNumber: 0
          },
          agentFilter: params.agent_ids,
          actionFilter: params.actions
        };
        const data = await client.query<Record<string, unknown>>("/logs/audit/", payload);
        const rows = Array.isArray(data.data) ? data.data : Array.isArray(data.rows) ? data.rows : [];
        const markdown = [
          "# TacticalRMM Audit Logs",
          "",
          `Returned ${rows.length} audit log records.`,
          "",
          ...rows.slice(0, params.rows_per_page).map((item) =>
            `- ${summarizeRecord(item, ["id", "entry_time", "agent", "action", "object_repr", "user"])}`
          )
        ].join("\n");

        return makeToolResponse(data, formatResponse(params.response_format, data, markdown));
      } catch (error) {
        const data = { error: formatApiError(error) };
        return makeToolResponse(data, data.error, true);
      }
    }
  );
}
