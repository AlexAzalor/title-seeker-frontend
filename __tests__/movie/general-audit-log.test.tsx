import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, test, vi } from "vitest";
import { GeneralAuditLog } from "@/components/audit-log/general-audit-log";
import { LatestEvent } from "@/components/audit-log/latest-event";
import type { AuditLogSummaryOut } from "@/orval_api/model";
import en from "../../messages/en.json";
import uk from "../../messages/uk.json";

const { getAuditLogUsers, getGeneralAuditLogs } = vi.hoisted(() => ({
  getAuditLogUsers: vi.fn(),
  getGeneralAuditLogs: vi.fn(),
}));

vi.mock("@/app/(app)/services/admin-api", () => ({
  getAuditLogUsers,
  getGeneralAuditLogs,
}));

const event: AuditLogSummaryOut = {
  id: 1,
  created_at: "2025-01-02T03:04:00Z",
  entity_key: "example",
  entity_poster: null,
  entity_title: "Example movie",
  entity_type: "movie",
  event_type: "movie.created",
  user_id: null,
  user_name: null,
  user_role: null,
};

const renderWithLocale = (ui: React.ReactNode, locale = "en") =>
  render(
    <NextIntlClientProvider
      locale={locale}
      messages={locale === "en" ? en : uk}
    >
      {ui}
    </NextIntlClientProvider>,
  );

afterEach(() => {
  cleanup();
  getAuditLogUsers.mockReset();
  getGeneralAuditLogs.mockReset();
});

