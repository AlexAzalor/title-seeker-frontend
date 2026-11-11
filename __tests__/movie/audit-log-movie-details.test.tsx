import { afterEach, describe, expect, test } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import en from "../../messages/en.json";
import uk from "../../messages/uk.json";
import { AuditLogItem } from "@/components/audit-log/audit-log-item";
import { formatDate } from "@/lib/utils";
import { Language, type AuditLogOut } from "@/orval_api/model";

afterEach(cleanup);

const changes = {
  en: { new: { location: "France 2" }, old: { location: "France" } },
  uk: { new: { location: "Франція 2" }, old: { location: "Франція" } },
  duration: { new: 111, old: 107 },
  release_date: {
    new: "1970-10-16T00:00:00+00:00",
    old: "1970-10-28T00:00:00",
  },
};

function renderLog(
  eventType: string,
  eventChanges: Record<string, unknown>,
  locale: Language = Language.en,
) {
  const item: AuditLogOut = {
    id: 1115,
    event_type: eventType,
    user_id: 1,
    user_name: "Alex",
    user_role: "owner",
    changes: eventChanges,
    created_at: "2026-11-07T09:14:32.191466",
  };
  return render(
    <NextIntlClientProvider
      locale={locale}
      messages={locale === "uk" ? uk : en}
    >
      <ul>
        <AuditLogItem
          item={item}
          isLast
          movieTitle="Movie"
          posterUrl=""
          avatarUrl=""
        />
      </ul>
    </NextIntlClientProvider>,
  );
}

describe("movie details audit log", () => {
  test.each([
    [
      Language.en,
      "Movie details updated",
      "Duration",
      "Location (English)",
      "1h 47m",
      "1h 51m",
    ],
    [
      Language.uk,
      "Деталі фільму оновлено",
      "Тривалість",
      "Місце зйомок (англійською)",
      "1г 47хв",
      "1г 51хв",
    ],
  ] as const)(
    "renders old and new values in %s",
    (lang, heading, duration, location, oldDuration, newDuration) => {
      const { container } = renderLog("movie.details.updated", changes, lang);
      expect(screen.getByText(heading)).toBeDefined();
      const durationRow = screen.getByText(duration).closest("li")!;
      expect(within(durationRow).getByText(oldDuration)).toBeDefined();
      expect(within(durationRow).getByText(newDuration)).toBeDefined();
      expect(
        within(screen.getByText(location).closest("li")!).getByText("France"),
      ).toBeDefined();
      expect(screen.getByText("France 2")).toBeDefined();
      expect(screen.getByText("Франція")).toBeDefined();
      expect(screen.getByText("Франція 2")).toBeDefined();
      expect(
        screen.getByText(formatDate(changes.release_date.old, lang)),
      ).toBeDefined();
      expect(
        screen.getByText(formatDate(changes.release_date.new, lang)),
      ).toBeDefined();
      expect(container.textContent).not.toContain("[object Object]");
      expect(screen.queryByText("Before")).toBeNull();
    },
  );

  test("renders only changed fields and handles missing and invalid values", () => {
    renderLog("movie.details.updated", {
      uk: { old: { location: "Київ" }, new: { location: null } },
      release_date: { old: null, new: "invalid date" },
    });
    expect(screen.getByText("Київ")).toBeDefined();
    expect(screen.getAllByText("—")).toHaveLength(2);
    expect(screen.getByText("invalid date")).toBeDefined();
    expect(screen.queryByText("Duration")).toBeNull();
    expect(screen.queryByText("Location (English)")).toBeNull();
  });

  test("formats durations below and at an hour and preserves missing values", () => {
    renderLog("movie.details.updated", {
      duration: { old: 30, new: 60 },
    });
    expect(screen.getByText("0h 30m")).toBeDefined();
    expect(screen.getByText("1h 0m")).toBeDefined();
    cleanup();
    renderLog("movie.details.updated", {
      duration: { old: null, new: "invalid" },
    });
    expect(screen.getByText("—")).toBeDefined();
    expect(screen.getByText("invalid")).toBeDefined();
  });

  test("title updates retain the default before/after UI with a localized event label", () => {
    renderLog(
      "movie.title.updated",
      { title: { old: "Old title", new: "New title" } },
      Language.uk,
    );
    expect(screen.getByText("Назву оновлено")).toBeDefined();
    expect(screen.getByText("Було")).toBeDefined();
    expect(screen.getByText("Стало")).toBeDefined();
    expect(screen.getByText("Old title")).toBeDefined();
    expect(screen.getByText("New title")).toBeDefined();
  });
});
