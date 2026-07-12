import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { TacticalRmmClient } from "../services/tacticalrmm-client.js";
import { AgentResourceSchema, ListResourcesSchema } from "../schemas/resources.js";
import { registerCollectionReadTool } from "./read-tools.js";

export function registerInventoryTools(server: McpServer, client: TacticalRmmClient): void {
  registerCollectionReadTool(server, client, {
    name: "tacticalrmm_list_sites",
    title: "List TacticalRMM Sites",
    description: "List TacticalRMM sites from /clients/sites/. This tool is read-only.",
    inputSchema: ListResourcesSchema.shape,
    path: () => "/clients/sites/",
    preferredFields: ["id", "name", "client", "client_name"],
    heading: "TacticalRMM Sites"
  });

  registerCollectionReadTool(server, client, {
    name: "tacticalrmm_list_agent_services",
    title: "List TacticalRMM Agent Services",
    description: "List Windows service inventory for an agent from /services/<agent_id>/. This tool is read-only.",
    inputSchema: AgentResourceSchema.shape,
    path: (params) => `/services/${encodeURIComponent(String(params.agent_id))}/`,
    preferredFields: ["name", "display_name", "status", "start_type", "username"],
    heading: "TacticalRMM Agent Services"
  });

  registerCollectionReadTool(server, client, {
    name: "tacticalrmm_list_win_updates",
    title: "List TacticalRMM Windows Updates",
    description: "List Windows Update inventory for an agent from /winupdate/<agent_id>/. This tool is read-only and does not scan or install updates.",
    inputSchema: AgentResourceSchema.shape,
    path: (params) => `/winupdate/${encodeURIComponent(String(params.agent_id))}/`,
    preferredFields: ["title", "kb", "severity", "installed", "approved", "status"],
    heading: "TacticalRMM Windows Updates"
  });
}
