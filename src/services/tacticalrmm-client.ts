import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import type { TacticalRmmConfig, TacticalRmmMethod } from "../types.js";

export class TacticalRmmClient {
  private readonly http: AxiosInstance;

  constructor(config: TacticalRmmConfig) {
    this.http = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeoutMs,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-API-KEY": config.apiKey
      }
    });
  }

  async request<T>(
    method: TacticalRmmMethod,
    path: string,
    options: Pick<AxiosRequestConfig, "data" | "params"> = {}
  ): Promise<T> {
    const response = await this.http.request<T>({
      method,
      url: normalizePath(path),
      ...options
    });

    return response.data;
  }

  get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    return this.request<T>("GET", path, { params });
  }

  query<T>(path: string, data?: Record<string, unknown>): Promise<T> {
    return this.request<T>("PATCH", path, { data });
  }
}

function normalizePath(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  if (cleanPath.includes("?") || cleanPath.endsWith("/")) {
    return cleanPath;
  }

  return `${cleanPath}/`;
}
