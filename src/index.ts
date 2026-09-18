#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ENV, SERVER_NAME, SERVER_VERSION } from "./constants.js";
import { loadConfig } from "./services/config.js";
import { TacticalRmmClient } from "./services/tacticalrmm-client.js";
import { registerTools } from "./tools/index.js";

async function main(): Promise<void> {
  const config = loadConfig();
  const client = new TacticalRmmClient(config);
  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION
  });

  registerTools(server, client);

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`${SERVER_NAME} ${SERVER_VERSION} running on stdio`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`${SERVER_NAME} failed to start: ${redactSecrets(message)}`);
  process.exit(1);
});

// Defense in depth: a startup failure should never be able to echo the
// configured TacticalRMM API key back out, even if some upstream error
// (ours or a dependency's) happened to interpolate it into a message.
function redactSecrets(message: string): string {
  const apiKey = process.env[ENV.apiKey];
  if (!apiKey) {
    return message;
  }
  return message.split(apiKey).join("[REDACTED]");
}
