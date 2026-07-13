# TacticalRMM MCP Server

[![npm version](https://img.shields.io/npm/v/@nightsquawktech/tacticalrmm-mcp-server)](https://www.npmjs.com/package/@nightsquawktech/tacticalrmm-mcp-server)
[![npm downloads](https://img.shields.io/npm/dm/@nightsquawktech/tacticalrmm-mcp-server)](https://www.npmjs.com/package/@nightsquawktech/tacticalrmm-mcp-server)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/NightSquawk/tacticalrmm-mcp-server/badge)](https://scorecard.dev/viewer/?uri=github.com/NightSquawk/tacticalrmm-mcp-server)
[![License: AGPL-3.0](https://img.shields.io/badge/license-AGPL--3.0-blue)](https://github.com/NightSquawk/tacticalrmm-mcp-server/blob/v1.0.0/LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org)

An MCP (Model Context Protocol) server for **TacticalRMM**, connecting your self-hosted RMM instance to AI tools.

## Quick start

### Claude

[![Download for Claude Desktop](https://img.shields.io/badge/Claude_Desktop-Download_.mcpb-D97757?style=flat-square)](https://github.com/NightSquawk/tacticalrmm-mcp-server/releases/download/mcpb-v0.1.0/tacticalrmm-mcp-server-0.1.0.mcpb)

**bash (macOS/Linux):**

```bash
TACTICALRMM_BASE_URL="https://api.yourdomain.com"
TACTICALRMM_API_KEY="your-api-key"

claude mcp add tacticalrmm \
  --env TACTICALRMM_BASE_URL="$TACTICALRMM_BASE_URL" \
  --env TACTICALRMM_API_KEY="$TACTICALRMM_API_KEY" \
  -- npx -y @nightsquawktech/tacticalrmm-mcp-server
```

**PowerShell (Windows):**

```powershell
$TACTICALRMM_BASE_URL = "https://api.yourdomain.com"
$TACTICALRMM_API_KEY = "your-api-key"

claude mcp add tacticalrmm `
  --env "TACTICALRMM_BASE_URL=$TACTICALRMM_BASE_URL" `
  --env "TACTICALRMM_API_KEY=$TACTICALRMM_API_KEY" `
  -- npx -y @nightsquawktech/tacticalrmm-mcp-server
```

### Cursor

[![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en/install-mcp?name=tacticalrmm&config=eyJjb21tYW5kIjogIm5weCIsICJhcmdzIjogWyIteSIsICJAbmlnaHRzcXVhd2t0ZWNoL3RhY3RpY2Fscm1tLW1jcC1zZXJ2ZXIiXSwgImVudiI6IHsiVEFDVElDQUxSTU1fQkFTRV9VUkwiOiAiaHR0cHM6Ly9hcGkueW91cmRvbWFpbi5jb20iLCAiVEFDVElDQUxSTU1fQVBJX0tFWSI6ICJ5b3VyLWFwaS1rZXkiLCAiVEFDVElDQUxSTU1fVElNRU9VVF9NUyI6ICIzMDAwMCJ9fQ%3D%3D)

Or put the [mcp.json](#mcpjson) block in `.cursor/mcp.json`, then verify with:

```bash
agent mcp list
```

(The Cursor CLI manages configured servers but has no `mcp add`; install is via the button or `mcp.json`.)

### VS Code

[![Install in VS Code](https://img.shields.io/badge/VS_Code-Install_Server-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=tacticalrmm&config=%7B%22command%22%3A%20%22npx%22%2C%20%22args%22%3A%20%5B%22-y%22%2C%20%22%40nightsquawktech/tacticalrmm-mcp-server%22%5D%2C%20%22env%22%3A%20%7B%22TACTICALRMM_BASE_URL%22%3A%20%22https%3A//api.yourdomain.com%22%2C%20%22TACTICALRMM_API_KEY%22%3A%20%22your-api-key%22%2C%20%22TACTICALRMM_TIMEOUT_MS%22%3A%20%2230000%22%7D%7D)

**bash (macOS/Linux):**

```bash
TACTICALRMM_BASE_URL="https://api.yourdomain.com"
TACTICALRMM_API_KEY="your-api-key"

code --add-mcp '{"name":"tacticalrmm","command":"npx","args":["-y","@nightsquawktech/tacticalrmm-mcp-server"],"env":{"TACTICALRMM_BASE_URL":"'"$TACTICALRMM_BASE_URL"'","TACTICALRMM_API_KEY":"'"$TACTICALRMM_API_KEY"'"}}'
```

**PowerShell (Windows):**

```powershell
$TACTICALRMM_BASE_URL = "https://api.yourdomain.com"
$TACTICALRMM_API_KEY = "your-api-key"

$config = @{
  name = "tacticalrmm"
  command = "npx"
  args = @("-y", "@nightsquawktech/tacticalrmm-mcp-server")
  env = @{
    TACTICALRMM_BASE_URL = $TACTICALRMM_BASE_URL
    TACTICALRMM_API_KEY = $TACTICALRMM_API_KEY
  }
} | ConvertTo-Json -Compress

code --add-mcp $config
```

### Codex

**bash (macOS/Linux):**

```bash
TACTICALRMM_BASE_URL="https://api.yourdomain.com"
TACTICALRMM_API_KEY="your-api-key"

codex mcp add tacticalrmm \
  --env TACTICALRMM_BASE_URL="$TACTICALRMM_BASE_URL" \
  --env TACTICALRMM_API_KEY="$TACTICALRMM_API_KEY" \
  -- npx -y @nightsquawktech/tacticalrmm-mcp-server
```

**PowerShell (Windows):**

```powershell
$TACTICALRMM_BASE_URL = "https://api.yourdomain.com"
$TACTICALRMM_API_KEY = "your-api-key"

codex mcp add tacticalrmm `
  --env "TACTICALRMM_BASE_URL=$TACTICALRMM_BASE_URL" `
  --env "TACTICALRMM_API_KEY=$TACTICALRMM_API_KEY" `
  -- npx -y @nightsquawktech/tacticalrmm-mcp-server
```

Or add it to `~/.codex/config.toml` under `[mcp_servers.tacticalrmm]`.

### mcp.json

Every environment variable the server reads, with recommended values:

```json
{
  "mcpServers": {
    "tacticalrmm": {
      "command": "npx",
      "args": ["-y", "@nightsquawktech/tacticalrmm-mcp-server"],
      "env": {
        "TACTICALRMM_BASE_URL": "https://api.yourdomain.com",
        "TACTICALRMM_API_KEY": "your-api-key",
        "TACTICALRMM_TIMEOUT_MS": "30000"
      }
    }
  }
}
```

File locations: `.mcp.json` in your project root (Claude Code), `claude_desktop_config.json` (Claude Desktop), `.cursor/mcp.json` (Cursor).

## Configuration

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `TACTICALRMM_BASE_URL` | yes | | Your TacticalRMM API URL, e.g. `https://api.yourdomain.com` |
| `TACTICALRMM_API_KEY` | yes | | API key from Settings > Global Settings > API Keys |
| `TACTICALRMM_TIMEOUT_MS` | no | `30000` | HTTP timeout for API requests, minimum 1000 |

## Security & write safety

TacticalRMM credentials: create a dedicated API key in Settings > Global Settings > API Keys, scoped to a read-only user role if your instance uses roles.

- This server exposes **zero write operations**. It cannot modify agents, run scripts, or change anything on your RMM.
- All requests go directly from your machine to your TacticalRMM instance; nothing passes through third parties.

> [!IMPORTANT]
> The tool surface is a guardrail, not a security boundary. The env vars in your MCP config are real credentials, and an AI agent with shell access can bypass the MCP tools and call the TacticalRMM API directly with them. If you need hard read-only, enforce it at the source: scope the API key's user role to read-only permissions in TacticalRMM.

## Tools

```
tacticalrmm_get_server_info               TacticalRMM server version and info
tacticalrmm_list_clients                  List clients
tacticalrmm_list_sites                    List sites
tacticalrmm_list_agents                   List agents with filters
tacticalrmm_get_agent                     Get one agent's details
tacticalrmm_list_agent_checks             Checks on an agent
tacticalrmm_list_agent_tasks              Automated tasks on an agent
tacticalrmm_list_agent_services           Windows services on an agent
tacticalrmm_list_agent_software           Installed software on an agent
tacticalrmm_list_agent_notes              Notes on an agent
tacticalrmm_list_agent_history            Command/script history for an agent
tacticalrmm_list_agent_pending_actions    Pending actions for an agent
tacticalrmm_list_win_updates              Windows updates for an agent
tacticalrmm_list_checks                   List checks across agents
tacticalrmm_get_check_history             History datapoints for a check
tacticalrmm_list_alerts                   List alerts
tacticalrmm_list_tasks                    List automated tasks
tacticalrmm_list_policies                 List automation policies
tacticalrmm_list_scripts                  List scripts
tacticalrmm_list_pending_actions          Pending actions across all agents
tacticalrmm_get_custom_fields             Custom field definitions
tacticalrmm_get_audit_logs                Query audit logs
```

## API coverage

22 operations covered. All read-only; TacticalRMM uses PATCH request bodies for some query endpoints (alerts, check history, audit logs).

| Category | Operations |
|---|---|
| Agents | 10 |
| Monitoring | 3 |
| Automation | 3 |
| Organization | 2 |
| System | 4 |

<details>
<summary><strong>Agents</strong> (10 operations)</summary>

| Method | Path | Tool |
|---|---|---|
| GET | `/agents/` | `tacticalrmm_list_agents` |
| GET | `/agents/{agent_id}/` | `tacticalrmm_get_agent` |
| GET | `/agents/{agent_id}/checks/` | `tacticalrmm_list_agent_checks` |
| GET | `/agents/{agent_id}/tasks/` | `tacticalrmm_list_agent_tasks` |
| GET | `/services/{agent_id}/` | `tacticalrmm_list_agent_services` |
| GET | `/software/{agent_id}/` | `tacticalrmm_list_agent_software` |
| GET | `/agents/{agent_id}/notes/` | `tacticalrmm_list_agent_notes` |
| GET | `/agents/{agent_id}/history/` | `tacticalrmm_list_agent_history` |
| GET | `/agents/{agent_id}/pendingactions/` | `tacticalrmm_list_agent_pending_actions` |
| GET | `/winupdate/{agent_id}/` | `tacticalrmm_list_win_updates` |

</details>

<details>
<summary><strong>Monitoring</strong> (3 operations)</summary>

| Method | Path | Tool |
|---|---|---|
| GET | `/checks/` | `tacticalrmm_list_checks` |
| PATCH | `/checks/{check_id}/history/` | `tacticalrmm_get_check_history` |
| PATCH | `/alerts/` | `tacticalrmm_list_alerts` |

</details>

<details>
<summary><strong>Automation</strong> (3 operations)</summary>

| Method | Path | Tool |
|---|---|---|
| GET | `/tasks/` | `tacticalrmm_list_tasks` |
| GET | `/scripts/` | `tacticalrmm_list_scripts` |
| GET | `/automation/policies/` | `tacticalrmm_list_policies` |

</details>

<details>
<summary><strong>Organization</strong> (2 operations)</summary>

| Method | Path | Tool |
|---|---|---|
| GET | `/clients/` | `tacticalrmm_list_clients` |
| GET | `/clients/sites/` | `tacticalrmm_list_sites` |

</details>

<details>
<summary><strong>System</strong> (4 operations)</summary>

| Method | Path | Tool |
|---|---|---|
| GET | `/core/version/` + `/core/dashinfo/` | `tacticalrmm_get_server_info` |
| GET | `/core/customfields/` | `tacticalrmm_get_custom_fields` |
| GET | `/logs/pendingactions/` | `tacticalrmm_list_pending_actions` |
| PATCH | `/logs/audit/` | `tacticalrmm_get_audit_logs` |

</details>

## Contributing

Contributions and issues are welcome. Please open an issue first before submitting a PR.

## License

AGPL-3.0: free for personal and open-source use. Organizations that cannot comply with the AGPL can purchase a commercial license, and hosted/managed versions are available. See [COMMERCIAL.md](https://github.com/NightSquawk/tacticalrmm-mcp-server/blob/v1.0.0/COMMERCIAL.md) or contact hello@nightsquawk.tech.

### Copyright

For copyright concerns or takedown requests, contact hello@nightsquawk.tech.
