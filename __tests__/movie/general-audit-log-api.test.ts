import axios, { type AxiosRequestConfig } from "axios";
import { afterEach, describe, expect, test, vi } from "vitest";

vi.mock("@/auth", () => ({
  auth: async () => ({ user: { role: "admin", uuid: "admin-id" } }),
}));
vi.mock("@/proxy", () => ({ checkIfAdmin: () => true }));
vi.mock("@/app/(app)/services/global-api", () => ({
  fetchSettings: async () => ({
    backendURL: { baseURL: "https://api.example" },
  }),
}));

import { getGeneralAuditLogs } from "@/app/(app)/services/admin-api";

afterEach(() => vi.restoreAllMocks());

describe("general audit log API", () => {
  test("serializes included and excluded event types as repeated query parameters", async () => {
    const get = vi.spyOn(axios, "get").mockResolvedValue({ data: {} });

    await getGeneralAuditLogs(
      {
        event_type: ["movie.created", "movie.visited"],
        exclude_event_type: ["movie.title.updated", "movie.poster.updated"],
      },
      "next-page",
    );

    const [url, config] = get.mock.calls[0] as [string, AxiosRequestConfig];
    const query = new URL(axios.getUri({ ...config, url })).searchParams;
    expect(query.getAll("event_type")).toEqual([
      "movie.created",
      "movie.visited",
    ]);
    expect(query.getAll("exclude_event_type")).toEqual([
      "movie.title.updated",
      "movie.poster.updated",
    ]);
    expect(query.get("cursor")).toBe("next-page");
    expect(query.get("user_uuid")).toBe("admin-id");
    expect(query.has("event_type[]")).toBe(false);
    expect(query.has("exclude_event_type[]")).toBe(false);
  });
});
