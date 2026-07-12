import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { TacticalRmmClient } from "../services/tacticalrmm-client.js";
import { AgentIdSchema, ListAgentsSchema, type AgentIdInput, type ListAgentsInput } from "../schemas/agents.js";
import { formatApiError } from "../services/errors.js";
import { formatResponse, makeToolResponse, paginate, summarizeRecord } from "./format.js";

export function registerAgentTools(server: McpServer, client: TacticalRmmClient): void {
  server.registerTool(
    "tacticalrmm_list_agents",
    {
      title: "List TacticalRMM Agents",
      description: "List agents visible to the TacticalRMM API key from /agents/ with optional client, site, monitoring_type, and detail filters.",
      inputSchema: ListAgentsSchema.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: ListAgentsInput) => {
      try {
        const agents = await client.get<unknown[]>("/agents/", {
          detail: params.detail ? "true" : "false",
          ...(params.client ? { client: params.client } : {}),
          ...(params.site ? { site: params.site } : {}),
          ...(params.monitoring_type ? { monitoring_type: params.monitoring_type } : {})
        });
        const data = paginate(agents, params.limit, params.offset);
        const markdown = [
          "# TacticalRMM Agents",
          "",
          `Showing ${data.count} of ${data.total} agents.`,
          "",
          ...data.items.map((item) =>
            `- ${summarizeRecord(item, ["agent_id", "hostname", "client_name", "site_name", "status", "plat"])}`
          )
        ].join("\n");

        return makeToolResponse(data, formatResponse(params.response_format, data, markdown));
      } catch (error) {
        const data = { error: formatApiError(error) };
        return makeToolResponse(data, data.error, true);
      }
    }
  );

  server.registerTool(
    "tacticalrmm_get_agent",
    {
      title: "Get TacticalRMM Agent",
      description: "Get one TacticalRMM agent record by agent_id from /agents/<agent_id>/. This tool is read-only.",
      inputSchema: AgentIdSchema.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async ({ agent_id, response_format }: AgentIdInput) => {
      try {
        const agent = await client.get<unknown>(`/agents/${encodeURIComponent(agent_id)}/`);
        const data = { agent };
        const markdown = [
          "# TacticalRMM Agent",
          "",
          summarizeRecord(agent, ["agent_id", "hostname", "client_name", "site_name", "status", "plat"])
        ].join("\n");

        return makeToolResponse(data, formatResponse(response_format, data, markdown));
      } catch (error) {
        const data = { error: formatApiError(error) };
        return makeToolResponse(data, data.error, true);
      }
    }
  );

  server.registerTool(
    "tacticalrmm_list_agent_software",
    {
      title: "List TacticalRMM Agent Software",
      description: "List software inventory for a TacticalRMM agent from /software/<agent_id>/. This tool is read-only.",
      inputSchema: AgentIdSchema.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async ({ agent_id, response_format }: AgentIdInput) => {
      try {
        const software = await client.get<unknown[]>(`/software/${encodeURIComponent(agent_id)}/`);
        const data = {
          agent_id,
          total: software.length,
          software
        };
        const markdown = [
          "# TacticalRMM Agent Software",
          "",
          `Found ${software.length} software records for ${agent_id}.`,
          "",
          ...software.slice(0, 100).map((item) => `- ${summarizeRecord(item, ["name", "version", "publisher", "install_date"])}`)
        ].join("\n");

        return makeToolResponse(data, formatResponse(response_format, data, markdown));
      } catch (error) {
        const data = { error: formatApiError(error) };
        return makeToolResponse(data, data.error, true);
      }
    }
  );
}
