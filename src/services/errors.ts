import axios from "axios";

export function formatApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const status = error.response.status;
      const detail = formatErrorData(error.response.data);

      if (status === 401 || status === 403) {
        return `TacticalRMM denied the request (${status}). Check the API key and the selected user's role permissions.${detail}`;
      }

      if (status === 404) {
        return `TacticalRMM resource not found (404). Check IDs and confirm the endpoint keeps its trailing slash.${detail}`;
      }

      if (status === 429) {
        return `TacticalRMM rate limited the request (429). Retry later or reduce request volume.${detail}`;
      }

      return `TacticalRMM API request failed (${status}).${detail}`;
    }

    if (error.code === "ECONNABORTED") {
      return "TacticalRMM API request timed out. Increase TACTICALRMM_TIMEOUT_MS or narrow the query.";
    }

    if (error.code) {
      return `TacticalRMM API connection failed (${error.code}). Check TACTICALRMM_BASE_URL and network access.`;
    }
  }

  return `Unexpected TacticalRMM error: ${error instanceof Error ? error.message : String(error)}`;
}

function formatErrorData(data: unknown): string {
  if (data === undefined || data === null) {
    return "";
  }

  if (typeof data === "string") {
    return ` Response: ${data}`;
  }

  try {
    return ` Response: ${JSON.stringify(data)}`;
  } catch {
    return "";
  }
}
