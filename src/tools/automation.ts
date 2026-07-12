import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { TacticalRmmClient } from "../services/tacticalrmm-client.js";
import { AgentResourceSchema, ListResourcesSchema } from "../schemas/resources.js";
import { registerCollectionReadTool } from "./read-tools.js";

export function registerAutomationTools(server: McpServer, client: TacticalRmmClient): void {
  registerCollectionReadTool(server, client, {
    name: "tacticalrmm_list_tasks",
    title: "List TacticalRMM Tasks",
    description: "List TacticalRMM automated tasks from /tasks/. This tool is read-only and does not run tasks.",
    inputSchema: ListResourcesSchema.shape,
    path: () => "/tasks/",
    preferredFields: ["id", "name", "agent", "agent_hostname", "enabled", "last_run"],
    heading: "TacticalRMM Tasks"
  });

  registerCollectionReadTool(server, client, {
    name: "tacticalrmm_list_agent_tasks",
    title: "List TacticalRMM Agent Tasks",
    description: "List automated tasks assigned to one TacticalRMM agent from /agents/<agent_id>/tasks/. This tool is read-only.",
    inputSchema: AgentResourceSchema.shape,
    path: (params) => `/agents/${encodeURIComponent(String(params.agent_id))}/tasks/`,
    preferredFields: ["id", "name", "enabled", "last_run", "task_result"],
    heading: "TacticalRMM Agent Tasks"
  });

  registerCollectionReadTool(server, client, {
    name: "tacticalrmm_list_scripts",
    title: "List TacticalRMM Scripts",
    description: "List scripts from the TacticalRMM script library at /scripts/. This tool is read-only and does not run scripts.",
    inputSchema: ListResourcesSchema.shape,
    path: () => "/scripts/",
    preferredFields: ["id", "name", "shell", "script_type", "category", "description"],
    heading: "TacticalRMM Scripts"
  });

  registerCollectionReadTool(server, client, {
    name: "tacticalrmm_list_policies",
    title: "List TacticalRMM Policies",
    description: "List automation policies from /automation/policies/. This tool is read-only.",
    inputSchema: ListResourcesSchema.shape,
    path: () => "/automation/policies/",
    preferredFields: ["id", "name", "desc", "enabled"],
    heading: "TacticalRMM Policies"
  });
}
