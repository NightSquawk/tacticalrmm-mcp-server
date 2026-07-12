# @nightsquawktech/tacticalrmm-mcp-server

[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/NightSquawk/tacticalrmm-mcp-server/badge)](https://scorecard.dev/viewer/?uri=github.com/NightSquawk/tacticalrmm-mcp-server)

Simple Model Context Protocol server for self-hosted TacticalRMM instances.

## Feasibility

TacticalRMM exposes a Django REST Framework API used by its Vue frontend. API keys are sent with the `X-API-KEY` header, and TacticalRMM endpoints require trailing slashes. API keys bypass 2FA and inherit the permissions of the TacticalRMM user selected when the key is created.

This first pass is intentionally read-only. Command and script endpoints such as `/agents/<agent_id>/cmd/` and `/agents/<agent_id>/runscript/` are not exposed yet because they execute code on managed endpoints.

## Tools

- `tacticalrmm_get_server_info` reads `/core/version/` and `/core/dashinfo/`.
- `tacticalrmm_list_clients` reads `/clients/`.
- `tacticalrmm_list_agents` reads `/agents/` with optional filters.
- `tacticalrmm_get_agent` reads `/agents/<agent_id>/`.
- `tacticalrmm_list_agent_software` reads `/software/<agent_id>/`.
- `tacticalrmm_list_sites` reads `/clients/sites/`.
- `tacticalrmm_list_agent_services` reads `/services/<agent_id>/`.
- `tacticalrmm_list_win_updates` reads `/winupdate/<agent_id>/`.
- `tacticalrmm_list_alerts` queries `/alerts/` using TacticalRMM's alert filter payload.
- `tacticalrmm_list_checks` reads `/checks/`.
- `tacticalrmm_list_agent_checks` reads `/agents/<agent_id>/checks/`.
- `tacticalrmm_get_check_history` queries `/checks/<check_id>/history/` using TacticalRMM's history filter payload.
- `tacticalrmm_list_tasks` reads `/tasks/`.
- `tacticalrmm_list_agent_tasks` reads `/agents/<agent_id>/tasks/`.
- `tacticalrmm_list_scripts` reads `/scripts/`.
- `tacticalrmm_list_policies` reads `/automation/policies/`.
- `tacticalrmm_list_agent_history` reads `/agents/<agent_id>/history/`.
- `tacticalrmm_list_agent_notes` reads `/agents/<agent_id>/notes/`.
- `tacticalrmm_list_pending_actions` reads `/logs/pendingactions/`.
- `tacticalrmm_list_agent_pending_actions` reads `/agents/<agent_id>/pendingactions/`.
- `tacticalrmm_get_custom_fields` reads `/core/customfields/`.
- `tacticalrmm_get_audit_logs` queries `/logs/audit/` using TacticalRMM's audit-log filter payload.

## Setup

Configure your MCP client to run the server with `npx`:

```json
{
  "mcpServers": {
    "tacticalrmm": {
      "command": "npx",
      "args": ["-y", "@nightsquawktech/tacticalrmm-mcp-server"],
      "env": {
        "TACTICALRMM_BASE_URL": "https://api.your-instance.example.com",
        "TACTICALRMM_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TACTICALRMM_BASE_URL` | Yes | Base URL of your TacticalRMM API host, e.g. `https://api.your-instance.example.com` |
| `TACTICALRMM_API_KEY` | Yes | TacticalRMM API key, sent as `X-API-KEY` |
| `TACTICALRMM_TIMEOUT_MS` | No | HTTP request timeout in milliseconds, default `30000` |

## Development

```sh
npm install
npm run dev
npm run build
```

The server uses `stdio` by default for local MCP clients. Use stderr for logs so stdout remains reserved for MCP protocol messages.

## License

Licensed under the [GNU AGPL v3.0](./LICENSE). Free for personal and open-source use.

Organizations that cannot comply with the AGPL can purchase a commercial license. See [COMMERCIAL.md](./COMMERCIAL.md) or contact hello@nightsquawk.tech.
