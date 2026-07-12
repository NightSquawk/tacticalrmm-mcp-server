import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { TacticalRmmClient } from "../services/tacticalrmm-client.js";
import { registerAgentTools } from "./agents.js";
import { registerAutomationTools } from "./automation.js";
import { registerClientTools } from "./clients.js";
import { registerInventoryTools } from "./inventory.js";
import { registerLogTools } from "./logs.js";
import { registerMonitoringTools } from "./monitoring.js";
import { registerServerTools } from "./server.js";

export function registerTools(server: McpServer, client: TacticalRmmClient): void {
  registerServerTools(server, client);
  registerClientTools(server, client);
  registerAgentTools(server, client);
  registerInventoryTools(server, client);
  registerMonitoringTools(server, client);
  registerAutomationTools(server, client);
  registerLogTools(server, client);
}
