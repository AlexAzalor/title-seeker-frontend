import { afterEach, describe, expect, test } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { RatingDiff } from "@/components/audit-log/audit-log-rating-diff";
import { TYPE_KEYS } from "@/components/movie/rating/utils";
import { Language, RatingCriterion } from "@/orval_api/model";
import en from "../../messages/en.json";
import uk from "../../messages/uk.json";

afterEach(cleanup);

describe("rating audit log labels", () => {
  test.each([
    [Language.en, en],
    [Language.uk, uk],
  ] as const)(
    "uses Rating translations for all criteria in %s",
    (locale, messages) => {
      const criteria = Object.fromEntries(
        TYPE_KEYS.map((key) => [key, { old: 1, new: 2 }]),
      );
      render(
        <NextIntlClientProvider locale={locale} messages={messages}>
          <RatingDiff
            userName="Alex"
            changes={{
              user_rating: {
                rating: { old: 5, new: 6 },
                ...criteria,
                unknown_field: { old: 1, new: 2 },
              },
              overall_rating: { production_design: { old: 1, new: 2 } },
              rating_criterion_type: {
                old: RatingCriterion.basic,
                new: RatingCriterion.scare_factor,
              },
            }}
          />
        </NextIntlClientProvider>,
      );
      expect(screen.getByText(messages.Rating.name)).toBeDefined();
      for (const key of TYPE_KEYS) {
        expect(
          screen.getAllByText(messages.Rating[key].name).length,
        ).toBeGreaterThan(0);
      }
      expect(screen.getByText("unknown_field")).toBeDefined();
      expect(screen.getByText(messages.Rating.basic)).toBeDefined();
      const row = screen
        .getAllByText(messages.Rating.production_design.name)[0]
        .closest("li")!;
      expect(within(row).getAllByText("1")).toHaveLength(2);
      expect(within(row).getByText("2")).toBeDefined();
    },
  );
});
