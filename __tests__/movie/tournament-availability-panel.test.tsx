import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { SessionProvider } from "next-auth/react";
import { afterEach, expect, it, vi } from "vitest";
import type { ComponentProps } from "react";
import messages from "../../messages/en.json";
import { SettingsView } from "@/components/movie-tournament/settings-view";
import { initialSettings } from "@/components/movie-tournament/types";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it("updates the floating appearance without changing the availability controls", () => {
  let notify: IntersectionObserverCallback | undefined;
  const disconnect = vi.fn();
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        notify = callback;
      }
      observe() {}
      disconnect() {
        disconnect();
      }
    },
  );
  const start = vi.fn();
  const reset = vi.fn();
  const retryAvailability = vi.fn();
  const props: ComponentProps<typeof SettingsView> = {
    settings: initialSettings,
    setSettings: vi.fn(),
    genres: [],
    specifications: [],
    popular: [],
    universes: [],
    universesLoading: false,
    universesError: false,
    retryUniverses: vi.fn(),
    optionsLoading: false,
    optionsError: false,
    popularError: false,
    retryOptions: vi.fn(),
    retryPopular: vi.fn(),
    availability: { loading: false, total: 20, error: false },
    retryAvailability,
    reset,
    start,
  };
  const renderSettings = () => (
    <NextIntlClientProvider locale="en" messages={messages}>
      <SessionProvider session={null}>
        <SettingsView {...props} />
      </SessionProvider>
    </NextIntlClientProvider>
  );
  const { rerender, unmount } = render(renderSettings());
  const panel = screen.getByTestId("tournament-availability-panel");
  expect(panel.className).toContain("sticky");
  expect(panel.className).not.toContain("shadow-lg");

  const entry = {
    boundingClientRect: { top: 900 },
    rootBounds: { bottom: 800 },
  } as IntersectionObserverEntry;
  act(() => notify?.([entry], {} as IntersectionObserver));
  expect(panel.className).toContain("shadow-lg");
  fireEvent.click(screen.getByRole("button", { name: "Start tournament" }));
  fireEvent.click(screen.getByRole("button", { name: "Reset settings" }));
  expect(start).toHaveBeenCalledOnce();
  expect(reset).toHaveBeenCalledOnce();

  act(() =>
    notify?.(
      [
        {
          ...entry,
          boundingClientRect: { ...entry.boundingClientRect, top: 700 },
        },
      ],
      {} as IntersectionObserver,
    ),
  );
  expect(panel.className).not.toContain("shadow-lg");
  const sentinel = screen.getByTestId("tournament-availability-end");
  const rect = vi.spyOn(sentinel, "getBoundingClientRect");
  rect.mockReturnValue(new DOMRect(0, window.innerHeight + 20, 1, 1));
  fireEvent.scroll(window);
  expect(panel.className).toContain("shadow-lg");
  rect.mockReturnValue(new DOMRect(0, -20, 1, 1));
  fireEvent.scroll(window);
  expect(panel.className).not.toContain("shadow-lg");
  props.availability = { loading: false, total: 10, error: false };
  rerender(renderSettings());
  expect(
    screen
      .getByRole("button", { name: "Start tournament" })
      .hasAttribute("disabled"),
  ).toBe(true);
  props.availability = { loading: true, total: null, error: false };
  rerender(renderSettings());
  expect(
    screen.getByText("Generating a movie pool and checking availability…"),
  ).toBeDefined();
  expect(
    screen
      .getByRole("button", { name: "Start tournament" })
      .hasAttribute("disabled"),
  ).toBe(true);
  props.availability = { loading: false, total: null, error: true };
  rerender(renderSettings());
  fireEvent.click(screen.getByRole("button", { name: "Retry" }));
  expect(retryAvailability).toHaveBeenCalledOnce();
  unmount();
  expect(disconnect).toHaveBeenCalledOnce();
});