describe("audit event type filters", () => {
  test("includes and excludes event types independently, and clears them", async () => {
    getAuditLogUsers.mockResolvedValue({
      status: 200,
      data: { users: [] },
    });
    getGeneralAuditLogs.mockResolvedValue({
      status: 200,
      data: { groups: [], next_cursor: null, latest_event: null },
    });

    renderWithLocale(<GeneralAuditLog posterURL="" />);
    const created = screen.getByRole("button", {
      name: en.AuditLog.events.movieCreated,
    });
    const excludeCreated = screen.getByRole("button", {
      name: `Exclude ${en.AuditLog.events.movieCreated}`,
    });
    const excludeVisited = screen.getByRole("button", {
      name: `Exclude ${en.AuditLog.events.movieVisited}`,
    });
    const collection = screen.getByRole("button", {
      name: en.AuditLog.events.collectionUpdated,
    });
    fireEvent.click(collection);
    await waitFor(() =>
      expect(getGeneralAuditLogs).toHaveBeenLastCalledWith(
        expect.objectContaining({ event_type: ["movie.collection.updated"] }),
        undefined,
      ),
    );
    fireEvent.click(collection);
    expect(
      created.firstElementChild?.classList.contains("lucide-clapperboard"),
    ).toBe(true);
    expect(created.firstElementChild?.getAttribute("aria-hidden")).toBe("true");

    fireEvent.click(created);
    fireEvent.click(excludeVisited);
    await waitFor(() =>
      expect(getGeneralAuditLogs).toHaveBeenLastCalledWith(
        expect.objectContaining({
          event_type: ["movie.created"],
          exclude_event_type: ["movie.visited"],
        }),
        undefined,
      ),
    );
    expect(created.getAttribute("aria-pressed")).toBe("true");
    expect(excludeVisited.getAttribute("aria-pressed")).toBe("true");

    fireEvent.click(excludeCreated);
    await waitFor(() =>
      expect(getGeneralAuditLogs).toHaveBeenLastCalledWith(
        expect.objectContaining({
          event_type: [],
          exclude_event_type: ["movie.visited", "movie.created"],
        }),
        undefined,
      ),
    );
    expect(created.getAttribute("aria-pressed")).toBe("false");
    expect(excludeCreated.getAttribute("aria-pressed")).toBe("true");

    fireEvent.click(created);
    expect(excludeCreated.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(excludeVisited);
    expect(excludeVisited.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(excludeVisited);
    fireEvent.click(
      screen.getByRole("button", { name: en.AuditLog.resetFilters }),
    );
    await waitFor(() =>
      expect(getGeneralAuditLogs).toHaveBeenLastCalledWith(
        expect.objectContaining({ event_type: [], exclude_event_type: [] }),
        undefined,
      ),
    );

    fireEvent.click(excludeCreated);
    fireEvent.click(
      screen.getByRole("button", { name: en.AuditLog.filterSimilarMovies }),
    );
    expect(
      screen
        .getByRole("button", { name: en.AuditLog.events.similarMoviesUpdated })
        .firstElementChild?.classList.contains("lucide-boxes"),
    ).toBe(true);
    await waitFor(() =>
      expect(getGeneralAuditLogs).toHaveBeenLastCalledWith(
        expect.objectContaining({
          category: "similar_movies",
          event_type: [],
          exclude_event_type: [],
        }),
        undefined,
      ),
    );
  });
});

describe("latest audit event", () => {
  test.each([
    ["en", en],
    ["uk", uk],
  ] as const)("renders the collection event label in %s", (locale, messages) => {
    renderWithLocale(
      <LatestEvent
        event={{ ...event, event_type: "movie.collection.updated" }}
        isLoading={false}
        posterURL=""
      />,
      locale,
    );
    expect(
      screen.getByText(messages.AuditLog.events.collectionUpdated),
    ).toBeDefined();
  });

  test.each([
    ["en", en],
    ["uk", uk],
  ] as const)("renders translated event details in %s", (locale, messages) => {
    renderWithLocale(
      <LatestEvent event={event} isLoading={false} posterURL="" />,
      locale,
    );

    const section = screen.getByRole("region", {
      name: messages.AuditLog.latestEvent,
    });
    expect(section.getAttribute("aria-busy")).toBe("false");
    expect(
      within(section).getByText(messages.AuditLog.events.movieCreated),
    ).toBeDefined();
    expect(
      within(section).getByText(messages.AuditLog.anonymous),
    ).toBeDefined();
    expect(within(section).getByRole("link").getAttribute("href")).toBe(
      "/movies/example",
    );
    expect(within(section).getByText("Example movie")).toBeDefined();
    expect(section.querySelector("time")?.getAttribute("datetime")).toBe(
      event.created_at,
    );
  });

  test("hides the section when no event was returned", () => {
    renderWithLocale(
      <LatestEvent event={null} isLoading={false} posterURL="" />,
    );
    expect(
      screen.queryByRole("region", { name: en.AuditLog.latestEvent }),
    ).toBeNull();
  });

  test("removes the skeleton and displays the error when the fetch fails", async () => {
    let rejectFetch!: (reason: Error) => void;
    getAuditLogUsers.mockResolvedValue({ status: 200, data: { users: [] } });
    getGeneralAuditLogs.mockImplementationOnce(
      () =>
        new Promise((_, reject) => {
          rejectFetch = reject;
        }),
    );
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    try {
      renderWithLocale(<GeneralAuditLog posterURL="" />);
      expect(
        screen
          .getByRole("region", { name: en.AuditLog.latestEvent })
          .getAttribute("aria-busy"),
      ).toBe("true");

      await act(async () => {
        rejectFetch(new Error("network error"));
      });

      expect(
        screen.queryByRole("region", { name: en.AuditLog.latestEvent }),
      ).toBeNull();
      expect(screen.getByText(en.AuditLog.loadError)).toBeDefined();
      expect(consoleError).toHaveBeenCalled();
    } finally {
      consoleError.mockRestore();
    }
  });

  test("shows the skeleton during the initial fetch and filter reload", async () => {
    let resolveInitial!: (value: object) => void;
    let resolveReload!: (value: object) => void;
    getAuditLogUsers.mockResolvedValue({ status: 200, data: { users: [] } });
    getGeneralAuditLogs
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveInitial = resolve;
          }),
      )
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveReload = resolve;
          }),
      );

    renderWithLocale(<GeneralAuditLog posterURL="" />);
    const section = () =>
      screen.getByRole("region", { name: en.AuditLog.latestEvent });
    expect(section().getAttribute("aria-busy")).toBe("true");
    expect(section().querySelector('[data-slot="skeleton"]')).not.toBeNull();

    await act(async () => {
      resolveInitial({
        status: 200,
        data: { groups: [], next_cursor: null, latest_event: event },
      });
    });
    expect(within(section()).getByText("Example movie")).toBeDefined();
    expect(section().getAttribute("aria-busy")).toBe("false");

    fireEvent.click(
      screen.getByRole("button", { name: en.AuditLog.newestFirst }),
    );
    await waitFor(() => expect(getGeneralAuditLogs).toHaveBeenCalledTimes(2));
    expect(section().getAttribute("aria-busy")).toBe("true");
    expect(section().querySelector('[data-slot="skeleton"]')).not.toBeNull();
    expect(within(section()).queryByText("Example movie")).toBeNull();

    await act(async () => {
      resolveReload({
        status: 200,
        data: { groups: [], next_cursor: null, latest_event: null },
      });
    });
    expect(
      screen.queryByRole("region", { name: en.AuditLog.latestEvent }),
    ).toBeNull();
  });
});
