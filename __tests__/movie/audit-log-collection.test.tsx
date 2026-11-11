import { cleanup, render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, test, vi } from "vitest";

import { AuditLogItem } from "@/components/audit-log/audit-log-item";
import { toCollectionChanges } from "@/components/audit-log/audit-log-collection-diff";
import type { AuditLogOut } from "@/orval_api/model";
import en from "../../messages/en.json";
import uk from "../../messages/uk.json";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

const base = {
  key: "base",
  title: { en: "Base", uk: "Основа" },
  poster: "base.webp",
  relation_type: "base",
  order: 1,
};
const sequel = {
  key: "sequel",
  title: { en: "Second", uk: "Другий" },
  poster: null,
  relation_type: "sequel",
  order: 2,
};
const third = {
  key: "third",
  title: { en: "Third" },
  poster: null,
  relation_type: "spin_off",
  order: null,
};

function renderLog(
  changes: Record<string, unknown>,
  locale: "en" | "uk" = "en",
) {
  const item: AuditLogOut = {
    id: 1,
    event_type: "movie.collection.updated",
    user_id: 1,
    user_name: "Alex",
    user_role: null,
    changes,
    created_at: "2026-11-07T09:14:32Z",
  };
  return render(
    <NextIntlClientProvider
      locale={locale}
      messages={locale === "en" ? en : uk}
    >
      <ul>
        <AuditLogItem
          item={item}
          isLast
          movieTitle="Base"
          posterUrl="https://example.com"
          avatarUrl=""
        />
      </ul>
    </NextIntlClientProvider>,
  );
}

afterEach(cleanup);

describe("movie collection audit log", () => {
  test.each([
    ["en", en],
    ["uk", uk],
  ] as const)("renders additions and removals in %s", (locale, messages) => {
    const { container } = renderLog(
      { collection: { old: [base, sequel], new: [base, third] } },
      locale,
    );
    expect(
      screen.getByText(messages.AuditLog.events.collectionUpdated),
    ).toBeDefined();
    expect(screen.getByText(messages.AuditLog.before)).toBeDefined();
    expect(screen.getByText(messages.AuditLog.after)).toBeDefined();
    const removed = screen
      .getByRole("link", {
        name: locale === "uk" ? "Другий" : "Second",
      })
      .closest("li")!;
    const added = screen.getByRole("link", { name: "Third" }).closest("li")!;
    expect(
      within(removed).getByText(messages.AuditLog.status.removed),
    ).toBeDefined();
    expect(
      within(added).getByText(messages.AuditLog.status.added),
    ).toBeDefined();
    expect(
      within(added).getByText(messages.AuditLog.collectionRelations.spin_off),
    ).toBeDefined();
    expect(within(added).getByText("—")).toBeDefined();
    expect(within(added).getByRole("link").getAttribute("href")).toBe(
      "/movies/third",
    );
    expect(container.querySelector("img")).not.toBeNull();
    expect(container.textContent).not.toContain("[object Object]");
  });

  test("shows both ordering and relation changes for the same movie", () => {
    renderLog({
      collection: {
        old: [sequel],
        new: [{ ...sequel, order: 3, relation_type: "prequel" }],
      },
    });
    const links = screen.getAllByRole("link", { name: "Second" });
    const updated = links[1].closest("li")!;
    expect(within(updated).getAllByText(/Prequel/).length).toBeGreaterThan(0);
    expect(within(updated).queryByText("Added")).toBeNull();
    expect(screen.queryByText("Removed")).toBeNull();
  });

  test.each([
    ["en", en],
    ["uk", uk],
  ] as const)("explains creation and dissolution in %s", (locale, messages) => {
    renderLog({ collection: { old: [], new: [base, sequel] } }, locale);
    expect(
      screen.getByText(messages.AuditLog.collectionCreatedFromStandalone),
    ).toBeDefined();
    expect(screen.queryByText(messages.AuditLog.emptyValue)).toBeNull();

    cleanup();
    renderLog({ collection: { old: [base, sequel], new: [] } }, locale);
    expect(
      screen.getByText(messages.AuditLog.collectionDissolvedToStandalone),
    ).toBeDefined();
    expect(screen.queryByText(messages.AuditLog.emptyValue)).toBeNull();
  });

  test.each([
    [[], [sequel], "Added"],
    [[sequel], [], "Removed"],
  ])(
    "does not mistake trimmed changes for a collection transition",
    (old, next, status) => {
      renderLog({ collection: { old, new: next } });
      expect(screen.getByText(en.AuditLog.emptyValue)).toBeDefined();
      expect(screen.getByText(status)).toBeDefined();
      expect(
        screen.queryByText(en.AuditLog.collectionCreatedFromStandalone),
      ).toBeNull();
      expect(
        screen.queryByText(en.AuditLog.collectionDissolvedToStandalone),
      ).toBeNull();
    },
  );

  test("does not infer a transition from two empty lists", () => {
    renderLog({ collection: { old: [], new: [] } });
    expect(screen.getAllByText(en.AuditLog.emptyValue)).toHaveLength(2);
  });

  test("rejects malformed snapshots instead of treating them as collection entries", () => {
    expect(
      toCollectionChanges({ collection: { old: [], new: [{ key: "x" }] } }),
    ).toBeNull();
    expect(
      toCollectionChanges({ collection: { old: null, new: [] } }),
    ).toBeNull();
    expect(toCollectionChanges({})).toBeNull();
  });
});
